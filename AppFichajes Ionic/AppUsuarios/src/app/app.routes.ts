import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'registrar-fichaje',
    loadComponent: () => import('./pages/registrar-fichaje/registrar-fichaje.page').then((m) => m.RegistrarFichajePage),
  },
  {
    path: 'consulta-fichajes',
    loadComponent: () => import('./pages/consultar-fichajes/consultar-fichajes.page').then((m) => m.ConsultaFichajesPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];