import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface DepositInfo {
  code: string;
  status: 'active' | 'used' | 'expired';
  devices: { category: string; brand: string; model: string }[];
  point: { name: string; address: string; city: string };
  createdAt: Date;
  validUntil: Date;
  usedAt?: Date;
}

@Component({
  selector: 'app-deposit-code',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="deposit-code-container">
      @if (loading()) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (deposit()) {
        <mat-card class="code-card" [class]="deposit()!.status">
          <div class="status-badge">
            @switch (deposit()!.status) {
              @case ('active') {
                <mat-icon>check_circle</mat-icon>
                <span>Actif</span>
              }
              @case ('used') {
                <mat-icon>verified</mat-icon>
                <span>Utilisé</span>
              }
              @case ('expired') {
                <mat-icon>cancel</mat-icon>
                <span>Expiré</span>
              }
            }
          </div>

          <div class="qr-section">
            <div class="qr-placeholder">
              <mat-icon>qr_code_2</mat-icon>
            </div>
            <p class="code">{{ deposit()!.code }}</p>
          </div>

          @if (deposit()!.status === 'active') {
            <p class="validity">Valide jusqu'au {{ deposit()!.validUntil | date:'fullDate' }}</p>
          } @else if (deposit()!.status === 'used') {
            <p class="used-date">Utilisé le {{ deposit()!.usedAt | date:'fullDate' }}</p>
          }
        </mat-card>

        <mat-card class="info-card">
          <h2>Détails du dépôt</h2>

          <div class="section">
            <h3><mat-icon>place</mat-icon> Point de dépôt</h3>
            <p>{{ deposit()!.point.name }}</p>
            <p class="secondary">{{ deposit()!.point.address }}, {{ deposit()!.point.city }}</p>
          </div>

          <div class="section">
            <h3><mat-icon>devices</mat-icon> Appareils ({{ deposit()!.devices.length }})</h3>
            @for (device of deposit()!.devices; track $index) {
              <div class="device-item">
                <mat-icon>{{ getCategoryIcon(device.category) }}</mat-icon>
                <span>{{ device.brand }} {{ device.model }}</span>
              </div>
            }
          </div>
        </mat-card>

        <div class="actions">
          @if (deposit()!.status === 'active') {
            <button mat-raised-button color="primary" (click)="downloadQR()">
              <mat-icon>download</mat-icon>
              Télécharger le QR
            </button>
            <button mat-stroked-button (click)="shareQR()">
              <mat-icon>share</mat-icon>
              Partager
            </button>
          }
          <button mat-button routerLink="/deposit">
            <mat-icon>arrow_back</mat-icon>
            Retour aux points de dépôt
          </button>
        </div>
      } @else {
        <mat-card class="error-card">
          <mat-icon>error</mat-icon>
          <h2>Code non trouvé</h2>
          <p>Ce code de dépôt n'existe pas ou a été supprimé</p>
          <button mat-raised-button color="primary" routerLink="/deposit">
            Retour aux points de dépôt
          </button>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .deposit-code-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .code-card {
      text-align: center;
      padding: 2rem;
      margin-bottom: 1.5rem;

      &.active .status-badge {
        background: #e8f5e9;
        color: #2e7d32;
      }

      &.used .status-badge {
        background: #e3f2fd;
        color: #1976d2;
      }

      &.expired .status-badge {
        background: #ffebee;
        color: #c62828;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 500;
        margin-bottom: 1.5rem;
      }

      .qr-section {
        .qr-placeholder {
          background: #f5f5f5;
          padding: 2rem;
          border-radius: 8px;
          display: inline-block;

          mat-icon {
            font-size: 150px;
            width: 150px;
            height: 150px;
            color: #333;
          }
        }

        .code {
          font-family: monospace;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0;
          letter-spacing: 2px;
        }
      }

      .validity {
        color: #2e7d32;
        margin-top: 1rem;
      }

      .used-date {
        color: #1976d2;
        margin-top: 1rem;
      }
    }

    .info-card {
      padding: 1.5rem;
      margin-bottom: 1.5rem;

      h2 {
        margin: 0 0 1.5rem;
        text-align: center;
      }

      .section {
        margin-bottom: 1.5rem;

        &:last-child {
          margin-bottom: 0;
        }

        h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 0.5rem;
          font-size: 1rem;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
            color: #1976d2;
          }
        }

        p {
          margin: 0.25rem 0;
          padding-left: 28px;
        }

        .secondary {
          color: rgba(0, 0, 0, 0.6);
        }
      }

      .device-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        padding-left: 28px;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }

    .error-card {
      text-align: center;
      padding: 3rem;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #f44336;
      }

      h2 {
        margin: 1rem 0 0.5rem;
      }

      p {
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 1.5rem;
      }
    }
  `]
})
export class DepositCodeComponent implements OnInit {
  private route = inject(ActivatedRoute);

  deposit = signal<DepositInfo | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.loadDeposit(code);
    } else {
      this.loading.set(false);
    }
  }

  loadDeposit(code: string): void {
    // Simulation de chargement
    setTimeout(() => {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 7);

      this.deposit.set({
        code: code,
        status: 'active',
        devices: [
          { category: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 12' },
          { category: 'LAPTOP', brand: 'Dell', model: 'XPS 15' }
        ],
        point: {
          name: 'Fnac Châtelet',
          address: '1 rue Pierre Lescot, 75001',
          city: 'Paris'
        },
        createdAt: new Date(),
        validUntil: validUntil
      });
      this.loading.set(false);
    }, 500);
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      SMARTPHONE: 'smartphone',
      LAPTOP: 'laptop',
      TABLET: 'tablet',
      DESKTOP: 'desktop_windows',
      TV: 'tv',
      CONSOLE: 'videogame_asset',
      PERIPHERAL: 'keyboard',
      OTHER: 'devices_other'
    };
    return icons[category] || 'devices';
  }

  downloadQR(): void {
    alert('Téléchargement du QR code...');
  }

  shareQR(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Mon QR code Circular',
        text: `Code de dépôt: ${this.deposit()?.code}`,
        url: window.location.href
      });
    }
  }
}
