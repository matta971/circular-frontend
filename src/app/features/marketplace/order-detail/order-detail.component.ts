import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MarketplaceService, AuthService } from '../../../core/services';
import { P2POrder, OrderStatus, Shipment, PaymentTransaction } from '../../../core/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    @if (loading) {
      <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
    } @else if (!order) {
      <div class="error">
        <mat-icon>error</mat-icon>
        <h2>Commande introuvable</h2>
        <a mat-raised-button routerLink="/marketplace/orders">Retour aux commandes</a>
      </div>
    } @else {
      <div class="order-detail-container">
        <header>
          <div>
            <h1>Commande #{{ order.orderNumber }}</h1>
            <p>Passée le {{ order.createdAt | date:'dd MMMM yyyy à HH:mm' }}</p>
          </div>
          <mat-chip [class]="order.status.toLowerCase()">
            {{ getStatusLabel(order.status) }}
          </mat-chip>
        </header>

        <!-- Order Progress -->
        <mat-card class="progress-card">
          <mat-card-content>
            <mat-stepper [linear]="false" [selectedIndex]="getStepIndex()">
              <mat-step [completed]="isStepCompleted('CREATED')">
                <ng-template matStepLabel>Commande</ng-template>
              </mat-step>
              <mat-step [completed]="isStepCompleted('PAID_ESCROW')">
                <ng-template matStepLabel>Paiement</ng-template>
              </mat-step>
              <mat-step [completed]="isStepCompleted('SHIPPED')">
                <ng-template matStepLabel>Expédition</ng-template>
              </mat-step>
              <mat-step [completed]="isStepCompleted('DELIVERED')">
                <ng-template matStepLabel>Livraison</ng-template>
              </mat-step>
              <mat-step [completed]="isStepCompleted('COMPLETED')">
                <ng-template matStepLabel>Terminée</ng-template>
              </mat-step>
            </mat-stepper>
          </mat-card-content>
        </mat-card>

        <div class="content-grid">
          <!-- Order Item -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Article</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="item-row" [routerLink]="['/marketplace/listing', order.listingId]">
                <div class="item-image">
                  @if (order.listing?.images?.length) {
                    <img [src]="order.listing!.images[0]" alt="">
                  } @else {
                    <mat-icon>smartphone</mat-icon>
                  }
                </div>
                <div class="item-info">
                  <h3>{{ order.listing?.title }}</h3>
                  <p>{{ order.listing?.brand }} {{ order.listing?.model }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Price Summary -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Récapitulatif</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="price-row">
                <span>Prix de l'article</span>
                <span>{{ order.price | currency:'EUR' }}</span>
              </div>
              <div class="price-row">
                <span>Frais de livraison</span>
                <span>{{ order.shippingCost || 0 | currency:'EUR' }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="price-row total">
                <span>Total</span>
                <span>{{ order.totalAmount | currency:'EUR' }}</span>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Shipping Info -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Livraison</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @if (order.deliveryMethod === 'SHIPPING') {
                <div class="info-block">
                  <mat-icon>local_shipping</mat-icon>
                  <div>
                    <strong>Livraison à domicile</strong>
                    @if (order.shippingAddress) {
                      <p>
                        {{ order.shippingAddress.fullName }}<br>
                        {{ order.shippingAddress.line1 }}<br>
                        {{ order.shippingAddress.postalCode }} {{ order.shippingAddress.city }}
                      </p>
                    }
                  </div>
                </div>
                @if (shipment) {
                  <mat-divider></mat-divider>
                  <div class="tracking-info">
                    <strong>Suivi:</strong>
                    <span>{{ shipment.carrier }} - {{ shipment.trackingNumber }}</span>
                    @if (shipment.trackingUrl) {
                      <a [href]="shipment.trackingUrl" target="_blank" mat-button color="primary">
                        Suivre le colis
                      </a>
                    }
                  </div>
                }
              } @else {
                <div class="info-block">
                  <mat-icon>handshake</mat-icon>
                  <div>
                    <strong>Remise en main propre</strong>
                    <p>{{ order.meetupLocation }}</p>
                    @if (order.meetupDate) {
                      <p>{{ order.meetupDate | date:'dd/MM/yyyy HH:mm' }}</p>
                    }
                  </div>
                </div>
              }
            </mat-card-content>
          </mat-card>

          <!-- Parties -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ isSeller ? 'Acheteur' : 'Vendeur' }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="party-info">
                <div class="avatar"><mat-icon>person</mat-icon></div>
                <div>
                  <strong>{{ isSeller ? order.buyerName : order.sellerName }}</strong>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Actions -->
        <mat-card class="actions-card">
          <mat-card-content>
            @if (order.status === 'CREATED' && !isSeller) {
              <button mat-raised-button color="primary" (click)="pay()">
                <mat-icon>payment</mat-icon> Payer maintenant
              </button>
              <button mat-button color="warn" (click)="cancel()">Annuler</button>
            }
            @if (order.status === 'PAID_ESCROW' && isSeller) {
              <button mat-raised-button color="primary" (click)="markAsShipped()">
                <mat-icon>local_shipping</mat-icon> Marquer comme expédié
              </button>
            }
            @if (order.status === 'SHIPPED' && !isSeller) {
              <button mat-raised-button color="primary" (click)="confirmDelivery()">
                <mat-icon>check_circle</mat-icon> Confirmer la réception
              </button>
            }
            @if (order.status === 'DELIVERED') {
              <button mat-raised-button color="primary" (click)="confirmDelivery()">
                <mat-icon>thumb_up</mat-icon> Tout est OK - Finaliser
              </button>
              <button mat-button color="warn" (click)="openDispute()">
                <mat-icon>report_problem</mat-icon> Signaler un problème
              </button>
            }
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
  styles: [`
    .order-detail-container { padding: 24px; max-width: 1000px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    header h1 { margin: 0; }
    header p { color: #666; margin: 4px 0 0 0; }
    .progress-card { margin-bottom: 24px; }
    .content-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
    .item-row { display: flex; gap: 16px; cursor: pointer; }
    .item-image { width: 80px; height: 80px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .item-image img { width: 100%; height: 100%; object-fit: cover; }
    .item-image mat-icon { font-size: 40px; width: 40px; height: 40px; color: #ccc; }
    .item-info h3 { margin: 0 0 4px 0; }
    .item-info p { color: #666; margin: 0; }
    .price-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .price-row.total { font-weight: bold; font-size: 1.1rem; }
    .info-block { display: flex; gap: 12px; padding: 8px 0; }
    .info-block mat-icon { color: #1976d2; }
    .info-block p { margin: 4px 0 0 0; color: #666; }
    .tracking-info { padding: 12px 0; display: flex; align-items: center; gap: 12px; }
    .party-info { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 48px; height: 48px; border-radius: 50%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; }
    .actions-card mat-card-content { display: flex; gap: 12px; }
    mat-chip.created, mat-chip.pending_payment { background: #ff9800 !important; color: white !important; }
    mat-chip.paid, mat-chip.paid_escrow { background: #4caf50 !important; color: white !important; }
    mat-chip.shipped { background: #2196f3 !important; color: white !important; }
    mat-chip.delivered { background: #03a9f4 !important; color: white !important; }
    mat-chip.completed { background: #4caf50 !important; color: white !important; }
    mat-chip.cancelled, mat-chip.refunded { background: #f44336 !important; color: white !important; }
    .loading, .error { display: flex; flex-direction: column; align-items: center; padding: 64px; text-align: center; }
    .error mat-icon { font-size: 64px; width: 64px; height: 64px; color: #f44336; margin-bottom: 16px; }
    @media (max-width: 768px) { .content-grid { grid-template-columns: 1fr; } }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: P2POrder | null = null;
  shipment: Shipment | null = null;
  payment: PaymentTransaction | null = null;
  loading = true;
  isSeller = false;

  private statusOrder = ['CREATED', 'PAID_ESCROW', 'SHIPPED', 'DELIVERED', 'COMPLETED'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marketplaceService: MarketplaceService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadOrder(parseInt(id, 10));
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.marketplaceService.getOrder(id).subscribe({
      next: (order) => {
        this.order = order;
        if (order) {
          const user = this.authService.currentUser();
          this.isSeller = user?.id === order.sellerId;
          this.loadShipment(order.id);
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadShipment(orderId: number): void {
    this.marketplaceService.getShipmentByOrder(orderId).subscribe({
      next: (shipment) => { this.shipment = shipment; }
    });
  }

  getStepIndex(): number {
    if (!this.order) return 0;
    const idx = this.statusOrder.indexOf(this.order.status);
    return idx >= 0 ? idx : 0;
  }

  isStepCompleted(status: string): boolean {
    if (!this.order) return false;
    const currentIdx = this.statusOrder.indexOf(this.order.status);
    const stepIdx = this.statusOrder.indexOf(status);
    return stepIdx < currentIdx || this.order.status === 'COMPLETED';
  }

  pay(): void {
    if (!this.order) return;
    this.marketplaceService.payOrder(this.order.id).subscribe({
      next: () => {
        this.snackBar.open('Paiement effectué', 'OK', { duration: 2000 });
        this.loadOrder(this.order!.id);
      },
      error: () => { this.snackBar.open('Erreur de paiement', 'OK', { duration: 3000 }); }
    });
  }

  cancel(): void {
    if (!this.order) return;
    this.marketplaceService.cancelOrder(this.order.id).subscribe({
      next: () => {
        this.snackBar.open('Commande annulée', 'OK', { duration: 2000 });
        this.router.navigate(['/marketplace/orders']);
      }
    });
  }

  markAsShipped(): void {
    if (!this.order) return;
    this.marketplaceService.createShipment(this.order.id).subscribe({
      next: (shipment) => {
        this.marketplaceService.markAsShipped(shipment.id).subscribe({
          next: () => {
            this.snackBar.open('Marqué comme expédié', 'OK', { duration: 2000 });
            this.loadOrder(this.order!.id);
          }
        });
      }
    });
  }

  confirmDelivery(): void {
    if (!this.order) return;
    this.marketplaceService.confirmDelivery(this.order.id).subscribe({
      next: () => {
        this.snackBar.open('Livraison confirmée', 'OK', { duration: 2000 });
        this.loadOrder(this.order!.id);
      }
    });
  }

  openDispute(): void {
    this.snackBar.open('Redirection vers le formulaire de litige...', 'OK', { duration: 2000 });
  }

  getStatusLabel(status: OrderStatus | string): string {
    const labels: Record<string, string> = {
      CREATED: 'En attente de paiement',
      PENDING_PAYMENT: 'En attente de paiement',
      PAID: 'Payée',
      PAID_ESCROW: 'Payée',
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
