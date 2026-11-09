import { Routes } from '@angular/router';
import { adminGuard, adminLoginGuard } from './services/admin-auth.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
    title: 'Inicio | UPAC Allstars',
  },
  {
    path: 'tryouts',
    loadComponent: () => import('./components/tryouts/tryouts').then((m) => m.Tryouts),
    title: 'Tryouts 2027 | UPAC Allstars',
  },
  {
    path: 'inscripcion',
    loadComponent: () => import('./components/inscripcion/inscripcion').then((m) => m.Inscripcion),
    title: 'Inscríbete | UPAC Allstars',
  },
  {
    path: 'quienes-somos',
    loadComponent: () =>
      import('./components/quienes-somos/quienes-somos').then((m) => m.QuienesSomos),
    title: 'Quiénes Somos | UPAC Allstars',
  },
  {
    path: 'videos',
    loadComponent: () => import('./components/videos/videos').then((m) => m.Videos),
    title: 'Videos | UPAC Allstars',
  },
  // Panel de administración: no aparece en el menú público
  {
    path: 'admin',
    canActivate: [adminLoginGuard],
    loadComponent: () =>
      import('./components/admin/admin-login/admin-login').then((m) => m.AdminLogin),
    title: 'Admin | UPAC Allstars',
  },
  {
    path: 'admin/inscripciones',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/admin/admin-inscripciones/admin-inscripciones').then(
        (m) => m.AdminInscripciones,
      ),
    title: 'Inscritos | Admin UPAC Allstars',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
