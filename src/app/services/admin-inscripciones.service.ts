import { Injectable, inject } from '@angular/core';
import { AdminAuthService } from './admin-auth.service';
import { CondicionEdad, Experiencia, PreinscripcionPayload, Rol } from './inscripcion.service';

export interface Inscrito {
  id: number;
  temporada: number;
  nombre_completo: string;
  fecha_nacimiento: string;
  edad_temporada: number;
  experiencia: Experiencia;
  experiencia_label: string;
  ultimo_equipo: string;
  rol: Rol;
  rol_label: string;
  nivel_gimnasia: string;
  condicion_edad: CondicionEdad;
  condicion_edad_label: string;
  telefono: string | null;
  email: string | null;
  apoderado_nombre: string | null;
  apoderado_telefono: string | null;
  apoderado_email: string | null;
  estado: string;
  created_at: string;
}

export interface FiltrosInscritos {
  q: string;
  experiencia: Experiencia | '';
  rol: Rol | '';
  condicion_edad: CondicionEdad | '';
  edad_min: string;
  edad_max: string;
  desde: string;
  hasta: string;
}

export const FILTROS_VACIOS: FiltrosInscritos = {
  q: '',
  experiencia: '',
  rol: '',
  condicion_edad: '',
  edad_min: '',
  edad_max: '',
  desde: '',
  hasta: '',
};

/** Una página del listado; el resumen y `total` cuentan todo lo filtrado, no solo la página. */
export interface ListadoInscritos {
  temporada: number;
  resumen: Record<string, number>;
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  resultados: Inscrito[];
}

/** Error que el componente muestra tal cual; `sesion` indica que hay que volver a iniciar sesión. */
export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly sesion = false,
    /** Errores por campo que devuelve el backend al editar (400/409). */
    readonly campos: Record<string, string> = {},
  ) {
    super(message);
  }
}

@Injectable({ providedIn: 'root' })
export class AdminInscripcionesService {
  private readonly auth = inject(AdminAuthService);

  /** Pide una página al servidor (paginación del lado del backend). */
  async listar(
    filtros: FiltrosInscritos,
    pagina: number,
    porPagina: number,
  ): Promise<ListadoInscritos> {
    const query = this.query(filtros, { pagina: String(pagina), por_pagina: String(porPagina) });
    const response = await this.request(`/admin/inscripciones/${query}`);
    return (await response.json()) as ListadoInscritos;
  }

  /** Edita una pre-inscripción; el backend aplica las mismas reglas que el formulario público. */
  async actualizar(id: number, payload: PreinscripcionPayload): Promise<Inscrito> {
    const response = await this.request(`/admin/inscripciones/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return ((await response.json()) as { inscrito: Inscrito }).inscrito;
  }

  /** Elimina definitivamente una pre-inscripción. */
  async eliminar(id: number): Promise<string> {
    const response = await this.request(`/admin/inscripciones/${id}/`, { method: 'DELETE' });
    return ((await response.json().catch(() => ({}))) as { detail?: string }).detail ?? 'Pre-inscripción eliminada.';
  }

  /** Descarga el .xlsx con los mismos filtros de la tabla. */
  async descargarExcel(filtros: FiltrosInscritos): Promise<void> {
    const response = await this.request(`/admin/inscripciones/excel/${this.query(filtros)}`);
    const blob = await response.blob();
    const disposition = response.headers.get('Content-Disposition') ?? '';
    const nombre = /filename="([^"]+)"/.exec(disposition)?.[1] ?? 'preinscripciones.xlsx';

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private query(filtros: FiltrosInscritos, extra: Record<string, string> = {}): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filtros, ...extra })) {
      const v = String(value).trim();
      if (v) {
        params.set(key, v);
      }
    }
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  }

  private async request(path: string, init: RequestInit = {}): Promise<Response> {
    const token = this.auth.token();
    if (!token) {
      this.auth.logout();
      throw new AdminApiError('Tu sesión expiró. Inicia sesión nuevamente.', true);
    }

    let response: Response;
    try {
      response = await fetch(this.auth.apiUrl(path), {
        ...init,
        headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${token}` },
      });
    } catch {
      throw new AdminApiError('No pudimos conectar con el servidor.');
    }

    if (response.ok) {
      return response;
    }
    const body = (await response.json().catch(() => ({}))) as {
      detail?: string;
      errores?: Record<string, string>;
    };
    if (response.status === 401) {
      this.auth.logout();
      throw new AdminApiError(body.detail ?? 'Tu sesión expiró.', true);
    }
    throw new AdminApiError(body.detail ?? 'No se pudo completar la solicitud.', false, body.errores ?? {});
  }
}
