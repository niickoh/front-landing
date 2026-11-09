import { Injectable, computed, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ConfigService } from '../core/config/app-config';

interface AdminSession {
  token: string;
  usuario: string;
  /** ISO 8601, viene del backend. */
  expira: string;
}

const STORAGE_KEY = 'upac_admin_session';

/** Sesión del panel de administración (JWT de upac-inscripciones-go). */
@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly config = inject(ConfigService);
  private readonly router = inject(Router);
  private readonly session = signal<AdminSession | null>(this.restore());

  readonly usuario = computed(() => this.session()?.usuario ?? '');

  /** URL completa de un endpoint de la API (viene de config/config.json). */
  apiUrl(path: string): string {
    return this.config.apiUrl(path);
  }

  /** Se evalúa en cada llamada para que una sesión vencida cuente como cerrada. */
  isLoggedIn(): boolean {
    const s = this.session();
    return !!s && Date.parse(s.expira) > Date.now();
  }

  token(): string | null {
    return this.isLoggedIn() ? this.session()!.token : null;
  }

  async login(usuario: string, password: string): Promise<string | null> {
    let response: Response;
    try {
      response = await fetch(this.apiUrl('/admin/login/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });
    } catch {
      return 'No pudimos conectar con el servidor.';
    }

    const body = (await response.json().catch(() => ({}))) as Partial<AdminSession> & {
      detail?: string;
    };
    if (!response.ok || !body.token || !body.expira) {
      return body.detail ?? 'No se pudo iniciar sesión.';
    }

    const session: AdminSession = {
      token: body.token,
      usuario: body.usuario ?? usuario,
      expira: body.expira,
    };
    this.session.set(session);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Sin almacenamiento (modo privado): la sesión dura mientras la pestaña esté abierta.
    }
    return null;
  }

  logout(redirect = true): void {
    this.session.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // nada que limpiar
    }
    if (redirect) {
      void this.router.navigateByUrl('/admin');
    }
  }

  private restore(): AdminSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const s = raw ? (JSON.parse(raw) as AdminSession) : null;
      return s && s.token && Date.parse(s.expira) > Date.now() ? s : null;
    } catch {
      return null;
    }
  }
}

/** Protege /admin/inscripciones: sin sesión vuelve al login. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AdminAuthService);
  return auth.isLoggedIn() || inject(Router).createUrlTree(['/admin']);
};

/** En /admin, si ya hay sesión, salta directo a la tabla. */
export const adminLoginGuard: CanActivateFn = () => {
  const auth = inject(AdminAuthService);
  return !auth.isLoggedIn() || inject(Router).createUrlTree(['/admin/inscripciones']);
};
