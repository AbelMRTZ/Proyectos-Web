import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'gestion-usuarios',
    loadComponent: () => import('./pages/gestion-usuarios/gestion-usuarios.page').then( m => m.GestionUsuariosPage)
  },
  {
    path: 'gestion-trabajos',
    loadComponent: () => import('./pages/gestion-trabajos/gestion-trabajos.page').then( m => m.GestionTrabajosPage)
  },
  {
    path: 'gestion-fichajes',
    loadComponent: () => import('./pages/gestion-fichajes/gestion-fichajes.page').then( m => m.GestionFichajesPage)
  },
  {
    path: 'fichaje-mapa',
    loadComponent: () => import('./pages/fichaje-mapa/fichaje-mapa.page').then( m => m.FichajeMapaPage)
  },
];
