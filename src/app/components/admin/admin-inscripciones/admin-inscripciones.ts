import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TuiButton,
  TuiDataList,
  TuiDialog,
  TuiDropdown,
  TuiError,
  TuiIcon,
  TuiInput,
  TuiLoader,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiButtonLoading, TuiPagination } from '@taiga-ui/kit';
import { AdminAuthService } from '../../../services/admin-auth.service';
import {
  AdminApiError,
  AdminInscripcionesService,
  FILTROS_VACIOS,
  FiltrosInscritos,
  Inscrito,
} from '../../../services/admin-inscripciones.service';
import { ContentService } from '../../../services/content.service';
import {
  CondicionEdad,
  Experiencia,
  PreinscripcionPayload,
  Rol,
} from '../../../services/inscripcion.service';
import { NotificationService } from '../../../services/notification.service';

interface Opcion<T> {
  label: string;
  value: T;
}

type FiltroOpcion = 'condicion_edad' | 'experiencia' | 'rol';

interface GrupoFiltro {
  key: FiltroOpcion;
  titulo: string;
  ayuda: string;
  opciones: Opcion<string>[];
}

type VistaAcciones = 'tarjeta' | 'tabla';

type PresetFecha = '' | 'hoy' | '7d' | '30d' | 'mes' | 'custom';

/** Filtro activo que se muestra como chip removible bajo el buscador. */
interface FiltroActivo {
  id: string;
  label: string;
  quitar: (keyof FiltrosInscritos)[];
}

interface EdicionForm {
  nombre_completo: string;
  fecha_nacimiento: string;
  experiencia: Experiencia;
  ultimo_equipo: string;
  rol: Rol;
  nivel_gimnasia: string;
  telefono: string;
  email: string;
  apoderado_nombre: string;
  apoderado_telefono: string;
  apoderado_email: string;
}

