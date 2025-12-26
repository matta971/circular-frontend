import { Routes } from '@angular/router';

export const landingRoutes: Routes = [
  {
    path: 'citoyen',
    loadComponent: () => import('./citoyen/citoyen-landing.component').then(m => m.CitoyenLandingComponent),
    title: 'Citoyen - Circular Electronics'
  },
  {
    path: 'association',
    loadComponent: () => import('./association/association-landing.component').then(m => m.AssociationLandingComponent),
    title: 'Association - Circular Electronics'
  },
  {
    path: 'entreprise',
    loadComponent: () => import('./entreprise/entreprise-landing.component').then(m => m.EntrepriseLandingComponent),
    title: 'Entreprise - Circular Electronics'
  }
];
