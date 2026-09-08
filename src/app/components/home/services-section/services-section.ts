import { Component } from '@angular/core';
import { appContent } from '../../../content.config';

@Component({
  selector: 'app-services-section',
  templateUrl: './services-section.html',
})
export class ServicesSection {
  protected readonly services = appContent.services;
}
