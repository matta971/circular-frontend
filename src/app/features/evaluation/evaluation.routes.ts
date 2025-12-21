import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const EVALUATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./evaluation.component').then(m => m.EvaluationComponent)
  },
  {
    path: 'my-evaluations',
    canActivate: [authGuard],
    loadComponent: () => import('./my-evaluations/my-evaluations.component').then(m => m.MyEvaluationsComponent)
  }
];
