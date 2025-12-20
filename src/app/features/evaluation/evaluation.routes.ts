import { Routes } from '@angular/router';

export const EVALUATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./evaluation.component').then(m => m.EvaluationComponent)
  }
];
