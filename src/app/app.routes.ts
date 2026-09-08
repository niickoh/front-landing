import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
    title: 'Inicio | Front Landing',
  },
  {
    path: 'quienes-somos',
    loadComponent: () =>
      import('./components/quienes-somos/quienes-somos').then((m) => m.QuienesSomos),
    title: 'Quiénes Somos | Front Landing',
  },
  {
    path: 'contacto',
    loadComponent: () => import('./components/contacto/contacto').then((m) => m.Contacto),
    title: 'Contacto | Front Landing',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
