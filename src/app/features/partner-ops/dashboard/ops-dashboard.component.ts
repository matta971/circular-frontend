import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PartnerOpsService } from '../services/partner-ops.service';
import { PartnerOpsDashboard } from '../models/partner-ops.model';

@Component({
  selector: 'app-ops-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de bord Opérations</h1>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (dashboard()) {
        <div class="kpi-grid">
          <!-- À réceptionner -->
          <mat-card class="kpi-card urgent" routerLink="../to-receive">
            <mat-card-content>
              <div class="kpi-icon">
                <mat-icon>inbox</mat-icon>
              </div>
              <div class="kpi-value">{{ dashboard()!.collectionsToReceive + dashboard()!.dropOffsToReceive }}</div>
              <div class="kpi-label">À réceptionner</div>
              <div class="kpi-detail">
                {{ dashboard()!.collectionsToReceive }} collectes, {{ dashboard()!.dropOffsToReceive }} dépôts
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Appareils à finaliser -->
          <mat-card class="kpi-card warning" routerLink="../finalization">
            <mat-card-content>
              <div class="kpi-icon">
                <mat-icon>pending_actions</mat-icon>
              </div>
              <div class="kpi-value">{{ dashboard()!.devicesToFinalize }}</div>
              <div class="kpi-label">À finaliser</div>
              <div class="kpi-detail">Appareils en attente de décision</div>
            </mat-card-content>
          </mat-card>

          <!-- Litiges ouverts -->
          <mat-card class="kpi-card" [class.alert]="dashboard()!.openDisputes > 0">
            <mat-card-content>
              <div class="kpi-icon">
                <mat-icon>report_problem</mat-icon>
              </div>
              <div class="kpi-value">{{ dashboard()!.openDisputes }}</div>
              <div class="kpi-label">Litiges ouverts</div>
              <div class="kpi-detail">Contestations à traiter</div>
            </mat-card-content>
          </mat-card>

          <!-- Aujourd'hui -->
          <mat-card class="kpi-card success">
            <mat-card-content>
              <div class="kpi-icon">
                <mat-icon>today</mat-icon>
              </div>
              <div class="kpi-value">{{ dashboard()!.devicesReceivedToday }}</div>
              <div class="kpi-label">Reçus aujourd'hui</div>
              <div class="kpi-detail">{{ dashboard()!.devicesFinalizedToday }} finalisés</div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Stats 30 jours -->
        <h2>Statistiques des 30 derniers jours</h2>
        <div class="stats-grid">
          <mat-card>
            <mat-card-content>
              <div class="stat-row">
                <mat-icon>local_shipping</mat-icon>
                <span class="stat-label">Collectes reçues</span>
                <span class="stat-value">{{ dashboard()!.totalCollectionsLast30Days }}</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card>
            <mat-card-content>
              <div class="stat-row">
                <mat-icon>store</mat-icon>
                <span class="stat-label">Dépôts reçus</span>
                <span class="stat-value">{{ dashboard()!.totalDropOffsLast30Days }}</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card>
            <mat-card-content>
              <div class="stat-row">
                <mat-icon>devices</mat-icon>
                <span class="stat-label">Appareils traités</span>
                <span class="stat-value">{{ dashboard()!.totalDevicesLast30Days }}</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card>
            <mat-card-content>
              <div class="stat-row">
                <mat-icon>verified</mat-icon>
                <span class="stat-label">Certificats émis</span>
                <span class="stat-value">{{ dashboard()!.totalCertificatesLast30Days }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Quick actions -->
        <h2>Actions rapides</h2>
        <div class="actions-grid">
          <button mat-raised-button color="primary" routerLink="../to-receive">
            <mat-icon>inbox</mat-icon>
            Réceptionner des appareils
          </button>
          <button mat-raised-button color="accent" routerLink="../finalization">
            <mat-icon>check_circle</mat-icon>
            Finaliser des appareils
          </button>
          <button mat-raised-button routerLink="../devices">
            <mat-icon>search</mat-icon>
            Rechercher un appareil
          </button>
        </div>
      } @else {
        <mat-card class="error-card">
          <mat-card-content>
            <mat-icon>error</mat-icon>
            <p>Impossible de charger le tableau de bord.</p>
            <button mat-button color="primary" (click)="loadDashboard()">Réessayer</button>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;

      h1 {
        margin-bottom: 1.5rem;
        color: #1565c0;
      }

      h2 {
        margin: 2rem 0 1rem;
        color: #37474f;
        font-size: 1.25rem;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .kpi-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      mat-card-content {
        text-align: center;
        padding: 1.5rem;
      }

      .kpi-icon {
        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: #1565c0;
        }
      }

      .kpi-value {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0.5rem 0;
        color: #1565c0;
      }

      .kpi-label {
        font-size: 1.1rem;
        font-weight: 500;
        color: #37474f;
      }

      .kpi-detail {
        font-size: 0.875rem;
        color: #78909c;
        margin-top: 0.25rem;
      }

      &.urgent {
        border-left: 4px solid #ff9800;

        .kpi-icon mat-icon, .kpi-value {
          color: #ff9800;
        }
      }

      &.warning {
        border-left: 4px solid #ffc107;

        .kpi-icon mat-icon, .kpi-value {
          color: #ffc107;
        }
      }

      &.alert {
        border-left: 4px solid #f44336;

        .kpi-icon mat-icon, .kpi-value {
          color: #f44336;
        }
      }

      &.success {
        border-left: 4px solid #4caf50;

        .kpi-icon mat-icon, .kpi-value {
          color: #4caf50;
        }
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;

      mat-card {
        .stat-row {
          display: flex;
          align-items: center;
          gap: 1rem;

          mat-icon {
            color: #1565c0;
          }

          .stat-label {
            flex: 1;
            color: #546e7a;
          }

          .stat-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1565c0;
          }
        }
      }
    }

    .actions-grid {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      button {
        mat-icon {
          margin-right: 0.5rem;
        }
      }
    }

    .error-card {
      text-align: center;
      padding: 2rem;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #f44336;
      }

      p {
        margin: 1rem 0;
        color: #546e7a;
      }
    }
  `]
})
export class OpsDashboardComponent implements OnInit {
  dashboard = signal<PartnerOpsDashboard | null>(null);
  loading = signal(true);

  constructor(private opsService: PartnerOpsService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.opsService.getDashboard().subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboard.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
