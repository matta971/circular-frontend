import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'collections',
        loadComponent: () => import('./collections/admin-collections.component').then(m => m.AdminCollectionsComponent)
      },
      {
        path: 'devices',
        loadComponent: () => import('./devices/admin-devices.component').then(m => m.AdminDevicesComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'repair-partners',
        loadChildren: () => import('./repair-partners/repair-partners.routes').then(m => m.REPAIR_PARTNERS_ROUTES)
      },
      {
        path: 'scoring',
        loadChildren: () => import('./scoring/scoring.routes').then(m => m.SCORING_ROUTES)
      },
      {
        path: 'kpis',
        loadChildren: () => import('./kpi-dashboard/kpi-dashboard.routes').then(m => m.KPI_DASHBOARD_ROUTES)
      },
      {
        path: 'partner-analytics',
        loadChildren: () => import('./partner-analytics/partner-analytics.routes').then(m => m.PARTNER_ANALYTICS_ROUTES)
      },
      {
        path: 'partner-subscriptions',
        loadChildren: () => import('./partner-subscriptions/partner-subscriptions.routes').then(m => m.PARTNER_SUBSCRIPTIONS_ROUTES)
      }
    ]
  }
];
