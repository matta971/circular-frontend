import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MarketplaceService, AuthService } from '../../../core/services';
import { P2PListing, DeliveryMethod } from '../../../core/models';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    @if (loading) {
      <div class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
    } @else if (!listing) {
      <div class="error-container">
        <mat-icon>error_outline</mat-icon>
        <h2>Annonce introuvable</h2>
        <p>Cette annonce n'existe pas ou a été supprimée</p>
        <a mat-raised-button color="primary" routerLink="/marketplace">
          Retour au marketplace
        </a>
      </div>
    } @else {
      <div class="listing-detail-container">
        <div class="listing-content">
          <div class="gallery-section">
            <div class="main-image">
              @if (listing.images && listing.images.length > 0) {
                <img [src]="listing.images[selectedImageIndex]" [alt]="listing.title">
              } @else {
                <div class="no-image">
                  <mat-icon>smartphone</mat-icon>
                </div>
              }
            </div>
            @if (listing.images && listing.images.length > 1) {
              <div class="thumbnails">
                @for (image of listing.images; track $index) {
                  <img
                    [src]="image"
                    [class.active]="$index === selectedImageIndex"
                    (click)="selectedImageIndex = $index"
                    alt="Thumbnail">
                }
              </div>
            }
          </div>

          <div class="info-section">
            <div class="header">
              <div>
                <mat-chip-set>
                  <mat-chip [class]="listing.condition.toLowerCase()">
                    {{ getConditionLabel(listing.condition) }}
                  </mat-chip>
                  <mat-chip>{{ getCategoryLabel(listing.category) }}</mat-chip>
                </mat-chip-set>
                <h1>{{ listing.title }}</h1>
                <p class="meta">{{ listing.brand }} {{ listing.model }}</p>
              </div>
              <button mat-icon-button (click)="toggleFavorite()" [color]="isFavorite ? 'warn' : ''">
                <mat-icon>{{ isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>
              </button>
            </div>

            <div class="price-section">
              <span class="price">{{ listing.price | currency:'EUR' }}</span>
              @if (listing.negotiable) {
                <span class="negotiable">Prix négociable</span>
              }
            </div>

            <mat-divider></mat-divider>

            <div class="description-section">
              <h3>Description</h3>
              <p>{{ listing.description || 'Aucune description fournie' }}</p>
            </div>

            <mat-divider></mat-divider>

            <div class="details-section">
              <h3>Détails</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="label">Catégorie</span>
                  <span class="value">{{ getCategoryLabel(listing.category) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Marque</span>
                  <span class="value">{{ listing.brand || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Modèle</span>
                  <span class="value">{{ listing.model || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">État</span>
                  <span class="value">{{ getConditionLabel(listing.condition) }}</span>
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="delivery-section">
              <h3>Livraison</h3>
              <div class="delivery-options">
                @if (listing.shippingAvailable) {
                  <div class="delivery-option">
                    <mat-icon>local_shipping</mat-icon>
                    <div>
                      <strong>Livraison</strong>
                      <span>{{ listing.shippingCost ? (listing.shippingCost | currency:'EUR') : 'Gratuite' }}</span>
                    </div>
                  </div>
                }
                @if (listing.meetupAvailable) {
                  <div class="delivery-option">
                    <mat-icon>handshake</mat-icon>
                    <div>
                      <strong>Remise en main propre</strong>
                      <span>{{ listing.location }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <mat-card class="seller-card">
          <mat-card-content>
            <div class="seller-info">
              <div class="seller-avatar">
                <mat-icon>person</mat-icon>
              </div>
              <div>
                <h4>{{ listing.sellerName || 'Vendeur' }}</h4>
                @if (listing.sellerRating) {
                  <div class="rating">
                    <mat-icon>star</mat-icon>
                    <span>{{ listing.sellerRating | number:'1.1-1' }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="listing-stats">
              <div class="stat">
                <mat-icon>visibility</mat-icon>
                <span>{{ listing.viewCount }} vues</span>
              </div>
              <div class="stat">
                <mat-icon>favorite</mat-icon>
                <span>{{ listing.favoriteCount }} favoris</span>
              </div>
              <div class="stat">
                <mat-icon>schedule</mat-icon>
                <span>{{ listing.createdAt | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>

            <div class="actions">
              @if (isOwner) {
                <button mat-raised-button color="primary" routerLink="/marketplace/my-listings">
                  <mat-icon>edit</mat-icon>
                  Gérer mes annonces
                </button>
              } @else {
                <button mat-raised-button color="primary" (click)="buyNow()">
                  <mat-icon>shopping_cart</mat-icon>
                  Acheter maintenant
                </button>
                <button mat-stroked-button color="primary" (click)="contactSeller()">
                  <mat-icon>chat</mat-icon>
                  Contacter le vendeur
                </button>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
  styles: [`
    .listing-detail-container {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 24px;
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .listing-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .gallery-section .main-image {
      background: #f5f5f5;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 4/3;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .gallery-section .main-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .no-image mat-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: #ccc;
    }

    .thumbnails {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }

    .thumbnails img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.2s;
    }

    .thumbnails img.active,
    .thumbnails img:hover {
      border-color: #1976d2;
    }

    .info-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header h1 {
      font-size: 1.75rem;
      margin: 12px 0 4px 0;
    }

    .meta {
      color: #666;
      margin: 0;
    }

    .price-section {
      margin: 24px 0;
    }

    .price {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
    }

    .negotiable {
      display: inline-block;
      margin-left: 12px;
      padding: 4px 12px;
      background: #e3f2fd;
      color: #1976d2;
      border-radius: 16px;
      font-size: 0.875rem;
    }

    h3 {
      margin: 16px 0 12px 0;
      font-size: 1.1rem;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
    }

    .detail-item .label {
      color: #666;
      font-size: 0.875rem;
    }

    .detail-item .value {
      font-weight: 500;
    }

    .delivery-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .delivery-option {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .delivery-option mat-icon {
      color: #4caf50;
    }

    .delivery-option div {
      display: flex;
      flex-direction: column;
    }

    .delivery-option span {
      color: #666;
      font-size: 0.875rem;
    }

    .seller-card {
      position: sticky;
      top: 24px;
      height: fit-content;
    }

    .seller-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .seller-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .seller-avatar mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #666;
    }

    .seller-info h4 {
      margin: 0;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #ffc107;
    }

    .rating mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .listing-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px 0;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      margin-bottom: 16px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }

    .stat mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .actions button {
      width: 100%;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      text-align: center;
    }

    .error-container mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #f44336;
      margin-bottom: 16px;
    }

    mat-chip.new { background-color: #4caf50 !important; color: white !important; }
    mat-chip.like_new { background-color: #8bc34a !important; color: white !important; }
    mat-chip.excellent { background-color: #2196f3 !important; color: white !important; }
    mat-chip.good { background-color: #03a9f4 !important; color: white !important; }
    mat-chip.fair { background-color: #ff9800 !important; color: white !important; }
    mat-chip.for_parts { background-color: #f44336 !important; color: white !important; }

    @media (max-width: 1024px) {
      .listing-detail-container {
        grid-template-columns: 1fr;
      }

      .seller-card {
        position: static;
      }
    }
  `]
})
export class ListingDetailComponent implements OnInit {
  listing: P2PListing | null = null;
  loading = true;
  selectedImageIndex = 0;
  isFavorite = false;
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marketplaceService: MarketplaceService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadListing(parseInt(id, 10));
    }
  }

  loadListing(id: number): void {
    this.loading = true;
    this.marketplaceService.getListing(id).subscribe({
      next: (listing) => {
        this.listing = listing;
        this.loading = false;
        if (listing) {
          const currentUser = this.authService.currentUser();
          this.isOwner = currentUser?.id === listing.sellerId;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleFavorite(): void {
    if (!this.listing) return;

    if (this.isFavorite) {
      this.marketplaceService.removeFromFavorites(this.listing.id).subscribe(() => {
        this.isFavorite = false;
        this.snackBar.open('Retiré des favoris', 'OK', { duration: 2000 });
      });
    } else {
      this.marketplaceService.addToFavorites(this.listing.id).subscribe(() => {
        this.isFavorite = true;
        this.snackBar.open('Ajouté aux favoris', 'OK', { duration: 2000 });
      });
    }
  }

  buyNow(): void {
    if (!this.listing) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // Create order with default delivery method
    const deliveryMethod = this.listing.shippingAvailable ? DeliveryMethod.SHIPPING : DeliveryMethod.MEETUP;
    this.marketplaceService.createOrder({
      listingId: this.listing.id,
      deliveryMethod
    }).subscribe({
      next: (order) => {
        this.router.navigate(['/marketplace/orders', order.id]);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la création de la commande', 'OK', { duration: 3000 });
      }
    });
  }

  contactSeller(): void {
    this.snackBar.open('Fonctionnalité de messagerie à venir', 'OK', { duration: 2000 });
  }

  getCategoryLabel(category: string): string {
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

  getConditionLabel(condition: string): string {
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
