import { Routes } from '@angular/router';

export const REPAIRABILITY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./repairability.component').then(m => m.RepairabilityComponent)
  }
];
