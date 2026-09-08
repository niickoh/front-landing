import { Component, inject } from '@angular/core';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-services-section',
  templateUrl: './services-section.html',
})
export class ServicesSection {
  private readonly content = inject(ContentService);
  protected readonly services = this.content.value.services;
}
