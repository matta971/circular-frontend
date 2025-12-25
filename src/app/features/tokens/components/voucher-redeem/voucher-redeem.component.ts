import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TokenService } from '../../../../core/services/token.service';
import { VoucherTemplate, Voucher } from '../../../../core/models/token.model';

@Component({
  selector: 'app-voucher-redeem',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>redeem</mat-icon>
      Échanger des tokens
    </h2>

    <mat-dialog-content>
      @if (!redeemed && !loading) {
        <div class="confirmation">
          <div class="template-summary">
            <h3>{{ template.name }}</h3>
            <p class="value">{{ template.valueDisplay }}</p>
            <p>{{ template.description }}</p>
          </div>

          <div class="exchange-details">
            <div class="exchange-item">
              <mat-icon>toll</mat-icon>
              <div>
                <span class="label">Coût</span>
                <span class="amount">{{ template.tokensCost }} tokens</span>
              </div>
            </div>

            <mat-icon class="arrow">arrow_forward</mat-icon>

            <div class="exchange-item">
              <mat-icon>card_giftcard</mat-icon>
              <div>
                <span class="label">Vous recevez</span>
                <span class="amount">{{ template.valueDisplay }} de réduction</span>
              </div>
            </div>
          </div>

          @if (template.partnerName) {
            <p class="partner-info">
              <mat-icon>store</mat-icon>
              Utilisable chez {{ template.partnerName }}
            </p>
          } @else {
            <p class="partner-info">
              <mat-icon>store</mat-icon>
              Utilisable chez tous les partenaires
            </p>
          }

          <p class="validity-info">
            <mat-icon>schedule</mat-icon>
            Valable {{ template.validityDays }} jours après l'échange
          </p>

          @if (template.termsAndConditions) {
            <div class="terms">
              <small>{{ template.termsAndConditions }}</small>
            </div>
          }
        </div>
      }

      @if (loading) {
        <div class="loading">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Création du voucher...</p>
        </div>
      }

      @if (redeemed && createdVoucher) {
        <div class="success">
          <mat-icon class="success-icon">check_circle</mat-icon>
          <h3>Voucher créé!</h3>
          <p class="code">{{ createdVoucher.code }}</p>
          <p>Présentez ce code chez le partenaire pour bénéficier de votre réduction.</p>
          <p class="expiry">
            <mat-icon>schedule</mat-icon>
            Expire le {{ createdVoucher.expiresAt | date:'dd/MM/yyyy' }}
          </p>
        </div>
      }

      @if (error) {
        <div class="error">
          <mat-icon>error</mat-icon>
          <p>{{ error }}</p>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      @if (!redeemed && !loading) {
        <button mat-button mat-dialog-close>Annuler</button>
        <button mat-raised-button color="primary" (click)="redeem()">
          <mat-icon>redeem</mat-icon>
          Confirmer l'échange
        </button>
      }

      @if (redeemed) {
        <button mat-raised-button color="primary" [mat-dialog-close]="true">
          Fermer
        </button>
      }

      @if (error) {
        <button mat-button mat-dialog-close>Fermer</button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .confirmation {
      min-width: 300px;
    }

    .template-summary {
      text-align: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .template-summary h3 {
      margin: 0;
    }

    .template-summary .value {
      font-size: 2rem;
      font-weight: 700;
      color: #22c55e;
      margin: 0.5rem 0;
    }

    .exchange-details {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1.5rem 0;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 1rem 0;
    }

    .exchange-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .exchange-item .label {
      display: block;
      font-size: 0.8rem;
      color: #666;
    }

    .exchange-item .amount {
      display: block;
      font-weight: 600;
      color: #333;
    }

    .arrow {
      color: #22c55e;
    }

    .partner-info, .validity-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }

    .partner-info mat-icon, .validity-info mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    .terms {
      padding: 0.5rem;
      background: #fff3cd;
      border-radius: 4px;
      margin-top: 1rem;
      color: #856404;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      gap: 1rem;
    }

    .success {
      text-align: center;
      padding: 1rem;
    }

    .success-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #22c55e;
    }

    .success .code {
      font-family: 'Roboto Mono', monospace;
      font-size: 1.25rem;
      font-weight: 600;
      background: #f8f9fa;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      letter-spacing: 2px;
    }

    .success .expiry {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      color: #666;
      font-size: 0.9rem;
    }

    .error {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      color: #ef4444;
    }

    .error mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }
  `]
})
export class VoucherRedeemComponent {
  private tokenService = inject(TokenService);
  private dialogRef = inject(MatDialogRef<VoucherRedeemComponent>);
  template = inject<VoucherTemplate>(MAT_DIALOG_DATA);

  loading = false;
  redeemed = false;
  error: string | null = null;
  createdVoucher: Voucher | null = null;

  redeem(): void {
    this.loading = true;
    this.error = null;

    this.tokenService.redeemVoucher(this.template.id).subscribe({
      next: (voucher) => {
        this.loading = false;
        this.redeemed = true;
        this.createdVoucher = voucher;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de la création du voucher';
        console.error('Failed to redeem voucher', err);
      }
    });
  }
}
