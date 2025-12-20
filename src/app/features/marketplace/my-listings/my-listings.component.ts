import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarketplaceService } from '../../../core/services';
import { P2PListing, ListingStatus } from '../../../core/models';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="my-listings-container">
      <header>
        <div>
          <h1>Mes annonces</h1>
          <p>Gérez vos annonces en cours et passées</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/marketplace/sell">
          <mat-icon>add</mat-icon>
          Nouvelle annonce
        </a>
      </header>

      <mat-tab-group (selectedTabChange)="onTabChange($event.index)">
        <mat-tab label="Actives ({{ activeCounts.active }})">
          <ng-template matTabContent>
            @if (loading) {
              <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
            } @else {
              <ng-container *ngTemplateOutlet="listingsGrid; context: { listings: activeListings }"></ng-container>
            }
          </ng-template>
        </mat-tab>
        <mat-tab label="Brouillons ({{ activeCounts.draft }})">
          <ng-template matTabContent>
            @if (loading) {
              <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
            } @else {
              <ng-container *ngTemplateOutlet="listingsGrid; context: { listings: draftListings }"></ng-container>
            }
          </ng-template>
        </mat-tab>
        <mat-tab label="Vendus ({{ activeCounts.sold }})">
          <ng-template matTabContent>
            @if (loading) {
              <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
            } @else {
              <ng-container *ngTemplateOutlet="listingsGrid; context: { listings: soldListings }"></ng-container>
            }
          </ng-template>
        </mat-tab>
        <mat-tab label="Expirées ({{ activeCounts.expired }})">
          <ng-template matTabContent>
            @if (loading) {
              <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
            } @else {
              <ng-container *ngTemplateOutlet="listingsGrid; context: { listings: expiredListings }"></ng-container>
            }
          </ng-template>
        </mat-tab>
      </mat-tab-group>

      <ng-template #listingsGrid let-listings="listings">
        @if (listings.length === 0) {
          <div class="empty-state">
            <mat-icon>inventory_2</mat-icon>
            <h3>Aucune annonce</h3>
            <p>Vous n'avez pas d'annonces dans cette catégorie</p>
          </div>
        } @else {
          <div class="listings-grid">
            @for (listing of listings; track listing.id) {
              <mat-card class="listing-card">
                <div class="listing-image" [routerLink]="['/marketplace/listing', listing.id]">
                  @if (listing.images && listing.images.length > 0) {
                    <img [src]="listing.images[0]" [alt]="listing.title">
                  } @else {
                    <div class="no-image"><mat-icon>smartphone</mat-icon></div>
                  }
                  <mat-chip class="status-chip" [class]="listing.status.toLowerCase()">
                    {{ getStatusLabel(listing.status) }}
                  </mat-chip>
                </div>
                <mat-card-content>
                  <h3>{{ listing.title }}</h3>
                  <p class="price">{{ listing.price | currency:'EUR' }}</p>
                  <div class="stats">
                    <span><mat-icon>visibility</mat-icon> {{ listing.viewCount }}</span>
                    <span><mat-icon>favorite</mat-icon> {{ listing.favoriteCount }}</span>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button [routerLink]="['/marketplace/listing', listing.id]">
                    <mat-icon>visibility</mat-icon> Voir
                  </button>
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    @if (listing.status === 'DRAFT') {
                      <button mat-menu-item (click)="publishListing(listing)">
                        <mat-icon>publish</mat-icon> Publier
                      </button>
                    }
                    @if (listing.status === 'ACTIVE') {
                      <button mat-menu-item (click)="cancelListing(listing)">
                        <mat-icon>cancel</mat-icon> Retirer
                      </button>
                    }
                    @if (listing.status === 'EXPIRED') {
                      <button mat-menu-item (click)="republishListing(listing)">
                        <mat-icon>replay</mat-icon> Republier
                      </button>
                    }
                  </mat-menu>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        }
      </ng-template>
    </div>
  `,
  styles: [`
    .my-listings-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    header h1 { margin: 0; }
    header p { color: #666; margin: 4px 0 0 0; }
    .listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; padding: 24px 0; }
    .listing-card { cursor: pointer; }
    .listing-image { position: relative; height: 180px; background: #f5f5f5; overflow: hidden; }
    .listing-image img { width: 100%; height: 100%; object-fit: cover; }
    .no-image { display: flex; align-items: center; justify-content: center; height: 100%; }
    .no-image mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
    .status-chip { position: absolute; top: 8px; right: 8px; }
    .status-chip.active { background: #4caf50 !important; color: white !important; }
    .status-chip.draft { background: #9e9e9e !important; color: white !important; }
    .status-chip.sold { background: #2196f3 !important; color: white !important; }
    .status-chip.expired { background: #ff9800 !important; color: white !important; }
    h3 { margin: 0 0 8px 0; font-size: 1.1rem; }
    .price { font-size: 1.25rem; font-weight: bold; color: #1976d2; margin: 0; }
    .stats { display: flex; gap: 16px; margin-top: 8px; color: #666; font-size: 0.875rem; }
    .stats span { display: flex; align-items: center; gap: 4px; }
    .stats mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .loading, .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
  `]
})
export class MyListingsComponent implements OnInit {
  activeListings: P2PListing[] = [];
  draftListings: P2PListing[] = [];
  soldListings: P2PListing[] = [];
  expiredListings: P2PListing[] = [];
  loading = true;

  activeCounts = { active: 0, draft: 0, sold: 0, expired: 0 };

  constructor(
    private marketplaceService: MarketplaceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllListings();
  }

  loadAllListings(): void {
    this.loading = true;
    this.marketplaceService.getMyListings().subscribe({
      next: (listings) => {
        this.activeListings = listings.filter(l => l.status === ListingStatus.ACTIVE);
        this.draftListings = listings.filter(l => l.status === ListingStatus.DRAFT);
        this.soldListings = listings.filter(l => l.status === ListingStatus.SOLD);
        this.expiredListings = listings.filter(l => l.status === ListingStatus.EXPIRED);
        this.activeCounts = {
          active: this.activeListings.length,
          draft: this.draftListings.length,
          sold: this.soldListings.length,
          expired: this.expiredListings.length
        };
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onTabChange(index: number): void {
    // Tab content loaded lazily
  }

  publishListing(listing: P2PListing): void {
    this.marketplaceService.publishListing(listing.id).subscribe({
      next: () => {
        this.snackBar.open('Annonce publiée', 'OK', { duration: 2000 });
        this.loadAllListings();
      }
    });
  }

  cancelListing(listing: P2PListing): void {
    this.marketplaceService.cancelListing(listing.id).subscribe({
      next: () => {
        this.snackBar.open('Annonce retirée', 'OK', { duration: 2000 });
        this.loadAllListings();
      }
    });
  }

  republishListing(listing: P2PListing): void {
    this.marketplaceService.publishListing(listing.id).subscribe({
      next: () => {
        this.snackBar.open('Annonce republiée', 'OK', { duration: 2000 });
        this.loadAllListings();
      }
    });
  }

  getStatusLabel(status: ListingStatus | string): string {
    const labels: Record<string, string> = {
      DRAFT: 'Brouillon', ACTIVE: 'Active', RESERVED: 'Réservée',
      SOLD: 'Vendu', EXPIRED: 'Expirée', CANCELLED: 'Annulée'
    };
    return labels[status] || status;
  }
}
