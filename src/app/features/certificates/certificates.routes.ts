import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CERTIFICATES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./certificates-list/certificates-list.component').then(m => m.CertificatesListComponent)
  },
  {
    path: 'verify',
    loadComponent: () => import('./certificate-verify/certificate-verify.component').then(m => m.CertificateVerifyComponent)
  },
  {
    path: ':certificateNumber',
    loadComponent: () => import('./certificate-detail/certificate-detail.component').then(m => m.CertificateDetailComponent)
  }
];
