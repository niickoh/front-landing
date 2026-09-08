import { Injectable, signal } from '@angular/core';

export interface ContactMessage {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly _messages = signal<ContactMessage[]>([]);
  readonly messages = this._messages.asReadonly();

  send(message: ContactMessage): void {
    this._messages.update((current) => [...current, message]);
  }
}
