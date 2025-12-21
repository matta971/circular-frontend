import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../../core/services';
import { P2POrder, PaymentTransaction } from '../../../core/models';

export interface PaymentDialogData {
  order: P2POrder;
}

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="primary">payment</mat-icon>
      Paiement sécurisé
    </h2>

    <mat-dialog-content>
      <!-- Order Summary -->
      <div class="order-summary">
        <h3>Récapitulatif</h3>
        <div class="summary-row">
          <span>Article</span>
          <span>{{ data.order.price | currency:'EUR' }}</span>
        </div>
        @if (data.order.shippingCost) {
          <div class="summary-row">
            <span>Livraison</span>
            <span>{{ data.order.shippingCost | currency:'EUR' }}</span>
          </div>
        }
        <mat-divider></mat-divider>
        <div class="summary-row total">
          <span>Total</span>
          <span>{{ data.order.totalAmount | currency:'EUR' }}</span>
        </div>
      </div>

      <!-- Escrow Info -->
      <div class="escrow-info">
        <mat-icon>security</mat-icon>
        <div>
          <strong>Paiement protégé par Escrow</strong>
          <p>Votre paiement est sécurisé. Les fonds sont conservés jusqu'à la confirmation de réception de l'article.</p>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="payment-methods">
        <h4>Mode de paiement</h4>
        <mat-radio-group [(ngModel)]="selectedMethod">
          <mat-radio-button value="CARD" class="method-option">
            <div class="method-content">
              <mat-icon>credit_card</mat-icon>
              <span>Carte bancaire</span>
              <div class="method-logos">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" height="20">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" height="20">
              </div>
            </div>
          </mat-radio-button>
          <mat-radio-button value="PAYPAL" class="method-option">
            <div class="method-content">
              <mat-icon>account_balance_wallet</mat-icon>
              <span>PayPal</span>
            </div>
          </mat-radio-button>
        </mat-radio-group>
      </div>

      <!-- Processing State -->
      @if (processing) {
        <div class="processing">
          <mat-spinner diameter="40"></mat-spinner>
          <p>{{ processingMessage }}</p>
        </div>
      }

      <!-- Error -->
      @if (error) {
        <div class="error-box">
          <mat-icon>error</mat-icon>
          <span>{{ error }}</span>
        </div>
      }

      <!-- Success -->
      @if (success) {
        <div class="success-box">
          <mat-icon>check_circle</mat-icon>
          <div>
            <strong>Paiement effectué !</strong>
            <p>Les fonds sont maintenant en escrow. Le vendeur a été notifié.</p>
          </div>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      @if (!success) {
        <button mat-button mat-dialog-close [disabled]="processing">Annuler</button>
        <button
          mat-raised-button
          color="primary"
          (click)="pay()"
          [disabled]="!selectedMethod || processing"
        >
          @if (processing) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            <mat-icon>lock</mat-icon>
            Payer {{ data.order.totalAmount | currency:'EUR' }}
          }
        </button>
      } @else {
        <button mat-raised-button color="primary" (click)="dialogRef.close(payment)">
          Fermer
        </button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }
    mat-dialog-content {
      padding: 24px !important;
      min-width: 400px;
    }
    .order-summary {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .order-summary h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #666;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .summary-row.total {
      font-weight: bold;
      font-size: 18px;
      padding-top: 12px;
    }
    .escrow-info {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #e8f5e9;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .escrow-info mat-icon {
      color: #4caf50;
    }
    .escrow-info p {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: #666;
    }
    .payment-methods h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #666;
    }
    .method-option {
      display: block;
      margin-bottom: 8px;
    }
    .method-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-left: -12px;
      width: calc(100% + 12px);
    }
    .method-option.mat-mdc-radio-checked .method-content {
      border-color: #1976d2;
      background: #e3f2fd;
    }
    .method-logos {
      margin-left: auto;
      display: flex;
      gap: 8px;
    }
    .processing {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px;
      text-align: center;
    }
    .processing p {
      margin-top: 16px;
      color: #666;
    }
    .error-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #ffebee;
      color: #c62828;
      border-radius: 8px;
      margin-top: 16px;
    }
    .success-box {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #e8f5e9;
      border-radius: 8px;
      margin-top: 16px;
    }
    .success-box mat-icon {
      color: #4caf50;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .success-box p {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: #666;
    }
    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }
    mat-dialog-actions button mat-spinner {
      display: inline-block;
    }
  `]
})
export class PaymentDialogComponent implements OnInit {
  selectedMethod: 'CARD' | 'PAYPAL' = 'CARD';
  processing = false;
  processingMessage = '';
  error: string | null = null;
  success = false;
  payment: PaymentTransaction | null = null;

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    private marketplaceService: MarketplaceService,
    @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData
  ) {}

  ngOnInit(): void {}

  pay(): void {
    this.processing = true;
    this.error = null;
    this.processingMessage = 'Initialisation du paiement...';

    // Step 1: Initiate payment
    this.marketplaceService.initiatePayment(this.data.order.id).subscribe({
      next: (transaction) => {
        this.processingMessage = 'Traitement du paiement...';

        // Simulate payment processing (in real app, would redirect to Stripe/PayPal)
        setTimeout(() => {
          this.processingMessage = 'Confirmation du paiement...';

          // Step 2: Confirm payment (simulate successful payment)
          this.marketplaceService.confirmPayment(transaction.transactionRef).subscribe({
            next: (confirmedPayment) => {
              this.processing = false;
              this.success = true;
              this.payment = confirmedPayment;
            },
            error: (err) => {
              this.processing = false;
              this.error = 'Échec de la confirmation du paiement. Veuillez réessayer.';
              console.error('Payment confirmation failed:', err);
            }
          });
        }, 1500);
      },
      error: (err) => {
        this.processing = false;
        this.error = "Impossible d'initier le paiement. Veuillez réessayer.";
        console.error('Payment initiation failed:', err);
      }
    });
  }
}
