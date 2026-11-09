import { Injectable } from '@angular/core';

/**
 * Configuración en tiempo de ejecución, leída de /config/config.json al iniciar la app
 * (mismo esquema que BloodAndSand). Ese archivo se copia tal cual al build: se edita en el
 * servidor y basta con recargar la página, sin recompilar. Las claves que falten usan los
 * valores por defecto de abajo.
 */
export interface AppConfig {
  version: string;
  /** URL base de upac-inscripciones-go (p. ej. https://service.upacallstarschile.com). */
  api: { url: string };
}

export const DEFAULT_CONFIG: AppConfig = {
  version: 'default',
  api: { url: 'https://service.upacallstarschile.com' },
};

const URL = 'config/config.json';
const CACHE_KEY = 'upac:config';

type Plain = Record<string, unknown>;
const isObj = (v: unknown): v is Plain => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Mezcla profunda de los valores por defecto con el archivo; ignora valores de tipo incorrecto. */
function merge<T>(base: T, over: unknown): T {
  if (!isObj(base) || !isObj(over)) return base;
  const out: Plain = { ...base };
  for (const [k, def] of Object.entries(base)) {
    const v = over[k];
    if (v === undefined) continue;
    if (isObj(def)) out[k] = merge(def, v);
    else if (typeof v === typeof def) out[k] = v;
  }
  return out as T;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private cfg: AppConfig = DEFAULT_CONFIG;
  private apiBase = DEFAULT_CONFIG.api.url;

  /** Configuración activa. Se carga antes de la primera pantalla, así que no cambia después. */
  get value(): AppConfig {
    return this.cfg;
  }

  /** Siempre se pide fresca (sin caché). Si falla, usa la última copia que cargó o los valores por defecto. */
  async load(): Promise<void> {
    let raw: unknown;
    try {
      const res = await fetch(`${URL}?v=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      raw = await res.json();
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(raw));
      } catch {
        /* almacenamiento bloqueado */
      }
    } catch (e) {
      console.warn('[config] no se pudo leer config.json, se usa la última copia o los valores por defecto', e);
      try {
        raw = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
      } catch {
        raw = null;
      }
    }
    this.cfg = merge(DEFAULT_CONFIG, raw);
    // Acepta "https://x.com" y "https://x.com/"
    this.apiBase = (this.cfg.api.url.trim() || DEFAULT_CONFIG.api.url).replace(/\/+$/, '');
  }

  /** URL completa de un endpoint: apiUrl('/inscripciones/') → https://service.../inscripciones/ */
  apiUrl(path: string): string {
    return this.apiBase + (path.startsWith('/') ? path : `/${path}`);
  }
}
