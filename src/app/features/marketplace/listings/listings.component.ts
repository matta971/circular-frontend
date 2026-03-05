import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarketplaceService } from '../../../core/services';
import { SeoService } from '../../../core/services/seo.service';
import {
  P2PListing,
  ListingSearchParams,
  DeviceCategory,
  ListingCondition
} from '../../../core/models';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="marketplace-container">
      <header class="marketplace-header">
        <h1>Marketplace</h1>
        <p>Achetez et vendez des appareils électroniques d'occasion</p>
        <a mat-raised-button color="primary" routerLink="/marketplace/sell">
          <mat-icon>add</mat-icon>
          Vendre un appareil
        </a>
      </header>

      <div class="filters-section">
        <mat-form-field appearance="outline">
          <mat-label>Rechercher</mat-label>
          <input matInput [(ngModel)]="searchParams.query" (keyup.enter)="search()" placeholder="iPhone, Samsung...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Catégorie</mat-label>
          <mat-select [(ngModel)]="searchParams.category" (selectionChange)="search()">
            <mat-option [value]="null">Toutes</mat-option>
            @for (cat of categories; track cat) {
              <mat-option [value]="cat">{{ getCategoryLabel(cat) }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>État</mat-label>
          <mat-select [(ngModel)]="searchParams.condition" (selectionChange)="search()">
            <mat-option [value]="null">Tous</mat-option>
            @for (cond of conditions; track cond) {
              <mat-option [value]="cond">{{ getConditionLabel(cond) }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Trier par</mat-label>
          <mat-select [(ngModel)]="searchParams.sortBy" (selectionChange)="search()">
            <mat-option value="date_desc">Plus récents</mat-option>
            <mat-option value="price_asc">Prix croissant</mat-option>
            <mat-option value="price_desc">Prix décroissant</mat-option>
            <mat-option value="popularity">Popularité</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (listings.length === 0) {
        <div class="empty-state">
          <mat-icon>inventory_2</mat-icon>
          <h3>Aucune annonce trouvée</h3>
          <p>Modifiez vos critères de recherche ou revenez plus tard</p>
        </div>
      } @else {
        <div class="listings-grid">
          @for (listing of listings; track listing.id) {
            <mat-card class="listing-card" [routerLink]="['/marketplace/listing', listing.id]">
              <div class="listing-image">
                @if (listing.images && listing.images.length > 0) {
                  <img [src]="listing.images[0]" [alt]="listing.title">
                } @else {
                  <div class="no-image">
                    <mat-icon>smartphone</mat-icon>
                  </div>
                }
                <span class="condition-badge" [class]="listing.condition.toLowerCase()">
                  {{ getConditionLabel(listing.condition) }}
                </span>
              </div>
              <mat-card-content>
                <h3 class="listing-title">{{ listing.title }}</h3>
                <p class="listing-meta">
                  {{ listing.brand }} {{ listing.model }}
                </p>
                <div class="listing-footer">
                  <span class="price">{{ listing.price | currency:'EUR' }}</span>
                  <span class="location" *ngIf="listing.location">
                    <mat-icon>location_on</mat-icon>
                    {{ listing.location }}
                  </span>
                </div>
                <div class="listing-stats">
                  <span><mat-icon>visibility</mat-icon> {{ listing.viewCount }}</span>
                  <span><mat-icon>favorite</mat-icon> {{ listing.favoriteCount }}</span>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>

        <mat-paginator
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageIndex]="currentPage"
          [pageSizeOptions]="[12, 24, 48]"
          (page)="onPageChange($event)"
          aria-label="Sélectionner la page">
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .marketplace-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .marketplace-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .marketplace-header h1 {
      font-size: 2.5rem;
      margin-bottom: 8px;
    }

    .marketplace-header p {
      color: #666;
      margin-bottom: 16px;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .filters-section mat-form-field {
      flex: 1;
      min-width: 200px;
    }

    .listings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .listing-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .listing-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .listing-image {
      position: relative;
      height: 200px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .listing-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
    }

    .condition-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .condition-badge.new { background: #4caf50; color: white; }
    .condition-badge.like_new { background: #8bc34a; color: white; }
    .condition-badge.excellent { background: #2196f3; color: white; }
    .condition-badge.good { background: #03a9f4; color: white; }
    .condition-badge.fair { background: #ff9800; color: white; }
    .condition-badge.for_parts { background: #f44336; color: white; }

    .listing-title {
      font-size: 1.1rem;
      margin: 0 0 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .listing-meta {
      color: #666;
      font-size: 0.9rem;
      margin: 0 0 12px 0;
    }

    .listing-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price {
      font-size: 1.25rem;
      font-weight: bold;
      color: #1976d2;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 0.85rem;
    }

    .location mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .listing-stats {
      display: flex;
      gap: 16px;
      margin-top: 8px;
      color: #999;
      font-size: 0.85rem;
    }

    .listing-stats span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .listing-stats mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .loading-container, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
    }

    .empty-state p {
      color: #666;
    }
  `]
})
export class ListingsComponent implements OnInit {
  listings: P2PListing[] = [];
  loading = true;
  totalElements = 0;
  currentPage = 0;
  pageSize = 12;

  searchParams: ListingSearchParams = {
    sortBy: 'date_desc'
  };

  categories = Object.values(DeviceCategory);
  conditions = Object.values(ListingCondition);

  private seo = inject(SeoService);

  constructor(private marketplaceService: MarketplaceService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Marketplace',
      description: 'Achetez et vendez des appareils electroniques d\'occasion certifies sur Circular Electronics. Smartphones, tablettes, ordinateurs — tous verifies et traces.',
      ogType: 'website'
    });
    this.search();
  }

  search(): void {
    this.currentPage = 0;
    this.loadListings();
  }

  loadListings(): void {
    this.loading = true;
    const params = {
      ...this.searchParams,
      page: this.currentPage,
      size: this.pageSize
    };

    this.marketplaceService.searchListings(params).subscribe({
      next: (result) => {
        this.listings = result.content;
        this.totalElements = result.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadListings();
  }

  getCategoryLabel(category: DeviceCategory | string): string {
    const labels: Record<string, string> = {
      SMARTPHONE: 'Smartphone',
      TABLET: 'Tablette',
      LAPTOP: 'Ordinateur portable',
      DESKTOP: 'Ordinateur de bureau',
      SMARTWATCH: 'Montre connectée',
      HEADPHONES: 'Casque/Écouteurs',
      GAMING_CONSOLE: 'Console de jeux',
      CAMERA: 'Appareil photo',
      OTHER: 'Autre'
    };
    return labels[category] || category;
  }

  getConditionLabel(condition: ListingCondition | string): string {
    const labels: Record<string, string> = {
      NEW: 'Neuf',
      LIKE_NEW: 'Comme neuf',
      EXCELLENT: 'Excellent',
      GOOD: 'Bon',
      FAIR: 'Correct',
      FOR_PARTS: 'Pour pièces'
    };
    return labels[condition] || condition;
  }
}
