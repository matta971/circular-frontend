import { Routes } from '@angular/router';

export const REPAIR_PARTNERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/partner-list/partner-list.component').then(m => m.PartnerListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/partner-form/partner-form.component').then(m => m.PartnerFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/partner-form/partner-form.component').then(m => m.PartnerFormComponent)
  }
];
