import { Component } from '@angular/core';

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-services-section',
  templateUrl: './services-section.html',
})
export class ServicesSection {
  protected readonly services: ServiceItem[] = [
    {
      icon: '🚀',
      title: 'Landing Pages',
      description:
        'Páginas de aterrizaje optimizadas para conversión, con tiempos de carga mínimos y SEO técnico impecable.',
      tags: ['SEO', 'Conversión', 'Performance'],
    },
    {
      icon: '🧩',
      title: 'Componentes a medida',
      description:
        'Bibliotecas de componentes reutilizables con PrimeNG y Tailwind, alineadas a tu sistema de diseño.',
      tags: ['PrimeNG', 'Tailwind', 'Design System'],
    },
    {
      icon: '📊',
      title: 'Consultoría Frontend',
      description:
        'Acompañamiento experto en arquitectura Angular, signals, lazy loading y mejores prácticas modernas.',
      tags: ['Angular', 'Signals', 'Arquitectura'],
    },
  ];
}
