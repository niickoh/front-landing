import { Component } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.html',
})
export class Features {
  protected readonly features: Feature[] = [
    {
      icon: '⚡',
      title: 'Rendimiento extremo',
      description:
        'Carga diferida, signals y detección de cambios optimizada para una experiencia instantánea en cualquier dispositivo.',
    },
    {
      icon: '📱',
      title: 'Diseño responsivo',
      description:
        'Layouts construidos con Tailwind CSS que se adaptan perfectamente a móviles, tablets y escritorio.',
    },
    {
      icon: '🎨',
      title: 'Identidad de marca',
      description:
        'Paleta rojo, negro y blanco con acentos azules y grises que transmite fuerza y profesionalismo.',
    },
  ];
}
