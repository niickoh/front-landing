import { Component } from '@angular/core';

interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.html',
})
export class QuienesSomos {
  protected readonly team: TeamMember[] = [
    {
      initials: 'NM',
      name: 'Nicolás M.',
      role: 'Fundador & Frontend Lead',
      bio: 'Apasionado por Angular y las interfaces que enamoran a los usuarios.',
    },
    {
      initials: 'VC',
      name: 'Valentina C.',
      role: 'Diseñadora UX/UI',
      bio: 'Convierte ideas complejas en experiencias simples, bellas y funcionales.',
    },
    {
      initials: 'DR',
      name: 'Diego R.',
      role: 'Ingeniero de Software',
      bio: 'Obsesionado con el rendimiento, la accesibilidad y el código limpio.',
    },
  ];

  protected readonly values: Value[] = [
    {
      icon: '🎯',
      title: 'Enfoque',
      description: 'Cada proyecto tiene objetivos claros y medibles desde el primer día.',
    },
    {
      icon: '🤝',
      title: 'Transparencia',
      description: 'Comunicación directa y honesta con nuestros clientes en cada etapa.',
    },
    {
      icon: '💡',
      title: 'Innovación',
      description: 'Adoptamos las herramientas modernas que realmente aportan valor.',
    },
  ];
}
