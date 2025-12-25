import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'evaluation',
    loadChildren: () => import('./features/evaluation/evaluation.routes').then(m => m.EVALUATION_ROUTES)
  },
  {
    path: 'repairability',
    loadChildren: () => import('./features/repairability/repairability.routes').then(m => m.REPAIRABILITY_ROUTES)
  },
  {
    path: 'collection',
    canActivate: [authGuard],
    loadChildren: () => import('./features/collection/collection.routes').then(m => m.COLLECTION_ROUTES)
  },
  {
    path: 'deposit',
    loadChildren: () => import('./features/deposit/deposit.routes').then(m => m.DEPOSIT_ROUTES)
  },
  {
    path: 'wallet',
    canActivate: [authGuard],
    loadChildren: () => import('./features/wallet/wallet.routes').then(m => m.WALLET_ROUTES)
  },
  {
    path: 'tokens',
    canActivate: [authGuard],
    loadChildren: () => import('./features/tokens/tokens.routes').then(m => m.TOKENS_ROUTES)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: 'marketplace',
    loadChildren: () => import('./features/marketplace/marketplace.routes').then(m => m.MARKETPLACE_ROUTES)
  },
  {
    path: 'certificates',
    loadChildren: () => import('./features/certificates/certificates.routes').then(m => m.CERTIFICATES_ROUTES)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notifications/notifications.routes').then(m => m.NOTIFICATIONS_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
