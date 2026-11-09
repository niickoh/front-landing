import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiError, TuiIcon, TuiInput, TuiRadio, TuiTextfield } from '@taiga-ui/core';
import { TuiBlock, TuiButtonLoading } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { ContentService } from '../../services/content.service';
import {
  CondicionEdad,
  Experiencia,
  InscripcionService,
  PreinscripcionPayload,
  Rol,
} from '../../services/inscripcion.service';
import { NotificationService } from '../../services/notification.service';
import { Subject, debounceTime, exhaustMap, from } from 'rxjs';

/** Ventana en la que varios clics en "Enviar" cuentan como uno solo. */
const SUBMIT_DEBOUNCE_MS = 400;

interface FormModel {
  nombre_completo: string;
  fecha_nacimiento: string;
  experiencia: Experiencia | null;
  ultimo_equipo: string;
  rol: Rol | null;
  nivel_gimnasia: string;
  telefono: string;
  email: string;
  apoderado_nombre: string;
  apoderado_telefono: string;
  apoderado_email: string;
}

type Field = keyof FormModel | 'edad_temporada' | 'condicion_edad';

interface Option<T> {
  label: string;
  value: T;
}

const EMPTY_FORM: FormModel = {
  nombre_completo: '',
  fecha_nacimiento: '',
  experiencia: null,
  ultimo_equipo: '',
  rol: null,
  nivel_gimnasia: '',
  telefono: '',
  email: '',
  apoderado_nombre: '',
  apoderado_telefono: '',
  apoderado_email: '',
};

// Mismas reglas que valida el formulario de Google (y el backend).
const CELULAR_CL = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MSG_CELULAR = 'Ingresa un celular chileno válido. Ejemplo: +56912345678.';
const MSG_EMAIL = 'Ingresa una dirección de correo electrónico válida.';

@Component({
  selector: 'app-inscripcion',
  imports: [
    FormsModule,
    RouterLink,
    TuiButton,
    TuiButtonLoading,
    TuiBlock,
    TuiCardLarge,
    TuiError,
    TuiIcon,
    TuiInput,
    TuiRadio,
    TuiTextfield,
  ],
  templateUrl: './inscripcion.html',
})
export class Inscripcion {
  private readonly content = inject(ContentService);
  private readonly inscripciones = inject(InscripcionService);
  private readonly notifications = inject(NotificationService);

  protected readonly page = this.content.value.inscripcion;
  protected readonly temporada = this.page.temporada;

  protected readonly experienciaOptions: Option<Experiencia>[] = [
    { label: 'Sin experiencia previa', value: 'sin_experiencia' },
    { label: 'Con experiencia', value: 'con_experiencia' },
  ];
  protected readonly rolOptions: Option<Rol>[] = [
    { label: 'Base', value: 'base' },
    { label: 'Flyer', value: 'flyer' },
    { label: 'Ambos', value: 'ambos' },
  ];
  protected readonly condicionOptions: Option<CondicionEdad>[] = [
    { label: 'Menor de 18 años', value: 'menor_18' },
    { label: '18 años o más', value: 'mayor_18' },
  ];

  /** Límites del selector de fecha: hoy y 100 años antes del cierre de temporada. */
  protected readonly maxFecha = new Date().toLocaleDateString('en-CA');
  protected readonly minFecha = `${this.temporada - 100}-01-01`;

  protected readonly form = signal<FormModel>({ ...EMPTY_FORM });
  protected readonly touched = signal<Partial<Record<Field, boolean>>>({});
  protected readonly serverErrors = signal<Partial<Record<Field, string>>>({});
  protected readonly submitted = signal(false);
  protected readonly isSending = signal(false);
  protected readonly sent = signal(false);

  /** Edad cumplida al 31 de diciembre de la temporada, calculada desde la fecha de nacimiento. */
  protected readonly edad = computed<number | null>(() => {
    const match = /^(\d{4})-\d{2}-\d{2}$/.exec(this.form().fecha_nacimiento);
    if (!match) {
      return null;
    }
    const edad = this.temporada - Number(match[1]);
    return edad >= 1 && edad <= 100 ? edad : null;
  });

  /** "¿Cuál será tu condición de edad al 31 de diciembre?": se deduce de la edad. */
  protected readonly condicion = computed<CondicionEdad | null>(() => {
    const edad = this.edad();
    return edad === null ? null : edad >= 18 ? 'mayor_18' : 'menor_18';
  });

