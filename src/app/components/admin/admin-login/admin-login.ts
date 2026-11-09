import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton, TuiError, TuiInput, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, TuiButton, TuiButtonLoading, TuiCardLarge, TuiError, TuiInput, TuiTextfield],
  templateUrl: './admin-login.html',
})
export class AdminLogin {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly usuario = signal('');
  protected readonly password = signal('');
  protected readonly showPassword = signal(false);
  protected readonly isSending = signal(false);
  protected readonly error = signal<string | null>(null);

  protected async onSubmit(): Promise<void> {
    if (!this.usuario().trim() || !this.password()) {
      this.error.set('Ingresa tu usuario y contraseña.');
      return;
    }
    this.isSending.set(true);
    this.error.set(await this.auth.login(this.usuario().trim(), this.password()));
    this.isSending.set(false);

    if (!this.error()) {
      void this.router.navigateByUrl('/admin/inscripciones');
    }
  }
}
