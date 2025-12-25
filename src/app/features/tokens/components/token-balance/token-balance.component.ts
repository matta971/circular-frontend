import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenService } from '../../../../core/services/token.service';
import { TokenBalance, TokenLevel, TOKEN_LEVEL_CONFIG } from '../../../../core/models/token.model';

@Component({
  selector: 'app-token-balance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink
  ],
  template: `
    <mat-card class="token-balance-card">
      <mat-card-header>
        <mat-icon mat-card-avatar [style.color]="getLevelColor()">
          {{ getLevelIcon() }}
        </mat-icon>
        <mat-card-title>Mes Tokens Circular</mat-card-title>
        <mat-card-subtitle>Niveau {{ balance?.levelDisplayName }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        @if (balance) {
          <!-- Solde principal -->
          <div class="balance-display">
            <div class="available-balance">
              <span class="balance-value">{{ balance.availableBalance | number:'1.0-0' }}</span>
              <span class="balance-label">tokens disponibles</span>
            </div>
            @if (balance.pendingBalance > 0) {
              <div class="pending-balance">
                <mat-icon>pending</mat-icon>
                <span>{{ balance.pendingBalance | number:'1.0-0' }} en attente</span>
              </div>
            }
          </div>

          <!-- Progression vers le niveau suivant -->
          @if (balance.nextLevel) {
            <div class="level-progress">
              <div class="progress-header">
                <span>Progression vers {{ getNextLevelName() }}</span>
                <span>{{ balance.tokensToNextLevel }} tokens restants</span>
              </div>
              <mat-progress-bar
                mode="determinate"
                [value]="balance.progressToNextLevel"
                [color]="'primary'">
              </mat-progress-bar>
              <div class="progress-percentage">
                {{ balance.progressToNextLevel | number:'1.0-0' }}%
              </div>
            </div>
          } @else {
            <div class="max-level">
              <mat-icon>emoji_events</mat-icon>
              <span>Niveau maximum atteint!</span>
            </div>
          }

          <!-- Avantages du niveau -->
          <div class="level-benefits">
            <div class="benefit">
              <mat-icon>local_offer</mat-icon>
              <span>{{ (balance.discountRate * 100) | number:'1.0-0' }}% de réduction partenaires</span>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="stats-row">
            <div class="stat">
              <span class="stat-value">{{ balance.lifetimeEarned | number:'1.0-0' }}</span>
              <span class="stat-label">gagnés</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ balance.lifetimeSpent | number:'1.0-0' }}</span>
              <span class="stat-label">utilisés</span>
            </div>
          </div>
        } @else {
          <div class="loading">
            Chargement...
          </div>
        }
      </mat-card-content>

      <mat-card-actions>
        <button mat-button routerLink="/tokens/vouchers" color="primary">
          <mat-icon>redeem</mat-icon>
          Échanger des tokens
        </button>
        <button mat-button routerLink="/tokens/history">
          <mat-icon>history</mat-icon>
          Historique
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .token-balance-card {
      max-width: 400px;
    }

    .balance-display {
      text-align: center;
      padding: 1.5rem 0;
    }

    .available-balance {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .balance-value {
      font-size: 3rem;
      font-weight: 700;
      color: #22c55e;
      line-height: 1;
    }

    .balance-label {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.5rem;
    }

    .pending-balance {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      color: #f59e0b;
      font-size: 0.85rem;
    }

    .pending-balance mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .level-progress {
      margin: 1rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }

    .progress-percentage {
      text-align: right;
      font-size: 0.8rem;
      color: #666;
      margin-top: 0.25rem;
    }

    .max-level {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
      border-radius: 8px;
      color: #92400e;
      font-weight: 500;
    }

    .level-benefits {
      margin: 1rem 0;
    }

    .benefit {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: #e8f5e9;
      border-radius: 4px;
      font-size: 0.9rem;
      color: #2e7d32;
    }

    .benefit mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    .stats-row {
      display: flex;
      justify-content: space-around;
      padding: 1rem 0;
      border-top: 1px solid #eee;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class TokenBalanceComponent implements OnInit, OnDestroy {
  private tokenService = inject(TokenService);
  private balanceChangedSub?: Subscription;
  balance: TokenBalance | null = null;

  ngOnInit(): void {
    this.loadBalance();

    // Écouter les changements de solde (ex: après échange de voucher)
    this.balanceChangedSub = this.tokenService.balanceChanged$.subscribe(() => {
      this.loadBalance();
    });
  }

  ngOnDestroy(): void {
    this.balanceChangedSub?.unsubscribe();
  }

  loadBalance(): void {
    this.tokenService.getMyBalance().subscribe({
      next: (balance) => this.balance = balance,
      error: (err) => console.error('Failed to load token balance', err)
    });
  }

  getLevelColor(): string {
    if (!this.balance) return '#666';
    return TOKEN_LEVEL_CONFIG[this.balance.level]?.color || '#666';
  }

  getLevelIcon(): string {
    if (!this.balance) return 'military_tech';
    return TOKEN_LEVEL_CONFIG[this.balance.level]?.icon || 'military_tech';
  }

  getNextLevelName(): string {
    if (!this.balance?.nextLevel) return '';
    return TOKEN_LEVEL_CONFIG[this.balance.nextLevel]?.label || '';
  }
}
