import { Injectable, inject } from '@angular/core';
import { ConfigService } from '../core/config/app-config';

export type Experiencia = 'sin_experiencia' | 'con_experiencia';
export type Rol = 'base' | 'flyer' | 'ambos';
export type CondicionEdad = 'menor_18' | 'mayor_18';

/** Contrato de POST /inscripciones/ en upac-inscripciones-go (mismos campos que el form de Google). */
export interface PreinscripcionPayload {
  nombre_completo: string;
  fecha_nacimiento: string;
  edad_temporada: number;
  experiencia: Experiencia;
  ultimo_equipo: string;
  rol: Rol;
  nivel_gimnasia: string;
  condicion_edad: CondicionEdad;
  telefono?: string;
  email?: string;
  apoderado_nombre?: string;
  apoderado_telefono?: string;
  apoderado_email?: string;
}

export type PreinscripcionResult =
  | { ok: true; message: string }
  | { ok: false; status: number; message: string; fieldErrors: Record<string, string> };

@Injectable({ providedIn: 'root' })
export class InscripcionService {
  private readonly config = inject(ConfigService);

  async enviar(payload: PreinscripcionPayload): Promise<PreinscripcionResult> {
    let response: Response;
    try {
      response = await fetch(this.config.apiUrl('/inscripciones/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      return {
        ok: false,
        status: 0,
        message: 'No pudimos conectar con el servidor. Revisa tu conexión e intenta nuevamente.',
        fieldErrors: {},
      };
    }

    const body = (await response.json().catch(() => ({}))) as {
      detail?: string;
      errores?: Record<string, string>;
    };

    if (response.ok) {
      return { ok: true, message: body.detail ?? '¡Pre-inscripción recibida!' };
    }

    return {
      ok: false,
      status: response.status,
      message: body.detail ?? 'No pudimos enviar tu pre-inscripción. Intenta nuevamente.',
      fieldErrors: body.errores ?? {},
    };
  }
}
