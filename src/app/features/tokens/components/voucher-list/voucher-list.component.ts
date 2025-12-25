import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QRCodeModule } from 'angularx-qrcode';
import { Subscription } from 'rxjs';
import { TokenService } from '../../../../core/services/token.service';
import { Voucher, VoucherTemplate, VoucherStatus, TokenBalance } from '../../../../core/models/token.model';
import { VoucherRedeemComponent } from '../voucher-redeem/voucher-redeem.component';

@Component({
  selector: 'app-voucher-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    QRCodeModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-icon mat-card-avatar>redeem</mat-icon>
        <mat-card-title>Mes Vouchers</mat-card-title>
        <mat-card-subtitle>Échangez vos tokens contre des avantages</mat-card-subtitle>
        <div class="balance-badge" *ngIf="balance">
          <mat-icon>toll</mat-icon>
          <span class="balance-amount">{{ balance.availableBalance | number:'1.0-0' }}</span>
          <span class="balance-label">tokens</span>
        </div>
      </mat-card-header>

      <mat-card-content>
        <mat-tab-group>
          <!-- Onglet: Échanger des tokens -->
          <mat-tab label="Échanger">
            <div class="templates-grid">
              @for (template of templates; track template.id) {
                <mat-card class="template-card" [class.unavailable]="!template.isAvailable">
                  <mat-card-header>
                    <mat-icon mat-card-avatar color="primary">
                      {{ getVoucherIcon(template.voucherType) }}
                    </mat-icon>
                    <mat-card-title>{{ template.name }}</mat-card-title>
                    <mat-card-subtitle>{{ template.voucherTypeLabel }}</mat-card-subtitle>
                  </mat-card-header>

                  <mat-card-content>
                    <p>{{ template.description }}</p>

                    <div class="template-details">
                      <div class="value-display">
                        <span class="value">{{ template.valueDisplay }}</span>
                        <span class="label">de réduction</span>
                      </div>

                      <div class="cost-display">
                        <span class="cost">{{ template.tokensCost }}</span>
                        <span class="label">tokens</span>
                      </div>
                    </div>

                    @if (template.partnerName) {
                      <mat-chip>{{ template.partnerName }}</mat-chip>
                    }

                    <div class="validity">
                      <mat-icon>schedule</mat-icon>
                      Valable {{ template.validityDays }} jours
                    </div>

                    @if (!template.isAvailable) {
                      <div class="unavailable-reason">
                        <mat-icon>lock</mat-icon>
                        Niveau {{ template.minimumLevelDisplay }} requis
                      </div>
                    }
                  </mat-card-content>

                  <mat-card-actions>
                    <button mat-raised-button color="primary"
                            [disabled]="!template.isAvailable"
                            (click)="openRedeemDialog(template)">
                      <mat-icon>redeem</mat-icon>
                      Échanger
                    </button>
                  </mat-card-actions>
                </mat-card>
              }

              @if (templates.length === 0) {
                <div class="no-templates">
                  <mat-icon>card_giftcard</mat-icon>
                  <p>Aucun voucher disponible pour le moment</p>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Onglet: Mes vouchers actifs -->
          <mat-tab>
            <ng-template mat-tab-label>
              Actifs
              @if (activeVouchers.length > 0) {
                <span class="badge">{{ activeVouchers.length }}</span>
              }
            </ng-template>

            <div class="vouchers-list">
              @for (voucher of activeVouchers; track voucher.id) {
                <mat-card class="voucher-card">
                  <div class="voucher-content">
                    <div class="voucher-info">
                      <h3>{{ voucher.voucherTypeLabel }}</h3>
                      <p class="voucher-value">{{ voucher.valueDisplay }}</p>
                      <p class="voucher-description">{{ voucher.description }}</p>
                      @if (voucher.partnerName) {
                        <p class="partner">Chez {{ voucher.partnerName }}</p>
                      }
                      <div class="expiry" [class.expiring-soon]="voucher.daysUntilExpiry <= 3">
                        <mat-icon>schedule</mat-icon>
                        @if (voucher.daysUntilExpiry > 0) {
                          Expire dans {{ voucher.daysUntilExpiry }} jour{{ voucher.daysUntilExpiry > 1 ? 's' : '' }}
                        } @else {
                          Expire aujourd'hui!
                        }
                      </div>
                    </div>

                    <div class="voucher-code">
                      <qrcode [qrdata]="voucher.code" [width]="100" [errorCorrectionLevel]="'M'"></qrcode>
                      <span class="code">{{ voucher.code }}</span>
                    </div>
                  </div>

                  <mat-card-actions>
                    <button mat-button color="warn" (click)="cancelVoucher(voucher)">
                      <mat-icon>cancel</mat-icon>
                      Annuler (récupérer {{ voucher.tokensCost }} tokens)
                    </button>
                  </mat-card-actions>
                </mat-card>
              }

              @if (activeVouchers.length === 0) {
                <div class="no-vouchers">
                  <mat-icon>card_giftcard</mat-icon>
                  <p>Aucun voucher actif</p>
                  <p class="hint">Échangez vos tokens contre des avantages!</p>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Onglet: Historique -->
          <mat-tab label="Historique">
            <div class="vouchers-history">
              @for (voucher of allVouchers; track voucher.id) {
                <div class="history-item" [class]="'status-' + voucher.status.toLowerCase()">
                  <div class="history-info">
                    <span class="type">{{ voucher.voucherTypeLabel }}</span>
                    <span class="date">{{ voucher.createdAt | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <mat-chip>{{ voucher.statusLabel }}</mat-chip>
                </div>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1rem 0;
    }

    .template-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .template-card:hover:not(.unavailable) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .template-card.unavailable {
      opacity: 0.7;
    }

    .template-details {
      display: flex;
      justify-content: space-around;
      padding: 1rem 0;
      margin: 1rem 0;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .value-display, .cost-display {
      text-align: center;
    }

    .value-display .value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #22c55e;
    }

    .cost-display .cost {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #3b82f6;
    }

    .label {
      font-size: 0.8rem;
      color: #666;
    }

    .validity {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #666;
      margin-top: 0.5rem;
    }

    .validity mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .unavailable-reason {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f59e0b;
      margin-top: 0.5rem;
      font-size: 0.85rem;
    }

    .vouchers-list {
      padding: 1rem 0;
    }

    .voucher-card {
      margin-bottom: 1rem;
    }

    .voucher-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1rem;
    }

    .voucher-info h3 {
      margin: 0 0 0.5rem;
    }

    .voucher-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #22c55e;
      margin: 0;
    }

    .voucher-description {
      color: #666;
      margin: 0.5rem 0;
    }

    .partner {
      font-size: 0.9rem;
      color: #3b82f6;
    }

    .expiry {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: #666;
    }

    .expiry.expiring-soon {
      color: #ef4444;
      font-weight: 500;
    }

    .voucher-code {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .voucher-code .code {
      font-family: 'Roboto Mono', monospace;
      font-size: 0.8rem;
      color: #666;
      margin-top: 0.5rem;
    }

    .badge {
      background: #22c55e;
      color: white;
      border-radius: 12px;
      padding: 0 8px;
      font-size: 0.75rem;
      margin-left: 8px;
    }

    .no-templates, .no-vouchers {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      text-align: center;
      color: #666;
    }

    .no-templates mat-icon, .no-vouchers mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .hint {
      font-size: 0.9rem;
      color: #999;
    }

    .vouchers-history {
      padding: 1rem 0;
    }

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #eee;
    }

    .history-info {
      display: flex;
      gap: 1rem;
    }

    .history-item .type {
      font-weight: 500;
    }

    .history-item .date {
      color: #666;
    }

    .status-redeemed mat-chip {
      background: #dcfce7 !important;
      color: #166534 !important;
    }

    .status-expired mat-chip {
      background: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-cancelled mat-chip {
      background: #fee2e2 !important;
      color: #991b1b !important;
    }

    .balance-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      border-radius: 20px;
      color: white;

      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }

      .balance-amount {
        font-size: 1.25rem;
        font-weight: 700;
      }

      .balance-label {
        font-size: 0.875rem;
        opacity: 0.9;
      }
    }
  `]
})
export class VoucherListComponent implements OnInit, OnDestroy {
  private tokenService = inject(TokenService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private balanceChangedSub?: Subscription;

  templates: VoucherTemplate[] = [];
  activeVouchers: Voucher[] = [];
  allVouchers: Voucher[] = [];
  balance: TokenBalance | null = null;

  ngOnInit(): void {
    this.loadBalance();
    this.loadTemplates();
    this.loadActiveVouchers();
    this.loadAllVouchers();

    // Écouter les changements de solde
    this.balanceChangedSub = this.tokenService.balanceChanged$.subscribe(() => {
      this.loadBalance();
      this.loadTemplates(); // Rafraîchir les templates car disponibilité peut changer
    });
  }

  ngOnDestroy(): void {
    this.balanceChangedSub?.unsubscribe();
  }

  loadBalance(): void {
    this.tokenService.getMyBalance().subscribe({
      next: (balance) => this.balance = balance,
      error: (err) => console.error('Failed to load balance', err)
    });
  }

  loadTemplates(): void {
    this.tokenService.getVoucherTemplates().subscribe({
      next: (templates) => this.templates = templates,
      error: (err) => console.error('Failed to load templates', err)
    });
  }

  loadActiveVouchers(): void {
    this.tokenService.getActiveVouchers().subscribe({
      next: (vouchers) => this.activeVouchers = vouchers,
      error: (err) => console.error('Failed to load active vouchers', err)
    });
  }

  loadAllVouchers(): void {
    this.tokenService.getMyVouchers(0, 50).subscribe({
      next: (response) => this.allVouchers = response.content,
      error: (err) => console.error('Failed to load vouchers', err)
    });
  }

  getVoucherIcon(type: string): string {
    const icons: Record<string, string> = {
      'REPAIR_DISCOUNT': 'build',
      'DIAGNOSTIC_DISCOUNT': 'search',
      'FREE_SHIPPING': 'local_shipping',
      'MARKETPLACE_DISCOUNT': 'shopping_cart',
      'WARRANTY_EXTENSION': 'verified_user',
      'PARTNER_CREDIT': 'account_balance_wallet'
    };
    return icons[type] || 'card_giftcard';
  }

  openRedeemDialog(template: VoucherTemplate): void {
    const dialogRef = this.dialog.open(VoucherRedeemComponent, {
      width: '400px',
      data: template
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadActiveVouchers();
        this.loadAllVouchers();
        this.loadTemplates();
        this.snackBar.open('Voucher créé avec succès!', 'OK', { duration: 3000 });
      }
    });
  }

  cancelVoucher(voucher: Voucher): void {
    if (confirm(`Annuler ce voucher et récupérer ${voucher.tokensCost} tokens?`)) {
      this.tokenService.cancelVoucher(voucher.id).subscribe({
        next: () => {
          this.loadActiveVouchers();
          this.loadAllVouchers();
          this.snackBar.open(`${voucher.tokensCost} tokens remboursés`, 'OK', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de l\'annulation', 'OK', { duration: 3000 });
          console.error('Failed to cancel voucher', err);
        }
      });
    }
  }
}
