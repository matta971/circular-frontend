import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarketplaceService } from '../../../core/services';
import { P2POrder, OrderStatus } from '../../../core/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="orders-container">
      <header>
        <h1>Mes commandes</h1>
        <p>Suivez vos achats et ventes</p>
      </header>

      <mat-tab-group>
        <mat-tab label="Mes achats">
          <ng-template matTabContent>
            @if (loadingBuyer) {
              <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
            } @else if (buyerOrders.length === 0) {
              <div class="empty-state">
                <mat-icon>shopping_bag</mat-icon>
                <h3>Aucun achat</h3>
                <p>Vous n'avez pas encore effectué d'achat</p>
                <a mat-raised-button color="primary" routerLink="/marketplace">
                  Parcourir le marketplace
                </a>
              </div>
            } @else {
              <div class="orders-list">
                @for (order of buyerOrders; track order.id) {
                  <mat-card class="order-card" [routerLink]="['/marketplace/orders', order.id]">
                    <div class="order-image">
                      @if (order.listing?.images?.length) {
                        <img [src]="order.listing!.images[0]" [alt]="order.listing!.title">
                      } @else {
                        <mat-icon>smartphone</mat-icon>
                      }
                    </div>
                    <div class="order-info">
                      <div class="order-header">
                        <span class="order-number">Commande #{{ order.orderNumber }}</span>
                        <mat-chip [class]="order.status.toLowerCase()">
                          {{ getStatusLabel(order.status) }}
                        </mat-chip>
                      </div>
                      <h3>{{ order.listing?.title || 'Article' }}</h3>
                      <p class="seller">Vendeur: {{ order.sellerName }}</p>
                      <div class="order-footer">
                        <span class="price">{{ order.totalAmount | currency:'EUR' }}</span>
                        <span class="date">{{ order.createdAt | date:'dd/MM/yyyy' }}</span>
                      </div>
                    </div>
                    <mat-icon class="chevron">chevron_right</mat-icon>
                  </mat-card>
                }
              </div>
            }
          </ng-template>
        </mat-tab>

        <mat-tab label="Mes ventes">
          <ng-template matTabContent>
            @if (loadingSeller) {
              <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
            } @else if (sellerOrders.length === 0) {
              <div class="empty-state">
                <mat-icon>storefront</mat-icon>
                <h3>Aucune vente</h3>
                <p>Vous n'avez pas encore vendu d'article</p>
                <a mat-raised-button color="primary" routerLink="/marketplace/sell">
                  Créer une annonce
                </a>
              </div>
            } @else {
              <div class="orders-list">
                @for (order of sellerOrders; track order.id) {
                  <mat-card class="order-card" [routerLink]="['/marketplace/orders', order.id]">
                    <div class="order-image">
                      @if (order.listing?.images?.length) {
                        <img [src]="order.listing!.images[0]" [alt]="order.listing!.title">
                      } @else {
                        <mat-icon>smartphone</mat-icon>
                      }
                    </div>
                    <div class="order-info">
                      <div class="order-header">
                        <span class="order-number">Commande #{{ order.orderNumber }}</span>
                        <mat-chip [class]="order.status.toLowerCase()">
                          {{ getStatusLabel(order.status) }}
                        </mat-chip>
                      </div>
                      <h3>{{ order.listing?.title || 'Article' }}</h3>
                      <p class="seller">Acheteur: {{ order.buyerName }}</p>
                      <div class="order-footer">
                        <span class="price">{{ order.totalAmount | currency:'EUR' }}</span>
                        <span class="date">{{ order.createdAt | date:'dd/MM/yyyy' }}</span>
                      </div>
                    </div>
                    <mat-icon class="chevron">chevron_right</mat-icon>
                  </mat-card>
                }
              </div>
            }
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .orders-container { padding: 24px; max-width: 900px; margin: 0 auto; }
    header { margin-bottom: 24px; }
    header h1 { margin: 0; }
    header p { color: #666; margin: 4px 0 0 0; }
    .orders-list { display: flex; flex-direction: column; gap: 16px; padding: 24px 0; }
    .order-card { display: flex; align-items: center; gap: 16px; padding: 16px; cursor: pointer; transition: box-shadow 0.2s; }
    .order-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .order-image { width: 80px; height: 80px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
    .order-image img { width: 100%; height: 100%; object-fit: cover; }
    .order-image mat-icon { font-size: 40px; width: 40px; height: 40px; color: #ccc; }
    .order-info { flex: 1; }
    .order-header { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
    .order-number { font-size: 0.875rem; color: #666; }
    .order-info h3 { margin: 0 0 4px 0; }
    .seller { color: #666; font-size: 0.875rem; margin: 0; }
    .order-footer { display: flex; justify-content: space-between; margin-top: 8px; }
    .price { font-weight: bold; color: #1976d2; }
    .date { color: #999; font-size: 0.875rem; }
    .chevron { color: #ccc; }
    mat-chip.pending_payment { background: #ff9800 !important; color: white !important; }
    mat-chip.paid { background: #4caf50 !important; color: white !important; }
    mat-chip.shipped { background: #2196f3 !important; color: white !important; }
    mat-chip.delivered { background: #03a9f4 !important; color: white !important; }
    mat-chip.completed { background: #4caf50 !important; color: white !important; }
    mat-chip.cancelled, mat-chip.refunded { background: #f44336 !important; color: white !important; }
    mat-chip.disputed { background: #9c27b0 !important; color: white !important; }
    .loading, .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; text-align: center; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; margin-bottom: 16px; }
  `]
})
export class OrdersComponent implements OnInit {
  buyerOrders: P2POrder[] = [];
  sellerOrders: P2POrder[] = [];
  loadingBuyer = true;
  loadingSeller = true;

  constructor(private marketplaceService: MarketplaceService) {}

  ngOnInit(): void {
    this.loadBuyerOrders();
    this.loadSellerOrders();
  }

  loadBuyerOrders(): void {
    this.marketplaceService.getMyOrders('buyer').subscribe({
      next: (orders) => { this.buyerOrders = orders; this.loadingBuyer = false; },
      error: () => { this.loadingBuyer = false; }
    });
  }

  loadSellerOrders(): void {
    this.marketplaceService.getMyOrders('seller').subscribe({
      next: (orders) => { this.sellerOrders = orders; this.loadingSeller = false; },
      error: () => { this.loadingSeller = false; }
    });
  }

  getStatusLabel(status: OrderStatus | string): string {
    const labels: Record<string, string> = {
      PENDING_PAYMENT: 'En attente de paiement',
      PAID: 'Payée',
      SHIPPED: 'Expédiée',
      DELIVERED: 'Livrée',
      COMPLETED: 'Terminée',
      CANCELLED: 'Annulée',
      REFUNDED: 'Remboursée',
      DISPUTED: 'Litige'
    };
    return labels[status] || status;
  }
}
