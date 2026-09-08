import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
    title: 'Inicio | UPAc Allstars',
  },
  {
    path: 'quienes-somos',
    loadComponent: () =>
      import('./components/quienes-somos/quienes-somos').then((m) => m.QuienesSomos),
    title: 'Quiénes Somos | UPAc Allstars',
  },
  {
    path: 'videos',
    loadComponent: () => import('./components/videos/videos').then((m) => m.Videos),
    title: 'Videos | UPAc Allstars',
  },
  {
    path: 'contacto',
    loadComponent: () => import('./components/contacto/contacto').then((m) => m.Contacto),
    title: 'Contacto | UPAc Allstars',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
