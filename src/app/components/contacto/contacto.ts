import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TuiButton,
  TuiCheckbox,
  TuiError,
  TuiIcon,
  TuiInput,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiButtonLoading,
  TuiChevron,
  TuiDataListWrapper,
  TuiSelect,
  TuiTextarea,
} from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { ContactService } from '../../services/contact.service';
import { NotificationService } from '../../services/notification.service';
import { ContentService } from '../../services/content.service';

interface ContactFormModel {
  nombre: string;
  edad: string;
  email: string;
  telefono: string;
  ciudad: string;
  experiencia: string | null;
  disponibilidad: string;
  mensaje: string;
  aceptaPolitica: boolean;
}

interface ContactFormErrors {
  nombre: string | null;
  edad: string | null;
  email: string | null;
  telefono: string | null;
  ciudad: string | null;
  experiencia: string | null;
  disponibilidad: string | null;
  mensaje: string | null;
  aceptaPolitica: string | null;
}

interface ExperienciaOption {
  label: string;
  value: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-contacto',
  imports: [
    FormsModule,
    TuiButton,
    TuiButtonLoading,
    TuiCheckbox,
    TuiError,
    TuiIcon,
    TuiInput,
    TuiTextfield,
    TuiAvatar,
    TuiChevron,
    TuiDataListWrapper,
    TuiSelect,
    TuiTextarea,
    TuiCardLarge,
  ],
  templateUrl: './contacto.html',
})
export class Contacto {
  private readonly contactService = inject(ContactService);
  private readonly notifications = inject(NotificationService);

  private readonly content = inject(ContentService);
  protected readonly contactSection = this.content.value.contactSection;

  protected readonly experienciaOptions: ExperienciaOption[] = [
    { label: 'Principiante', value: 'principiante' },
    { label: 'Intermedio', value: 'intermedio' },
    { label: 'Avanzado', value: 'avanzado' },
  ];

  protected readonly stringifyOption = (option: ExperienciaOption | null): string =>
    option?.label ?? '';

  protected readonly form = signal<ContactFormModel>({
    nombre: '',
    edad: '',
    email: '',
    telefono: '',
    ciudad: '',
    experiencia: null,
    disponibilidad: '',
    mensaje: '',
    aceptaPolitica: false,
  });

  protected readonly touched = signal<Record<keyof ContactFormModel, boolean>>({
    nombre: false,
    edad: false,
    email: false,
    telefono: false,
    ciudad: false,
    experiencia: false,
    disponibilidad: false,
    mensaje: false,
    aceptaPolitica: false,
  });

  /** Taiga's select works with the option object; the form keeps only its value. */
  protected readonly experienciaOption = computed(
    () => this.experienciaOptions.find((o) => o.value === this.form().experiencia) ?? null,
  );

  protected readonly submitted = signal(false);
  protected readonly isSending = signal(false);

  protected readonly errors = computed<ContactFormErrors>(() => {
    const {
      nombre,
      edad,
      email,
      telefono,
      ciudad,
      experiencia,
      disponibilidad,
      mensaje,
      aceptaPolitica,
    } = this.form();

    return {
      nombre: !nombre.trim()
        ? 'El nombre es obligatorio.'
        : nombre.trim().length < 3
          ? 'Debe tener al menos 3 caracteres.'
          : null,
      edad: !edad.trim()
        ? 'La edad es obligatoria.'
        : Number.isNaN(Number(edad)) || Number(edad) <= 0
          ? 'Ingresa una edad válida.'
          : null,
      email: !email.trim()
        ? 'El correo electrónico es obligatorio.'
        : !EMAIL_PATTERN.test(email.trim())
          ? 'Ingresa un correo electrónico válido.'
          : null,
      telefono: !telefono.trim()
        ? 'El teléfono o WhatsApp es obligatorio.'
        : telefono.trim().length < 8
          ? 'Ingresa un teléfono válido.'
          : null,
      ciudad: !ciudad.trim() ? 'La ciudad o comuna es obligatoria.' : null,
      experiencia: !experiencia ? 'Selecciona tu nivel de experiencia.' : null,
      disponibilidad: !disponibilidad.trim()
        ? 'La disponibilidad es obligatoria.'
        : disponibilidad.trim().length < 3
          ? 'Describe tu disponibilidad.'
          : null,
      mensaje: !mensaje.trim()
        ? 'La motivación es obligatoria.'
        : mensaje.trim().length < 15
          ? 'Escribe al menos 15 caracteres.'
          : null,
      aceptaPolitica: !aceptaPolitica ? 'Debes aceptar la política de contacto.' : null,
    };
  });

  protected readonly isValid = computed(() => {
    const errors = this.errors();
    return (
      !errors.nombre &&
      !errors.edad &&
      !errors.email &&
      !errors.telefono &&
      !errors.ciudad &&
      !errors.experiencia &&
      !errors.disponibilidad &&
      !errors.mensaje &&
      !errors.aceptaPolitica
    );
  });

  protected updateField<K extends keyof ContactFormModel>(
    field: K,
    value: ContactFormModel[K],
  ): void {
    this.form.update((current) => ({ ...current, [field]: value }));
  }

  protected onInput(
    field: 'nombre' | 'edad' | 'email' | 'telefono' | 'ciudad' | 'disponibilidad' | 'mensaje',
    value: string | number | null,
  ): void {
    this.updateField(field, String(value ?? ''));
    this.markTouched(field);
  }

  protected onExperienciaChange(option: ExperienciaOption | null): void {
    this.updateField('experiencia', option?.value ?? null);
    this.markTouched('experiencia');
  }

  protected markTouched(field: keyof ContactFormModel): void {
    this.touched.update((current) => ({ ...current, [field]: true }));
  }

  protected showError(field: keyof ContactFormModel): boolean {
    return (this.touched()[field] || this.submitted()) && !!this.errors()[field];
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (!this.isValid()) {
      this.notifications.error(
        'Formulario incompleto',
        'Revisa los campos marcados antes de enviar tu solicitud.',
      );
      return;
    }

    this.isSending.set(true);

    const payload = this.form();

    this.contactService.send({
      nombre: payload.nombre.trim(),
      email: payload.email.trim(),
      asunto: 'Ingreso a UPAC Allstars',
      mensaje: `Edad: ${payload.edad}\nTeléfono: ${payload.telefono}\nCiudad: ${payload.ciudad}\nExperiencia: ${payload.experiencia}\nDisponibilidad: ${payload.disponibilidad}\nMotivación: ${payload.mensaje}`,
    });

    window.setTimeout(() => {
      this.notifications.success(
        '¡Formulario enviado!',
        'Gracias por interesarte en UPAC Allstars. Te contactaremos pronto.',
      );
      this.isSending.set(false);
      this.form.set({
        nombre: '',
        edad: '',
        email: '',
        telefono: '',
        ciudad: '',
        experiencia: null,
        disponibilidad: '',
        mensaje: '',
        aceptaPolitica: false,
      });
      this.touched.set({
        nombre: false,
        edad: false,
        email: false,
        telefono: false,
        ciudad: false,
        experiencia: false,
        disponibilidad: false,
        mensaje: false,
        aceptaPolitica: false,
      });
      this.submitted.set(false);
    }, 600);
  }
}
