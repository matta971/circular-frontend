import { Routes } from '@angular/router';

export const SCORING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/ruleset-list/ruleset-list.component').then(m => m.RulesetListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/ruleset-detail/ruleset-detail.component').then(m => m.RulesetDetailComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/ruleset-detail/ruleset-detail.component').then(m => m.RulesetDetailComponent)
  }
];
