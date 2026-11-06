import { Injectable, inject } from '@angular/core';
import { TuiNotificationService } from '@taiga-ui/core';

type Appearance = 'positive' | 'info' | 'warning' | 'negative';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly alerts = inject(TuiNotificationService);

  success(summary: string, detail?: string): void {
    this.show('positive', summary, detail, 4000);
  }

  info(summary: string, detail?: string): void {
    this.show('info', summary, detail, 4000);
  }

  warn(summary: string, detail?: string): void {
    this.show('warning', summary, detail, 4000);
  }

  error(summary: string, detail?: string): void {
    this.show('negative', summary, detail, 5000);
  }

  private show(appearance: Appearance, label: string, detail = '', autoClose: number): void {
    this.alerts.open(detail, { label, appearance, autoClose }).subscribe();
  }
}
