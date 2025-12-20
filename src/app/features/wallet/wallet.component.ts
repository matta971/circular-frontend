import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'pending';
  amount: number;
  description: string;
  date: Date;
  deviceInfo?: string;
}

interface WalletStats {
  totalEarned: number;
  totalWithdrawn: number;
  pendingRewards: number;
  devicesRecycled: number;
}

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="wallet-container">
      <div class="wallet-header">
        <h1>Mon Wallet</h1>
        <p class="greeting">Bonjour, {{ authService.currentUser()?.firstName }}</p>
      </div>

      <!-- Solde -->
      <mat-card class="balance-card">
        <div class="balance-content">
          <span class="label">Solde disponible</span>
          <span class="amount">{{ balance() | currency:'EUR' }}</span>
          @if (pendingAmount() > 0) {
            <span class="pending">+ {{ pendingAmount() | currency:'EUR' }} en attente</span>
          }
        </div>
        <div class="balance-actions">
          <button mat-raised-button color="primary" (click)="withdraw()" [disabled]="balance() < 10">
            <mat-icon>account_balance</mat-icon>
            Retirer
          </button>
        </div>
      </mat-card>

      <!-- Statistiques -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-icon class="earned">savings</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ stats().totalEarned | currency:'EUR' }}</span>
            <span class="stat-label">Total gagné</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon class="recycled">recycling</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ stats().devicesRecycled }}</span>
            <span class="stat-label">Appareils recyclés</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon class="withdrawn">account_balance</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ stats().totalWithdrawn | currency:'EUR' }}</span>
            <span class="stat-label">Total retiré</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon class="pending-icon">hourglass_empty</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ stats().pendingRewards | currency:'EUR' }}</span>
            <span class="stat-label">En cours de traitement</span>
          </div>
        </mat-card>
      </div>

      <!-- Historique -->
      <mat-card class="history-card">
        <mat-tab-group>
          <mat-tab label="Toutes les transactions">
            @if (loading()) {
              <div class="loading">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
            } @else if (transactions().length === 0) {
              <div class="empty-state">
                <mat-icon>receipt_long</mat-icon>
                <p>Aucune transaction</p>
              </div>
            } @else {
              <mat-list>
                @for (tx of transactions(); track tx.id) {
                  <mat-list-item class="transaction-item">
                    <mat-icon matListItemIcon [class]="tx.type">
                      {{ getTransactionIcon(tx.type) }}
                    </mat-icon>
                    <div matListItemTitle>{{ tx.description }}</div>
                    <div matListItemLine>
                      @if (tx.deviceInfo) {
                        <span class="device-info">{{ tx.deviceInfo }}</span>
                      }
                      <span class="date">{{ tx.date | date:'short' }}</span>
                    </div>
                    <span matListItemMeta [class]="'amount ' + tx.type">
                      {{ tx.type === 'debit' ? '-' : '+' }}{{ tx.amount | currency:'EUR' }}
                    </span>
                  </mat-list-item>
                  <mat-divider></mat-divider>
                }
              </mat-list>
            }
          </mat-tab>

          <mat-tab label="Récompenses">
            <mat-list>
              @for (tx of getRewardTransactions(); track tx.id) {
                <mat-list-item class="transaction-item">
                  <mat-icon matListItemIcon class="credit">paid</mat-icon>
                  <div matListItemTitle>{{ tx.description }}</div>
                  <div matListItemLine>
                    <span class="device-info">{{ tx.deviceInfo }}</span>
                    <span class="date">{{ tx.date | date:'short' }}</span>
                  </div>
                  <span matListItemMeta class="amount credit">+{{ tx.amount | currency:'EUR' }}</span>
                </mat-list-item>
                <mat-divider></mat-divider>
              }
            </mat-list>
          </mat-tab>

          <mat-tab label="Retraits">
            <mat-list>
              @for (tx of getWithdrawTransactions(); track tx.id) {
                <mat-list-item class="transaction-item">
                  <mat-icon matListItemIcon class="debit">account_balance</mat-icon>
                  <div matListItemTitle>{{ tx.description }}</div>
                  <div matListItemLine>
                    <span class="date">{{ tx.date | date:'short' }}</span>
                  </div>
                  <span matListItemMeta class="amount debit">-{{ tx.amount | currency:'EUR' }}</span>
                </mat-list-item>
                <mat-divider></mat-divider>
              }
            </mat-list>
          </mat-tab>
        </mat-tab-group>
      </mat-card>

      <!-- Actions rapides -->
      <div class="quick-actions">
        <h2>Actions rapides</h2>
        <div class="actions-grid">
          <mat-card class="action-card" routerLink="/evaluation">
            <mat-icon>devices</mat-icon>
            <span>Évaluer un appareil</span>
          </mat-card>
          <mat-card class="action-card" routerLink="/collection/new">
            <mat-icon>local_shipping</mat-icon>
            <span>Nouvelle collecte</span>
          </mat-card>
          <mat-card class="action-card" routerLink="/collection">
            <mat-icon>history</mat-icon>
            <span>Mes collectes</span>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wallet-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    .wallet-header {
      margin-bottom: 2rem;

      h1 {
        margin: 0 0 0.25rem;
      }

      .greeting {
        color: rgba(0, 0, 0, 0.6);
        margin: 0;
      }
    }

    .balance-card {
      background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
      color: white;
      padding: 2rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .balance-content {
        display: flex;
        flex-direction: column;

        .label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .amount {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0.25rem 0;
        }

        .pending {
          font-size: 0.9rem;
          opacity: 0.8;
        }
      }

      button {
        background: white;
        color: #2e7d32;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;

      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;

        &.earned { color: #4caf50; }
        &.recycled { color: #2196f3; }
        &.withdrawn { color: #ff9800; }
        &.pending-icon { color: #9e9e9e; }
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .history-card {
      margin-bottom: 2rem;

      .loading, .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 3rem;
      }

      .empty-state {
        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: #ccc;
        }

        p {
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }

    .transaction-item {
      mat-icon {
        &.credit { color: #4caf50; }
        &.debit { color: #f44336; }
        &.pending { color: #ff9800; }
      }

      .device-info {
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
        margin-right: 1rem;
      }

      .date {
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.5);
      }

      .amount {
        font-weight: 600;

        &.credit { color: #4caf50; }
        &.debit { color: #f44336; }
        &.pending { color: #ff9800; }
      }
    }

    .quick-actions {
      h2 {
        margin-bottom: 1rem;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .action-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #1976d2;
          margin-bottom: 0.5rem;
        }

        span {
          text-align: center;
          font-weight: 500;
        }
      }
    }
  `]
})
export class WalletComponent implements OnInit {
  authService = inject(AuthService);

  balance = signal(127.50);
  pendingAmount = signal(45.00);
  loading = signal(false);

  stats = signal<WalletStats>({
    totalEarned: 342.50,
    totalWithdrawn: 170.00,
    pendingRewards: 45.00,
    devicesRecycled: 12
  });

  transactions = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    // Données simulées
    this.transactions.set([
      {
        id: '1',
        type: 'credit',
        amount: 85.00,
        description: 'Récompense recyclage',
        deviceInfo: 'iPhone 12 Pro',
        date: new Date(2024, 11, 5)
      },
      {
        id: '2',
        type: 'debit',
        amount: 50.00,
        description: 'Retrait bancaire',
        date: new Date(2024, 11, 1)
      },
      {
        id: '3',
        type: 'pending',
        amount: 45.00,
        description: 'En cours de validation',
        deviceInfo: 'MacBook Pro 2019',
        date: new Date(2024, 10, 28)
      },
      {
        id: '4',
        type: 'credit',
        amount: 42.50,
        description: 'Récompense recyclage',
        deviceInfo: 'Samsung Galaxy S21',
        date: new Date(2024, 10, 20)
      },
      {
        id: '5',
        type: 'debit',
        amount: 120.00,
        description: 'Retrait bancaire',
        date: new Date(2024, 10, 15)
      },
      {
        id: '6',
        type: 'credit',
        amount: 35.00,
        description: 'Récompense recyclage',
        deviceInfo: 'iPad Air 4',
        date: new Date(2024, 10, 10)
      }
    ]);
  }

  getTransactionIcon(type: string): string {
    const icons: Record<string, string> = {
      credit: 'add_circle',
      debit: 'remove_circle',
      pending: 'hourglass_empty'
    };
    return icons[type] || 'receipt';
  }

  getRewardTransactions(): Transaction[] {
    return this.transactions().filter(tx => tx.type === 'credit');
  }

  getWithdrawTransactions(): Transaction[] {
    return this.transactions().filter(tx => tx.type === 'debit');
  }

  withdraw(): void {
    alert('Fonctionnalité de retrait - À implémenter');
  }
}
