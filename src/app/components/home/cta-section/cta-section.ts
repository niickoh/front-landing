import { Component, inject, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { NotificationService } from '../../../services/notification.service';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-cta-section',
  imports: [Dialog, Button, InputText],
  templateUrl: './cta-section.html',
})
export class CtaSection {
  private readonly notifications = inject(NotificationService);
  private readonly content = inject(ContentService);
  protected readonly cta = this.content.value.cta;

  protected readonly dialogVisible = signal(false);
  protected readonly email = signal('');
  protected readonly emailError = signal<string | null>(null);

  protected openDialog(): void {
    this.email.set('');
    this.emailError.set(null);
    this.dialogVisible.set(true);
  }

  protected onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
    if (this.emailError()) {
      this.validateEmail();
    }
  }

  protected subscribe(): void {
    if (!this.validateEmail()) {
      this.notifications.warn('Revisa el formulario', this.cta.emailInvalid);
      return;
    }

    this.notifications.success(
      '¡Suscripción exitosa!',
      `Te contactaremos pronto a ${this.email()}.`,
    );
    this.dialogVisible.set(false);
  }

  private validateEmail(): boolean {
    const value = this.email().trim();

    if (!value) {
      this.emailError.set(this.cta.emailRequired);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.emailError.set(this.cta.emailInvalid);
      return false;
    }

    this.emailError.set(null);
    return true;
  }
}
