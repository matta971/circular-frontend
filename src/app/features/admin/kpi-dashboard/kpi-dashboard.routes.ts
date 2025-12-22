import { Routes } from '@angular/router';

export const KPI_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/kpi-overview/kpi-overview.component').then(m => m.KpiOverviewComponent)
  }
];
