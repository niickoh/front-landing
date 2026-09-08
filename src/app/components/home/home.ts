import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Features } from './features/features';
import { ServicesSection } from './services-section/services-section';
import { CtaSection } from './cta-section/cta-section';

@Component({
  selector: 'app-home',
  imports: [Hero, Features, ServicesSection, CtaSection],
  templateUrl: './home.html',
})
export class Home {}