  protected readonly errors = computed<Partial<Record<Field, string>>>(() => {
    const f = this.form();
    const t = (v: string) => v.trim();
    const e: Partial<Record<Field, string>> = {};

    // Misma regla que el backend: al menos primer nombre y apellido paterno, solo letras
    const nombre = t(f.nombre_completo).replace(/\s+/g, ' ');
    if (!nombre) {
      e.nombre_completo = 'Ingresa tu nombre completo.';
    } else if (!/^\p{L}[\p{L}'’-]* \p{L}[\p{L}'’-]*( \p{L}[\p{L}'’-]*)*$/u.test(nombre)) {
      e.nombre_completo = 'Ingresa al menos tu primer nombre y apellido paterno, solo con letras.';
    }
    if (!f.fecha_nacimiento) {
      e.fecha_nacimiento = 'Indica tu fecha de nacimiento.';
    } else if (f.fecha_nacimiento > this.maxFecha || this.edad() === null) {
      e.fecha_nacimiento = 'Ingresa una fecha de nacimiento válida.';
    }
    if (!f.experiencia) e.experiencia = 'Selecciona tu experiencia en cheerleading.';
    if (!t(f.ultimo_equipo)) {
      e.ultimo_equipo = 'Indica tu último equipo, año de participación y nivel.';
    }
    if (!f.rol) e.rol = 'Selecciona tu rol o posición.';
    if (!t(f.nivel_gimnasia)) e.nivel_gimnasia = 'Indica el nivel de gimnasia que has logrado.';

    if (this.condicion() === 'mayor_18') {
      if (!CELULAR_CL.test(t(f.telefono))) e.telefono = MSG_CELULAR;
      if (!EMAIL.test(t(f.email))) e.email = MSG_EMAIL;
    }
    if (this.condicion() === 'menor_18') {
      if (t(f.apoderado_nombre).length < 3) {
        e.apoderado_nombre = 'Ingresa el nombre y apellidos del apoderado.';
      }
      if (!CELULAR_CL.test(t(f.apoderado_telefono))) e.apoderado_telefono = MSG_CELULAR;
      if (!EMAIL.test(t(f.apoderado_email))) e.apoderado_email = MSG_EMAIL;
    }

    // El servidor tiene la última palabra (p. ej. edad que no calza con la fecha)
    return { ...this.serverErrors(), ...e };
  });

  protected readonly isValid = computed(() => Object.keys(this.errors()).length === 0);

  protected update<K extends keyof FormModel>(field: K, value: FormModel[K]): void {
    this.form.update((current) => ({ ...current, [field]: value }));
    this.serverErrors.update(({ [field]: _, ...rest }) => rest);
    if (field === 'fecha_nacimiento') {
      this.serverErrors.update(({ edad_temporada: _e, condicion_edad: _c, ...rest }) => rest);
    }
  }

  protected onText(field: keyof FormModel, value: string | null): void {
    this.update(field, (value ?? '') as never);
  }

  protected markTouched(field: Field): void {
    this.touched.update((current) => ({ ...current, [field]: true }));
  }

  protected showError(field: Field): boolean {
    return (!!this.touched()[field] || this.submitted()) && !!this.errors()[field];
  }

  protected errorFor(field: Field): string | null {
    return this.showError(field) ? (this.errors()[field] ?? null) : null;
  }

  /**
   * Evita inscripciones duplicadas por doble clic o Enter repetido:
   * - debounceTime: varios envíos seguidos se agrupan en uno solo.
   * - exhaustMap: mientras hay un envío en curso, los nuevos se ignoran.
   * El backend además rechaza (409) al mismo deportista dos veces en la temporada.
   */
  private readonly envios$ = new Subject<void>();

  constructor() {
    this.envios$
      .pipe(
        debounceTime(SUBMIT_DEBOUNCE_MS),
        exhaustMap(() => from(this.enviar())),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  protected onSubmit(): void {
    if (this.isSending() || this.sent()) {
      return;
    }
    this.envios$.next();
  }

  private async enviar(): Promise<void> {
    if (this.isSending() || this.sent()) {
      return;
    }
    this.submitted.set(true);
    if (!this.isValid()) {
      this.notifications.error(
        'Formulario incompleto',
        'Revisa los campos marcados antes de enviar tu pre-inscripción.',
      );
      return;
    }

    this.isSending.set(true);
    const result = await this.inscripciones.enviar(this.buildPayload());
    this.isSending.set(false);

    if (result.ok) {
      this.sent.set(true);
      this.notifications.success(this.page.successTitle, result.message);
      return;
    }

    if (result.status === 409) {
      this.notifications.warn('Pre-inscripción ya registrada', result.message);
      return;
    }

    this.serverErrors.set(result.fieldErrors as Partial<Record<Field, string>>);
    this.notifications.error('No se pudo enviar', result.message);
  }

  protected reset(): void {
    this.form.set({ ...EMPTY_FORM });
    this.touched.set({});
    this.serverErrors.set({});
    this.submitted.set(false);
    this.sent.set(false);
  }

  private buildPayload(): PreinscripcionPayload {
    const f = this.form();
    const condicion = this.condicion()!;
    const base: PreinscripcionPayload = {
      nombre_completo: f.nombre_completo.trim(),
      fecha_nacimiento: f.fecha_nacimiento,
      edad_temporada: this.edad()!,
      experiencia: f.experiencia!,
      ultimo_equipo: f.ultimo_equipo.trim(),
      rol: f.rol!,
      nivel_gimnasia: f.nivel_gimnasia.trim(),
      condicion_edad: condicion,
    };

    // Solo se envía la sección 3 que corresponde, igual que el salto de página del form de Google
    return condicion === 'mayor_18'
      ? { ...base, telefono: f.telefono.trim(), email: f.email.trim() }
      : {
          ...base,
          apoderado_nombre: f.apoderado_nombre.trim(),
          apoderado_telefono: f.apoderado_telefono.trim(),
          apoderado_email: f.apoderado_email.trim(),
        };
  }
}
