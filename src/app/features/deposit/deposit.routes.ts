import { Routes } from '@angular/router';

export const DEPOSIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./deposit-points.component').then(m => m.DepositPointsComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./deposit-new.component').then(m => m.DepositNewComponent)
  },
  {
    path: 'code/:code',
    loadComponent: () => import('./deposit-code.component').then(m => m.DepositCodeComponent)
  }
];
