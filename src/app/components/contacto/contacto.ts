import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { Message } from 'primeng/message';
import { ContactService } from '../../services/contact.service';
import { NotificationService } from '../../services/notification.service';

interface ContactFormModel {
  nombre: string;
  email: string;
  asunto: string | null;
  mensaje: string;
}

interface ContactFormErrors {
  nombre: string | null;
  email: string | null;
  asunto: string | null;
  mensaje: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-contacto',
  imports: [FormsModule, Button, InputText, Textarea, Select, Message],
  templateUrl: './contacto.html',
})
export class Contacto {
  private readonly contactService = inject(ContactService);
  private readonly notifications = inject(NotificationService);

  protected readonly asuntoOptions = [
    { label: 'Nuevo proyecto', value: 'nuevo-proyecto' },
    { label: 'Consultoría', value: 'consultoria' },
    { label: 'Soporte', value: 'soporte' },
    { label: 'Otro', value: 'otro' },
  ];

  protected readonly form = signal<ContactFormModel>({
    nombre: '',
    email: '',
    asunto: null,
    mensaje: '',
  });

  protected readonly touched = signal<Record<keyof ContactFormModel, boolean>>({
    nombre: false,
    email: false,
    asunto: false,
    mensaje: false,
  });

  protected readonly submitted = signal(false);

  protected readonly errors = computed<ContactFormErrors>(() => {
    const { nombre, email, asunto, mensaje } = this.form();

    return {
      nombre: !nombre.trim()
        ? 'El nombre es obligatorio.'
        : nombre.trim().length < 3
          ? 'El nombre debe tener al menos 3 caracteres.'
          : null,
      email: !email.trim()
        ? 'El correo electrónico es obligatorio.'
        : !EMAIL_PATTERN.test(email.trim())
          ? 'Ingresa un correo electrónico válido.'
          : null,
      asunto: !asunto ? 'Selecciona un asunto.' : null,
      mensaje: !mensaje.trim()
        ? 'El mensaje es obligatorio.'
        : mensaje.trim().length < 10
          ? 'El mensaje debe tener al menos 10 caracteres.'
          : null,
    };
  });

  protected readonly isValid = computed(() => {
    const errors = this.errors();
    return !errors.nombre && !errors.email && !errors.asunto && !errors.mensaje;
  });

  protected updateField<K extends keyof ContactFormModel>(field: K, value: ContactFormModel[K]): void {
    this.form.update((current) => ({ ...current, [field]: value }));
  }

  protected onTextInput(field: 'nombre' | 'email' | 'mensaje', event: Event): void {
    this.updateField(field, (event.target as HTMLInputElement | HTMLTextAreaElement).value);
    this.markTouched(field);
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
        'Corrige los campos marcados antes de enviar.',
      );
      return;
    }

    const { nombre, email, asunto, mensaje } = this.form();
    this.contactService.send({
      nombre: nombre.trim(),
      email: email.trim(),
      asunto: asunto!,
      mensaje: mensaje.trim(),
    });

    this.notifications.success('¡Mensaje enviado!', 'Te responderemos en menos de 24 horas.');

    this.form.set({ nombre: '', email: '', asunto: null, mensaje: '' });
    this.touched.set({ nombre: false, email: false, asunto: false, mensaje: false });
    this.submitted.set(false);
  }
}
