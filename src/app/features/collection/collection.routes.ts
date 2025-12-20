import { Routes } from '@angular/router';

export const COLLECTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./collection-list.component').then(m => m.CollectionListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./collection-new.component').then(m => m.CollectionNewComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./collection-detail.component').then(m => m.CollectionDetailComponent)
  }
];
