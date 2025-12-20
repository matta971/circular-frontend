import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const MARKETPLACE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./listings/listings.component').then(m => m.ListingsComponent)
  },
  {
    path: 'listing/:id',
    loadComponent: () => import('./listing-detail/listing-detail.component').then(m => m.ListingDetailComponent)
  },
  {
    path: 'sell',
    canActivate: [authGuard],
    loadComponent: () => import('./create-listing/create-listing.component').then(m => m.CreateListingComponent)
  },
  {
    path: 'my-listings',
    canActivate: [authGuard],
    loadComponent: () => import('./my-listings/my-listings.component').then(m => m.MyListingsComponent)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () => import('./favorites/favorites.component').then(m => m.FavoritesComponent)
  }
];
