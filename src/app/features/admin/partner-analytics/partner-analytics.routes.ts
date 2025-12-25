import { Routes } from '@angular/router';

export const PARTNER_ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/analytics-dashboard/analytics-dashboard.component')
      .then(m => m.AnalyticsDashboardComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/partner-detail/partner-detail.component')
      .then(m => m.PartnerDetailComponent)
  }
];
