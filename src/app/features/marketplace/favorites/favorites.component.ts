import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MarketplaceService } from '../../../core/services';
import { P2PListing } from '../../../core/models';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="favorites-container">
      <header>
        <h1>Mes favoris</h1>
        <p>Retrouvez les annonces que vous avez sauvegardées</p>
      </header>

      @if (loading) {
        <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
      } @else if (favorites.length === 0) {
        <div class="empty-state">
          <mat-icon>favorite_border</mat-icon>
          <h3>Aucun favori</h3>
          <p>Vous n'avez pas encore ajouté d'annonces à vos favoris</p>
          <a mat-raised-button color="primary" routerLink="/marketplace">
            Parcourir le marketplace
          </a>
        </div>
      } @else {
        <div class="listings-grid">
          @for (listing of favorites; track listing.id) {
            <mat-card class="listing-card">
              <div class="listing-image" [routerLink]="['/marketplace/listing', listing.id]">
                @if (listing.images && listing.images.length > 0) {
                  <img [src]="listing.images[0]" [alt]="listing.title">
                } @else {
                  <div class="no-image"><mat-icon>smartphone</mat-icon></div>
                }
              </div>
              <mat-card-content>
                <h3 [routerLink]="['/marketplace/listing', listing.id]">{{ listing.title }}</h3>
                <p class="meta">{{ listing.brand }} {{ listing.model }}</p>
                <div class="footer">
                  <span class="price">{{ listing.price | currency:'EUR' }}</span>
                  <button mat-icon-button color="warn" (click)="removeFromFavorites(listing)">
                    <mat-icon>favorite</mat-icon>
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .favorites-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    header { margin-bottom: 24px; }
    header h1 { margin: 0; }
    header p { color: #666; margin: 4px 0 0 0; }
    .listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .listing-card { overflow: hidden; }
    .listing-image { height: 200px; background: #f5f5f5; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .listing-image img { width: 100%; height: 100%; object-fit: cover; }
    .no-image mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
    h3 { margin: 0 0 4px 0; cursor: pointer; }
    h3:hover { color: #1976d2; }
    .meta { color: #666; font-size: 0.875rem; margin: 0; }
    .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
    .price { font-size: 1.25rem; font-weight: bold; color: #1976d2; }
    .loading, .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; text-align: center; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; margin-bottom: 16px; }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites: P2PListing[] = [];
  loading = true;

  constructor(
    private marketplaceService: MarketplaceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;
    this.marketplaceService.getFavoriteListings().subscribe({
      next: (listings) => { this.favorites = listings; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  removeFromFavorites(listing: P2PListing): void {
    this.marketplaceService.removeFromFavorites(listing.id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== listing.id);
        this.snackBar.open('Retiré des favoris', 'OK', { duration: 2000 });
      }
    });
  }
}
