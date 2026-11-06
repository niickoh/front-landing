import { Component, inject } from '@angular/core';
import { TuiChip } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-services-section',
  imports: [TuiChip, TuiCardLarge],
  templateUrl: './services-section.html',
})
export class ServicesSection {
  private readonly content = inject(ContentService);
  protected readonly services = this.content.value.services;
}
