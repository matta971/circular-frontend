import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TokenBalanceComponent } from './components/token-balance/token-balance.component';
import { TokenService } from '../../core/services/token.service';
import { TokenTransaction, Voucher } from '../../core/models/token.model';

@Component({
  selector: 'app-tokens',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TokenBalanceComponent
  ],
  template: `
    <div class="tokens-page">
      <header class="page-header">
        <h1>
          <mat-icon>toll</mat-icon>
          Mes Tokens Circular
        </h1>
        <p class="subtitle">
          Gagnez des tokens en évaluant vos appareils et échangez-les contre des avantages
        </p>
      </header>

      <div class="tokens-grid">
        <!-- Balance Card -->
        <app-token-balance></app-token-balance>

        <!-- Quick Actions -->
        <mat-card class="quick-actions-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>flash_on</mat-icon>
            <mat-card-title>Actions rapides</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <div class="actions-list">
              <button mat-stroked-button routerLink="/evaluation" color="primary">
                <mat-icon>phone_android</mat-icon>
                Évaluer un appareil
              </button>

              <button mat-stroked-button routerLink="/tokens/vouchers" color="accent">
                <mat-icon>redeem</mat-icon>
                Échanger des tokens
              </button>

              <button mat-stroked-button routerLink="/tokens/history">
                <mat-icon>history</mat-icon>
                Voir l'historique
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Recent Transactions -->
        <mat-card class="recent-transactions-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>receipt_long</mat-icon>
            <mat-card-title>Dernières transactions</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            @if (recentTransactions.length > 0) {
              <div class="transactions-list">
                @for (tx of recentTransactions; track tx.id) {
                  <div class="transaction-item">
                    <div class="tx-info">
                      <span class="tx-type">{{ tx.transactionTypeLabel }}</span>
                      <span class="tx-date">{{ tx.createdAt | date:'dd/MM HH:mm' }}</span>
                    </div>
                    <span class="tx-amount" [class.credit]="tx.isCredit" [class.debit]="!tx.isCredit">
                      {{ tx.isCredit ? '+' : '' }}{{ tx.amount | number:'1.0-0' }}
                    </span>
                  </div>
                }
              </div>
            } @else {
              <div class="no-transactions">
                <p>Aucune transaction récente</p>
              </div>
            }
          </mat-card-content>

          <mat-card-actions>
            <button mat-button routerLink="/tokens/history">Voir tout</button>
          </mat-card-actions>
        </mat-card>

        <!-- Active Vouchers -->
        <mat-card class="active-vouchers-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>card_giftcard</mat-icon>
            <mat-card-title>Vouchers actifs</mat-card-title>
            @if (activeVouchers.length > 0) {
              <span class="badge">{{ activeVouchers.length }}</span>
            }
          </mat-card-header>

          <mat-card-content>
            @if (activeVouchers.length > 0) {
              <div class="vouchers-list">
                @for (voucher of activeVouchers.slice(0, 3); track voucher.id) {
                  <div class="voucher-item">
                    <div class="voucher-info">
                      <span class="voucher-value">{{ voucher.valueDisplay }}</span>
                      <span class="voucher-type">{{ voucher.voucherTypeLabel }}</span>
                    </div>
                    <div class="voucher-expiry" [class.expiring]="voucher.daysUntilExpiry <= 3">
                      {{ voucher.daysUntilExpiry }}j
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="no-vouchers">
                <mat-icon>card_giftcard</mat-icon>
                <p>Aucun voucher actif</p>
              </div>
            }
          </mat-card-content>

          <mat-card-actions>
            <button mat-button routerLink="/tokens/vouchers">Gérer mes vouchers</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- How it works -->
      <mat-card class="how-it-works">
        <mat-card-header>
          <mat-icon mat-card-avatar>help_outline</mat-icon>
          <mat-card-title>Comment ça marche?</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="steps">
            <div class="step">
              <div class="step-icon">
                <mat-icon>phone_android</mat-icon>
              </div>
              <h3>1. Évaluez</h3>
              <p>Évaluez vos appareils électroniques pour connaître leur valeur</p>
            </div>

            <div class="step-arrow">
              <mat-icon>arrow_forward</mat-icon>
            </div>

            <div class="step">
              <div class="step-icon">
                <mat-icon>toll</mat-icon>
              </div>
              <h3>2. Gagnez</h3>
              <p>Recevez des tokens en fonction du score de votre appareil</p>
            </div>

            <div class="step-arrow">
              <mat-icon>arrow_forward</mat-icon>
            </div>

            <div class="step">
              <div class="step-icon">
                <mat-icon>military_tech</mat-icon>
              </div>
              <h3>3. Montez de niveau</h3>
              <p>Accumulez des tokens pour atteindre les niveaux supérieurs</p>
            </div>

            <div class="step-arrow">
              <mat-icon>arrow_forward</mat-icon>
            </div>

            <div class="step">
              <div class="step-icon">
                <mat-icon>redeem</mat-icon>
              </div>
              <h3>4. Profitez</h3>
              <p>Échangez vos tokens contre des réductions chez nos partenaires</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .tokens-page {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .page-header h1 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      color: #333;
    }

    .page-header .subtitle {
      color: #666;
      margin: 0.5rem 0 0;
    }

    .tokens-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .quick-actions-card .actions-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .quick-actions-card button {
      justify-content: flex-start;
      gap: 0.5rem;
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
    }

    .transaction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .tx-info {
      display: flex;
      flex-direction: column;
    }

    .tx-type {
      font-weight: 500;
    }

    .tx-date {
      font-size: 0.8rem;
      color: #666;
    }

    .tx-amount {
      font-family: 'Roboto Mono', monospace;
      font-weight: 600;
    }

    .tx-amount.credit {
      color: #22c55e;
    }

    .tx-amount.debit {
      color: #ef4444;
    }

    .no-transactions, .no-vouchers {
      text-align: center;
      padding: 1.5rem;
      color: #666;
    }

    .no-vouchers mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #ccc;
    }

    .badge {
      background: #22c55e;
      color: white;
      border-radius: 12px;
      padding: 0 8px;
      font-size: 0.75rem;
      margin-left: auto;
    }

    .vouchers-list {
      display: flex;
      flex-direction: column;
    }

    .voucher-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
    }

    .voucher-item:last-child {
      border-bottom: none;
    }

    .voucher-value {
      font-weight: 600;
      color: #22c55e;
    }

    .voucher-type {
      display: block;
      font-size: 0.8rem;
      color: #666;
    }

    .voucher-expiry {
      padding: 0.25rem 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #666;
    }

    .voucher-expiry.expiring {
      background: #fee2e2;
      color: #ef4444;
    }

    .how-it-works {
      margin-top: 1.5rem;
    }

    .steps {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1rem 0;
    }

    .step {
      flex: 1;
      min-width: 150px;
      text-align: center;
    }

    .step-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    .step-icon mat-icon {
      color: white;
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .step h3 {
      margin: 0 0 0.5rem;
      color: #333;
    }

    .step p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .step-arrow {
      display: flex;
      align-items: center;
      color: #22c55e;
      padding-top: 20px;
    }

    @media (max-width: 768px) {
      .steps {
        flex-direction: column;
      }

      .step-arrow {
        transform: rotate(90deg);
        padding: 0;
      }
    }
  `]
})
export class TokensComponent implements OnInit {
  private tokenService = inject(TokenService);

  recentTransactions: TokenTransaction[] = [];
  activeVouchers: Voucher[] = [];

  ngOnInit(): void {
    this.loadRecentTransactions();
    this.loadActiveVouchers();
  }

  loadRecentTransactions(): void {
    this.tokenService.getRecentTransactions().subscribe({
      next: (transactions) => this.recentTransactions = transactions.slice(0, 5),
      error: (err) => console.error('Failed to load recent transactions', err)
    });
  }

  loadActiveVouchers(): void {
    this.tokenService.getActiveVouchers().subscribe({
      next: (vouchers) => this.activeVouchers = vouchers,
      error: (err) => console.error('Failed to load active vouchers', err)
    });
  }
}
