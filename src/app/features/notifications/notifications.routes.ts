import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./notifications.component').then(m => m.NotificationsComponent)
  },
  {
    path: 'preferences',
    canActivate: [authGuard],
    loadComponent: () => import('./notification-preferences/notification-preferences.component').then(m => m.NotificationPreferencesComponent)
  }
];
