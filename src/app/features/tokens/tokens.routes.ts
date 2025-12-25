import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const TOKENS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./tokens.component').then(m => m.TokensComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('./components/token-transactions/token-transactions.component')
          .then(m => m.TokenTransactionsComponent)
      },
      {
        path: 'vouchers',
        loadComponent: () => import('./components/voucher-list/voucher-list.component')
          .then(m => m.VoucherListComponent)
      }
    ]
  }
];