// Mismas reglas que el formulario público y el backend
const NOMBRE = /^\p{L}[\p{L}'’-]* \p{L}[\p{L}'’-]*( \p{L}[\p{L}'’-]*)*$/u;
const CELULAR_CL = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MSG_CELULAR = 'Ingresa un celular chileno válido. Ejemplo: +56912345678.';
const MSG_EMAIL = 'Ingresa un correo electrónico válido.';

/** Fecha AAAA-MM-DD en hora de Chile. */
function fechaChile(d: Date): string {
  return d.toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
}

@Component({
  selector: 'app-admin-inscripciones',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    TuiButton,
    TuiButtonLoading,
    TuiDataList,
    TuiDialog,
    TuiDropdown,
    TuiError,
    TuiIcon,
    TuiInput,
    TuiLoader,
    TuiPagination,
    TuiTextfield,
  ],
  templateUrl: './admin-inscripciones.html',
})
export class AdminInscripciones {
  private readonly api = inject(AdminInscripcionesService);
  private readonly auth = inject(AdminAuthService);
  private readonly notifications = inject(NotificationService);

  protected readonly usuario = this.auth.usuario;
  protected readonly temporada = inject(ContentService).value.inscripcion.temporada;

  protected readonly experienciaOpciones: Opcion<Experiencia>[] = [
    { label: 'Sin experiencia', value: 'sin_experiencia' },
    { label: 'Con experiencia', value: 'con_experiencia' },
  ];
  protected readonly rolOpciones: Opcion<Rol>[] = [
    { label: 'Base', value: 'base' },
    { label: 'Flyer', value: 'flyer' },
    { label: 'Ambos', value: 'ambos' },
  ];

  /** Filtros de opción única: "Todos" + cada valor, como botones grandes fáciles de tocar. */
  protected readonly grupos: GrupoFiltro[] = [
    {
      key: 'condicion_edad',
      titulo: 'Edad',
      ayuda: `Según la edad al 31 de diciembre de ${this.temporada}.`,
      opciones: [
        { label: 'Todas', value: '' },
        { label: 'Menores de 18', value: 'menor_18' },
        { label: '18 o más', value: 'mayor_18' },
      ],
    },
    {
      key: 'experiencia',
      titulo: 'Experiencia en cheerleading',
      ayuda: '',
      opciones: [{ label: 'Todas', value: '' }, ...this.experienciaOpciones],
    },
    {
      key: 'rol',
      titulo: 'Rol o posición',
      ayuda: '',
      opciones: [{ label: 'Todos', value: '' }, ...this.rolOpciones],
    },
  ];

  protected readonly presetsFecha: Opcion<PresetFecha>[] = [
    { label: 'Cualquier fecha', value: '' },
    { label: 'Hoy', value: 'hoy' },
    { label: 'Últimos 7 días', value: '7d' },
    { label: 'Últimos 30 días', value: '30d' },
    { label: 'Este mes', value: 'mes' },
    { label: 'Elegir fechas', value: 'custom' },
  ];

  protected readonly filtros = signal<FiltrosInscritos>({ ...FILTROS_VACIOS });
  protected readonly presetFecha = signal<PresetFecha>('');

  /** En escritorio el panel parte abierto; en móvil parte cerrado para priorizar el listado. */
  protected readonly panelAbierto = signal(
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );

  // Paginación del lado del servidor: solo se pide la página visible.
  protected readonly opcionesPorPagina = [10, 25, 50, 100];
  protected readonly pagina = signal(1);
  protected readonly porPagina = signal(25);
  protected readonly total = signal(0);
  protected readonly totalPaginas = signal(1);
  /** "Mostrando 26–50 de 120". */
  protected readonly rango = computed(() => {
    const total = this.total();
    if (!total) {
      return '';
    }
    const desde = (this.pagina() - 1) * this.porPagina() + 1;
    const hasta = Math.min(this.pagina() * this.porPagina(), total);
    return `Mostrando ${desde}–${hasta} de ${total}`;
  });

  protected readonly inscritos = signal<Inscrito[]>([]);
  protected readonly resumen = signal<Record<string, number>>({});
  protected readonly cargando = signal(true);
  protected readonly descargando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly hayFiltros = computed(() =>
    Object.values(this.filtros()).some((v) => String(v).trim() !== ''),
  );

  /** Chips con cada filtro aplicado, para ver de un vistazo qué se está buscando y quitarlo. */
  protected readonly filtrosActivos = computed<FiltroActivo[]>(() => {
    const f = this.filtros();
    const activos: FiltroActivo[] = [];
    if (f.q.trim()) {
      activos.push({ id: 'q', label: `“${f.q.trim()}”`, quitar: ['q'] });
    }
    for (const g of this.grupos) {
      const opcion = g.opciones.find((o) => o.value && o.value === f[g.key]);
      if (opcion) {
        activos.push({ id: g.key, label: opcion.label, quitar: [g.key] });
      }
    }
    if (f.edad_min || f.edad_max) {
      const label =
        f.edad_min && f.edad_max
          ? `${f.edad_min} a ${f.edad_max} años`
          : f.edad_min
            ? `${f.edad_min} años o más`
            : `Hasta ${f.edad_max} años`;
      activos.push({ id: 'edad', label, quitar: ['edad_min', 'edad_max'] });
    }
    if (f.desde || f.hasta) {
      const preset = this.presetsFecha.find(
        (p) => p.value === this.presetFecha() && p.value !== 'custom',
      );
      const label = preset
        ? `Inscritos: ${preset.label.toLowerCase()}`
        : f.desde && f.hasta
          ? `Inscritos del ${this.formatoFecha(f.desde)} al ${this.formatoFecha(f.hasta)}`
          : f.desde
            ? `Inscritos desde el ${this.formatoFecha(f.desde)}`
            : `Inscritos hasta el ${this.formatoFecha(f.hasta)}`;
      activos.push({ id: 'fecha', label, quitar: ['desde', 'hasta'] });
    }
    return activos;
  });

  /** Cantidad de filtros del panel (sin contar la búsqueda), para el contador del botón. */
  protected readonly cantidadFiltrosPanel = computed(
    () => this.filtrosActivos().filter((f) => f.id !== 'q').length,
  );

  protected readonly tarjetas = computed(() => {
    const r = this.resumen();
    return [
      { label: 'Inscritos', value: r['total'] ?? 0, accent: true },
      { label: 'Menores de 18', value: r['menor_18'] ?? 0 },
      { label: '18 o más', value: r['mayor_18'] ?? 0 },
      { label: 'Con experiencia', value: r['con_experiencia'] ?? 0 },
      { label: 'Sin experiencia', value: r['sin_experiencia'] ?? 0 },
    ];
  });

  // ---------- Acciones por inscrito ----------

  /**
   * Menú de acciones abierto (solo uno a la vez). Cada inscrito tiene un botón en la
   * tarjeta (móvil) y otro en la tabla (escritorio), así que se guarda también la vista:
   * si no, se abrirían los dos menús y el del botón oculto aparecería en la esquina.
   */
  protected readonly menuAbierto = signal<{ id: number; vista: VistaAcciones } | null>(null);
  protected readonly menuInscrito = computed(
    () => this.inscritos().find((i) => i.id === this.menuAbierto()?.id) ?? null,
  );

  // Editar
  protected readonly dialogEditar = signal(false);
  protected readonly editando = signal<Inscrito | null>(null);
  protected readonly edicion = signal<EdicionForm | null>(null);
  protected readonly edicionEnviada = signal(false);
  protected readonly erroresServidor = signal<Record<string, string>>({});
  protected readonly guardando = signal(false);

  /** Edad al 31 de diciembre de la temporada del inscrito, calculada desde la fecha de nacimiento. */
  protected readonly edadEdicion = computed<number | null>(() => {
    const temporada = this.editando()?.temporada ?? this.temporada;
    const match = /^(\d{4})-\d{2}-\d{2}$/.exec(this.edicion()?.fecha_nacimiento ?? '');
    if (!match) {
      return null;
    }
    const edad = temporada - Number(match[1]);
    return edad >= 1 && edad <= 100 ? edad : null;
  });
  protected readonly condicionEdicion = computed<CondicionEdad | null>(() => {
    const edad = this.edadEdicion();
    return edad === null ? null : edad >= 18 ? 'mayor_18' : 'menor_18';
  });

  protected readonly erroresEdicion = computed<Record<string, string>>(() => {
    const f = this.edicion();
    if (!f) {
      return {};
    }
    const t = (v: string) => v.trim();
    const e: Record<string, string> = {};
    const nombre = t(f.nombre_completo).replace(/\s+/g, ' ');
    if (!nombre) {
      e['nombre_completo'] = 'Ingresa el nombre completo.';
    } else if (!NOMBRE.test(nombre)) {
      e['nombre_completo'] = 'Ingresa al menos primer nombre y apellido paterno, solo con letras.';
    }
    if (!f.fecha_nacimiento || this.edadEdicion() === null || f.fecha_nacimiento > this.hoy) {
      e['fecha_nacimiento'] = 'Ingresa una fecha de nacimiento válida.';
    }
    if (!t(f.ultimo_equipo)) e['ultimo_equipo'] = 'Indica el último equipo, año y nivel.';
    if (!t(f.nivel_gimnasia)) e['nivel_gimnasia'] = 'Indica el nivel de gimnasia.';

    if (this.condicionEdicion() === 'mayor_18') {
      if (!CELULAR_CL.test(t(f.telefono))) e['telefono'] = MSG_CELULAR;
      if (!EMAIL.test(t(f.email))) e['email'] = MSG_EMAIL;
    } else if (this.condicionEdicion() === 'menor_18') {
      if (!t(f.apoderado_nombre)) e['apoderado_nombre'] = 'Ingresa el nombre del apoderado.';
      if (!CELULAR_CL.test(t(f.apoderado_telefono))) e['apoderado_telefono'] = MSG_CELULAR;
      if (!EMAIL.test(t(f.apoderado_email))) e['apoderado_email'] = MSG_EMAIL;
    }
    return e;
  });

  // Eliminar
  protected readonly dialogEliminar = signal(false);
  protected readonly eliminando = signal<Inscrito | null>(null);
  protected readonly borrando = signal(false);

  protected readonly hoy = fechaChile(new Date());

  private readonly fechaHora = new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Santiago',
  });

  private pedido = 0;
  private espera: ReturnType<typeof setTimeout> | undefined;
  /** Parámetros (filtros + página) de la última carga pedida, para no repetirla. */
  private clave = '';
  private qPrevio = '';

  constructor() {
    // Recarga al cambiar filtros o página; la búsqueda por texto espera a que se deje de escribir.
    effect(() => {
      const f = this.filtros();
      const clave = this.claveDe(f, this.pagina(), this.porPagina());
      if (clave === this.clave) {
        return;
      }
      const soloTexto = f.q !== this.qPrevio;
      this.qPrevio = f.q;
      this.clave = clave;
      clearTimeout(this.espera);
      this.espera = setTimeout(() => void this.cargar(), soloTexto ? 350 : 0);
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.espera));
  }

  // ---------- Filtros ----------

  /** Cambiar un filtro siempre vuelve a la página 1. */
  protected setFiltro<K extends keyof FiltrosInscritos>(key: K, value: FiltrosInscritos[K]): void {
    this.filtros.update((f) => ({ ...f, [key]: value ?? '' }));
    this.pagina.set(1);
  }

  protected setOpcion(key: FiltroOpcion, value: string): void {
    this.filtros.update((f) => ({ ...f, [key]: value }));
    this.pagina.set(1);
  }

  protected setEdad(key: 'edad_min' | 'edad_max', value: number | string | null): void {
    this.setFiltro(key, value === null ? '' : String(value));
  }

  /** Atajos de fecha de inscripción; "Elegir fechas" muestra los dos calendarios. */
  protected setPresetFecha(preset: PresetFecha): void {
    this.presetFecha.set(preset);
    const hoy = new Date();
    const hace = (dias: number) => fechaChile(new Date(hoy.getTime() - dias * 86_400_000));
    let desde = '';
    let hasta = '';
    switch (preset) {
      case 'hoy':
        desde = hasta = fechaChile(hoy);
        break;
      case '7d':
        desde = hace(6);
        hasta = fechaChile(hoy);
        break;
      case '30d':
        desde = hace(29);
        hasta = fechaChile(hoy);
        break;
      case 'mes':
        desde = `${fechaChile(hoy).slice(0, 7)}-01`;
        hasta = fechaChile(hoy);
        break;
      case 'custom':
        // Mantiene lo que ya hubiera para ajustarlo a mano
        return;
    }
    this.filtros.update((f) => ({ ...f, desde, hasta }));
    this.pagina.set(1);
  }

  protected setFechaManual(key: 'desde' | 'hasta', value: string | null): void {
    this.presetFecha.set('custom');
    this.setFiltro(key, value ?? '');
  }

  protected quitarFiltro(filtro: FiltroActivo): void {
    this.filtros.update((f) => {
      const copia = { ...f };
      for (const k of filtro.quitar) {
        (copia as Record<string, string>)[k] = '';
      }
      return copia;
    });
    if (filtro.id === 'fecha') {
      this.presetFecha.set('');
    }
    this.pagina.set(1);
  }

  protected limpiarFiltros(): void {
    this.filtros.set({ ...FILTROS_VACIOS });
    this.presetFecha.set('');
    this.pagina.set(1);
  }

  protected togglePanel(): void {
    this.panelAbierto.update((v) => !v);
  }

  /** Móvil: cierra el panel y lleva al listado. */
  protected verResultados(): void {
    this.panelAbierto.set(false);
    document.getElementById('admin-resultados')?.scrollIntoView({ behavior: 'smooth' });
  }

  // ---------- Paginación ----------

  /** tui-pagination trabaja con índice desde 0. */
  protected irAPagina(index: number): void {
    this.pagina.set(index + 1);
  }

  protected setPorPagina(valor: number): void {
    this.porPagina.set(valor);
    this.pagina.set(1);
  }

  private claveDe(f: FiltrosInscritos, pagina: number, porPagina: number): string {
    return JSON.stringify([f, pagina, porPagina]);
  }

  // ---------- Acciones ----------

  protected menuEstaAbierto(inscrito: Inscrito, vista: VistaAcciones): boolean {
    const m = this.menuAbierto();
    return m?.id === inscrito.id && m.vista === vista;
  }

  protected toggleMenu(inscrito: Inscrito, vista: VistaAcciones, abierto: boolean): void {
    if (abierto) {
      this.menuAbierto.set({ id: inscrito.id, vista });
    } else if (this.menuEstaAbierto(inscrito, vista)) {
      this.menuAbierto.set(null);
    }
  }

  protected abrirEditar(inscrito: Inscrito): void {
    this.menuAbierto.set(null);
    this.editando.set(inscrito);
    this.edicion.set({
      nombre_completo: inscrito.nombre_completo,
      fecha_nacimiento: inscrito.fecha_nacimiento,
      experiencia: inscrito.experiencia,
      ultimo_equipo: inscrito.ultimo_equipo,
      rol: inscrito.rol,
      nivel_gimnasia: inscrito.nivel_gimnasia,
      telefono: inscrito.telefono ?? '',
      email: inscrito.email ?? '',
      apoderado_nombre: inscrito.apoderado_nombre ?? '',
      apoderado_telefono: inscrito.apoderado_telefono ?? '',
      apoderado_email: inscrito.apoderado_email ?? '',
    });
    this.edicionEnviada.set(false);
    this.erroresServidor.set({});
    this.dialogEditar.set(true);
  }

  protected setEdicion<K extends keyof EdicionForm>(key: K, value: EdicionForm[K]): void {
    this.edicion.update((f) => (f ? { ...f, [key]: value ?? '' } : f));
    // El error del servidor de ese campo deja de aplicar al corregirlo
    if (this.erroresServidor()[key]) {
      this.erroresServidor.update(({ [key]: _, ...resto }) => resto);
    }
  }

  protected errorEdicion(field: string): string | null {
    if (this.erroresServidor()[field]) {
      return this.erroresServidor()[field];
    }
    return this.edicionEnviada() ? (this.erroresEdicion()[field] ?? null) : null;
  }

  protected async guardarEdicion(): Promise<void> {
    const inscrito = this.editando();
    const f = this.edicion();
    const edad = this.edadEdicion();
    const condicion = this.condicionEdicion();
    this.edicionEnviada.set(true);
    if (!inscrito || !f || Object.keys(this.erroresEdicion()).length || !edad || !condicion) {
      this.notifications.warn('Revisa el formulario', 'Hay campos con errores.');
      return;
    }

    const t = (v: string) => v.trim();
    const payload: PreinscripcionPayload = {
      nombre_completo: t(f.nombre_completo),
      fecha_nacimiento: f.fecha_nacimiento,
      edad_temporada: edad,
      experiencia: f.experiencia,
      ultimo_equipo: t(f.ultimo_equipo),
      rol: f.rol,
      nivel_gimnasia: t(f.nivel_gimnasia),
      condicion_edad: condicion,
      ...(condicion === 'mayor_18'
        ? { telefono: t(f.telefono), email: t(f.email) }
        : {
            apoderado_nombre: t(f.apoderado_nombre),
            apoderado_telefono: t(f.apoderado_telefono),
            apoderado_email: t(f.apoderado_email),
          }),
    };

    this.guardando.set(true);
    try {
      await this.api.actualizar(inscrito.id, payload);
      this.notifications.success('Cambios guardados', `Se actualizó a ${payload.nombre_completo}.`);
      this.dialogEditar.set(false);
      void this.cargar(); // refresca listado y resumen
    } catch (e) {
      if (e instanceof AdminApiError && Object.keys(e.campos).length) {
        this.erroresServidor.set(e.campos);
      }
      this.mostrarError(e);
    } finally {
      this.guardando.set(false);
    }
  }

  protected abrirEliminar(inscrito: Inscrito): void {
    this.menuAbierto.set(null);
    this.eliminando.set(inscrito);
    this.dialogEliminar.set(true);
  }

  protected async confirmarEliminar(): Promise<void> {
    const inscrito = this.eliminando();
    if (!inscrito) {
      return;
    }
    this.borrando.set(true);
    try {
      const mensaje = await this.api.eliminar(inscrito.id);
      this.notifications.success('Pre-inscripción eliminada', mensaje);
      this.dialogEliminar.set(false);
      void this.cargar();
    } catch (e) {
      this.mostrarError(e);
    } finally {
      this.borrando.set(false);
    }
  }

  // ---------- Otros ----------

  protected async descargar(): Promise<void> {
    this.descargando.set(true);
    try {
      await this.api.descargarExcel(this.filtros());
    } catch (e) {
      this.mostrarError(e);
    } finally {
      this.descargando.set(false);
    }
  }

  protected cerrarSesion(): void {
    this.auth.logout();
  }

  protected formatoFechaHora(iso: string): string {
    return this.fechaHora.format(new Date(iso));
  }

  /** "2015-04-12" → "12-04-2015", sin pasar por Date para no correr el día por zona horaria. */
  protected formatoFecha(fecha: string): string {
    const [y, m, d] = fecha.split('-');
    return d && m && y ? `${d}-${m}-${y}` : fecha;
  }

  protected async cargar(): Promise<void> {
    const id = ++this.pedido;
    this.cargando.set(true);
    this.error.set(null);
    try {
      const filtros = this.filtros();
      const data = await this.api.listar(filtros, this.pagina(), this.porPagina());
      if (id !== this.pedido) {
        return; // llegó una respuesta más nueva
      }
      this.inscritos.set(data.resultados);
      this.resumen.set(data.resumen);
      this.total.set(data.total);
      this.totalPaginas.set(data.total_paginas);
      if (data.pagina !== this.pagina()) {
        // La página pedida ya no existía: el servidor entregó la última. Se ajusta sin volver a pedirla.
        this.clave = this.claveDe(filtros, data.pagina, this.porPagina());
        this.pagina.set(data.pagina);
      }
    } catch (e) {
      if (id === this.pedido) {
        this.error.set(e instanceof Error ? e.message : 'No se pudo cargar el listado.');
        this.mostrarError(e);
      }
    } finally {
      if (id === this.pedido) {
        this.cargando.set(false);
      }
    }
  }

  private mostrarError(e: unknown): void {
    const sesion = e instanceof AdminApiError && e.sesion;
    this.notifications.error(
      sesion ? 'Sesión finalizada' : 'Error',
      e instanceof Error ? e.message : 'Ocurrió un error inesperado.',
    );
  }
}
