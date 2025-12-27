import { Routes } from '@angular/router';

export const PARTNER_OPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./partner-ops-layout.component').then(m => m.PartnerOpsLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/ops-dashboard.component').then(m => m.OpsDashboardComponent)
      },
      {
        path: 'to-receive',
        loadComponent: () => import('./to-receive/ops-to-receive.component').then(m => m.OpsToReceiveComponent)
      },
      {
        path: 'devices',
        loadComponent: () => import('./devices/ops-devices.component').then(m => m.OpsDevicesComponent)
      },
      {
        path: 'devices/:id',
        loadComponent: () => import('./devices/ops-device-detail.component').then(m => m.OpsDeviceDetailComponent)
      },
      {
        path: 'finalization',
        loadComponent: () => import('./finalization/ops-finalization.component').then(m => m.OpsFinalizationComponent)
      },
      {
        path: 'certificates',
        loadComponent: () => import('./certificates/ops-certificates.component').then(m => m.OpsCertificatesComponent)
      }
    ]
  }
];
