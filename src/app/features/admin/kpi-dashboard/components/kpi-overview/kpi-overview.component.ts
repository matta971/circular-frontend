import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import {
  KpiAdminService,
  DashboardSummary,
  VolumeMetrics,
  RevenueMetrics,
  QualityMetrics,
  DateRange
} from '../../services/kpi-admin.service';

@Component({
  selector: 'app-kpi-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDividerModule,
    KpiCardComponent
  ],
  template: `
    <div class="kpi-overview-container">
      <div class="page-header">
        <div>
          <h1>KPIs & Analytics</h1>
          <p class="subtitle">Métriques de performance business</p>
        </div>
        <mat-button-toggle-group [(ngModel)]="selectedPeriod" (change)="onPeriodChange()">
          <mat-button-toggle value="7">7 jours</mat-button-toggle>
          <mat-button-toggle value="30">30 jours</mat-button-toggle>
          <mat-button-toggle value="90">90 jours</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else {
        <mat-tab-group>
          <!-- Vue d'ensemble -->
          <mat-tab label="Vue d'ensemble">
            <div class="tab-content">
              <!-- Volume -->
              <h2 class="section-title">
                <mat-icon>bar_chart</mat-icon>
                Volume & Activité
              </h2>
              <div class="kpi-grid">
                <app-kpi-card
                  label="Évaluations"
                  [value]="summary()?.volume?.totalEvaluations || 0"
                  [trend]="summary()?.volume?.evaluationsTrend"
                  icon="assessment"
                  iconBg="#2196F3">
                </app-kpi-card>
                <app-kpi-card
                  label="Appareils actifs"
                  [value]="summary()?.volume?.activeDevices || 0"
                  [trend]="summary()?.volume?.devicesTrend"
                  icon="devices"
                  iconBg="#4CAF50">
                </app-kpi-card>
                <app-kpi-card
                  label="Utilisateurs actifs"
                  [value]="summary()?.volume?.activeUsers || 0"
                  [trend]="summary()?.volume?.usersTrend"
                  icon="people"
                  iconBg="#FF9800">
                </app-kpi-card>
                <app-kpi-card
                  label="Collectes"
                  [value]="summary()?.volume?.collections || 0"
                  [trend]="summary()?.volume?.collectionsTrend"
                  icon="local_shipping"
                  iconBg="#9C27B0">
                </app-kpi-card>
              </div>

              <!-- Revenue -->
              <h2 class="section-title">
                <mat-icon>euro</mat-icon>
                Revenus & Valeur
              </h2>
              <div class="kpi-grid">
                <app-kpi-card
                  label="CA Marketplace"
                  [value]="summary()?.revenue?.marketplaceRevenue || 0"
                  [trend]="summary()?.revenue?.revenueTrend"
                  format="currency"
                  suffix="€"
                  icon="store"
                  iconBg="#4CAF50">
                </app-kpi-card>
                <app-kpi-card
                  label="Valeur rachat"
                  [value]="summary()?.revenue?.buybackValue || 0"
                  [trend]="summary()?.revenue?.buybackTrend"
                  format="currency"
                  suffix="€"
                  icon="shopping_cart"
                  iconBg="#2196F3">
                </app-kpi-card>
                <app-kpi-card
                  label="Commissions"
                  [value]="summary()?.revenue?.commissions || 0"
                  [trend]="summary()?.revenue?.commissionsTrend"
                  format="currency"
                  suffix="€"
                  icon="account_balance"
                  iconBg="#FF9800">
                </app-kpi-card>
                <app-kpi-card
                  label="Wallet moyen"
                  [value]="summary()?.revenue?.avgWalletBalance || 0"
                  [trend]="summary()?.revenue?.walletTrend"
                  format="currency"
                  suffix="€"
                  icon="account_balance_wallet"
                  iconBg="#9C27B0">
                </app-kpi-card>
              </div>

              <!-- Quality -->
              <h2 class="section-title">
                <mat-icon>verified</mat-icon>
                Qualité & Performance
              </h2>
              <div class="kpi-grid">
                <app-kpi-card
                  label="Temps traitement"
                  [value]="summary()?.quality?.avgProcessingTimeHours || 0"
                  [trend]="summary()?.quality?.processingTrend"
                  format="duration"
                  suffix="h"
                  icon="schedule"
                  iconBg="#607D8B">
                </app-kpi-card>
                <app-kpi-card
                  label="Taux conversion"
                  [value]="summary()?.quality?.conversionRate || 0"
                  [trend]="summary()?.quality?.conversionTrend"
                  format="percent"
                  suffix="%"
                  icon="trending_up"
                  iconBg="#4CAF50">
                </app-kpi-card>
                <app-kpi-card
                  label="Taux litiges"
                  [value]="summary()?.quality?.disputeRate || 0"
                  [trend]="summary()?.quality?.disputeTrend"
                  format="percent"
                  suffix="%"
                  icon="report_problem"
                  iconBg="#f44336">
                </app-kpi-card>
                <app-kpi-card
                  label="Satisfaction"
                  [value]="summary()?.quality?.satisfactionScore || 0"
                  [trend]="summary()?.quality?.satisfactionTrend"
                  suffix="/5"
                  icon="star"
                  iconBg="#FFC107">
                </app-kpi-card>
              </div>
            </div>
          </mat-tab>

          <!-- Volume détaillé -->
          <mat-tab label="Volume">
            <div class="tab-content">
              <div class="kpi-grid-compact">
                <app-kpi-card [compact]="true"
                  label="Évaluations"
                  [value]="volumeMetrics()?.summary?.totalEvaluations || 0"
                  [trend]="volumeMetrics()?.summary?.evaluationsTrend"
                  icon="assessment"
                  iconBg="#2196F3">
                </app-kpi-card>
                <app-kpi-card [compact]="true"
                  label="Appareils"
                  [value]="volumeMetrics()?.summary?.activeDevices || 0"
                  [trend]="volumeMetrics()?.summary?.devicesTrend"
                  icon="devices"
                  iconBg="#4CAF50">
                </app-kpi-card>
                <app-kpi-card [compact]="true"
                  label="Utilisateurs"
                  [value]="volumeMetrics()?.summary?.activeUsers || 0"
                  [trend]="volumeMetrics()?.summary?.usersTrend"
                  icon="people"
                  iconBg="#FF9800">
                </app-kpi-card>
              </div>

              <div class="charts-row">
                <mat-card class="chart-card">
                  <mat-card-header>
                    <mat-card-title>Par type d'appareil</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="breakdown-list">
                      @for (entry of getObjectEntries(volumeMetrics()?.byDeviceType || {}); track entry[0]) {
                        <div class="breakdown-item">
                          <span class="breakdown-label">{{ entry[0] }}</span>
                          <div class="breakdown-bar-container">
                            <div class="breakdown-bar"
                                 [style.width.%]="getPercentage(entry[1], getTotalFromObject(volumeMetrics()?.byDeviceType || {}))">
                            </div>
                          </div>
                          <span class="breakdown-value">{{ entry[1] }}</span>
                        </div>
                      }
                      @if (getObjectEntries(volumeMetrics()?.byDeviceType || {}).length === 0) {
                        <p class="no-data">Aucune donnée disponible</p>
                      }
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="chart-card">
                  <mat-card-header>
                    <mat-card-title>Par marque</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="breakdown-list">
                      @for (entry of getObjectEntries(volumeMetrics()?.byBrand || {}).slice(0, 8); track entry[0]) {
                        <div class="breakdown-item">
                          <span class="breakdown-label">{{ entry[0] }}</span>
                          <div class="breakdown-bar-container">
                            <div class="breakdown-bar brand"
                                 [style.width.%]="getPercentage(entry[1], getTotalFromObject(volumeMetrics()?.byBrand || {}))">
                            </div>
                          </div>
                          <span class="breakdown-value">{{ entry[1] }}</span>
                        </div>
                      }
                      @if (getObjectEntries(volumeMetrics()?.byBrand || {}).length === 0) {
                        <p class="no-data">Aucune donnée disponible</p>
                      }
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Revenus détaillés -->
          <mat-tab label="Revenus">
            <div class="tab-content">
              <div class="kpi-grid-compact">
                <app-kpi-card [compact]="true"
                  label="CA Marketplace"
                  [value]="revenueMetrics()?.summary?.marketplaceRevenue || 0"
                  [trend]="revenueMetrics()?.summary?.revenueTrend"
                  format="currency"
                  suffix="€"
                  icon="store"
                  iconBg="#4CAF50">
                </app-kpi-card>
                <app-kpi-card [compact]="true"
                  label="Valeur rachat"
                  [value]="revenueMetrics()?.summary?.buybackValue || 0"
                  [trend]="revenueMetrics()?.summary?.buybackTrend"
                  format="currency"
                  suffix="€"
                  icon="shopping_cart"
                  iconBg="#2196F3">
                </app-kpi-card>
                <app-kpi-card [compact]="true"
                  label="Commissions"
                  [value]="revenueMetrics()?.summary?.commissions || 0"
                  [trend]="revenueMetrics()?.summary?.commissionsTrend"
                  format="currency"
                  suffix="€"
                  icon="account_balance"
                  iconBg="#FF9800">
                </app-kpi-card>
              </div>

              <mat-card class="chart-card full-width">
                <mat-card-header>
                  <mat-card-title>Top appareils vendus</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="top-devices-list">
                    @for (device of revenueMetrics()?.topSellingDevices || []; track device.name; let i = $index) {
                      <div class="top-device-item">
                        <span class="rank">{{ i + 1 }}</span>
                        <span class="device-name">{{ device.name }}</span>
                        <span class="device-count">{{ device.count }} ventes</span>
                        <span class="device-revenue">{{ device.revenue | number:'1.0-0' }} €</span>
                      </div>
                    }
                    @if ((revenueMetrics()?.topSellingDevices || []).length === 0) {
                      <p class="no-data">Aucune donnée disponible</p>
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Qualité détaillée -->
          <mat-tab label="Qualité">
            <div class="tab-content">
              <div class="kpi-grid-compact">
                <app-kpi-card [compact]="true"
                  label="Temps traitement"
                  [value]="qualityMetrics()?.summary?.avgProcessingTimeHours || 0"
                  [trend]="qualityMetrics()?.summary?.processingTrend"
                  format="duration"
                  suffix="h"
                  icon="schedule"
                  iconBg="#607D8B">
                </app-kpi-card>
                <app-kpi-card [compact]="true"
                  label="Taux conversion"
                  [value]="qualityMetrics()?.summary?.conversionRate || 0"
                  [trend]="qualityMetrics()?.summary?.conversionTrend"
                  format="percent"
                  suffix="%"
                  icon="trending_up"
                  iconBg="#4CAF50">
                </app-kpi-card>
                <app-kpi-card [compact]="true"
                  label="Satisfaction"
                  [value]="qualityMetrics()?.summary?.satisfactionScore || 0"
                  [trend]="qualityMetrics()?.summary?.satisfactionTrend"
                  suffix="/5"
                  icon="star"
                  iconBg="#FFC107">
                </app-kpi-card>
              </div>

              <div class="charts-row">
                <mat-card class="chart-card">
                  <mat-card-header>
                    <mat-card-title>Entonnoir de conversion</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="funnel">
                      @if (qualityMetrics()?.conversionFunnel; as funnel) {
                        <div class="funnel-step">
                          <div class="funnel-bar" style="width: 100%"></div>
                          <div class="funnel-info">
                            <span class="funnel-label">Évaluations</span>
                            <span class="funnel-value">{{ funnel.evaluations }}</span>
                          </div>
                        </div>
                        <div class="funnel-step">
                          <div class="funnel-bar" [style.width.%]="funnel.evaluations ? (funnel.offers / funnel.evaluations * 100) : 0"></div>
                          <div class="funnel-info">
                            <span class="funnel-label">Offres générées</span>
                            <span class="funnel-value">{{ funnel.offers }}</span>
                          </div>
                        </div>
                        <div class="funnel-step">
                          <div class="funnel-bar" [style.width.%]="funnel.evaluations ? (funnel.acceptedOffers / funnel.evaluations * 100) : 0"></div>
                          <div class="funnel-info">
                            <span class="funnel-label">Offres acceptées</span>
                            <span class="funnel-value">{{ funnel.acceptedOffers }}</span>
                          </div>
                        </div>
                        <div class="funnel-step">
                          <div class="funnel-bar completed" [style.width.%]="funnel.evaluations ? (funnel.completedTransactions / funnel.evaluations * 100) : 0"></div>
                          <div class="funnel-info">
                            <span class="funnel-label">Transactions</span>
                            <span class="funnel-value">{{ funnel.completedTransactions }}</span>
                          </div>
                        </div>
                      }
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="chart-card">
                  <mat-card-header>
                    <mat-card-title>Litiges</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    @if (qualityMetrics()?.disputeStats; as disputes) {
                      <div class="dispute-summary">
                        <div class="dispute-stat">
                          <span class="stat-value">{{ disputes.total }}</span>
                          <span class="stat-label">Total</span>
                        </div>
                        <div class="dispute-stat resolved">
                          <span class="stat-value">{{ disputes.resolved }}</span>
                          <span class="stat-label">Résolus</span>
                        </div>
                        <div class="dispute-stat pending">
                          <span class="stat-value">{{ disputes.pending }}</span>
                          <span class="stat-label">En cours</span>
                        </div>
                      </div>

                      <mat-divider></mat-divider>

                      <h4>Par raison</h4>
                      <div class="breakdown-list">
                        @for (entry of getObjectEntries(disputes.byReason || {}); track entry[0]) {
                          <div class="breakdown-item">
                            <span class="breakdown-label">{{ entry[0] }}</span>
                            <span class="breakdown-value">{{ entry[1] }}</span>
                          </div>
                        }
                        @if (getObjectEntries(disputes.byReason || {}).length === 0) {
                          <p class="no-data">Aucun litige</p>
                        }
                      </div>
                    }
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      }
    </div>
  `,
  styles: [`
    .kpi-overview-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;

      h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 500;
      }

      .subtitle {
        margin: 0.25rem 0 0;
        color: #666;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .tab-content {
      padding: 1.5rem 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
      margin: 2rem 0 1rem;

      mat-icon {
        color: #666;
      }

      &:first-child {
        margin-top: 0;
      }
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }

    .kpi-grid-compact {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .charts-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .chart-card {
      &.full-width {
        grid-column: 1 / -1;
      }
    }

    .breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .breakdown-item {
      display: flex;
      align-items: center;
      gap: 1rem;

      .breakdown-label {
        width: 100px;
        font-size: 0.9rem;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .breakdown-bar-container {
        flex: 1;
        height: 8px;
        background: #eee;
        border-radius: 4px;
        overflow: hidden;
      }

      .breakdown-bar {
        height: 100%;
        background: #2196F3;
        border-radius: 4px;
        transition: width 0.3s ease;

        &.brand {
          background: #4CAF50;
        }
      }

      .breakdown-value {
        width: 50px;
        text-align: right;
        font-weight: 500;
      }
    }

    .top-devices-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .top-device-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      background: #f5f5f5;
      border-radius: 8px;
      gap: 1rem;

      .rank {
        width: 24px;
        height: 24px;
        background: #1976d2;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .device-name {
        flex: 1;
        font-weight: 500;
      }

      .device-count {
        color: #666;
        font-size: 0.9rem;
      }

      .device-revenue {
        font-weight: 600;
        color: #4CAF50;
      }
    }

    .funnel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .funnel-step {
      position: relative;

      .funnel-bar {
        height: 32px;
        background: linear-gradient(90deg, #2196F3, #64B5F6);
        border-radius: 4px;
        transition: width 0.5s ease;

        &.completed {
          background: linear-gradient(90deg, #4CAF50, #81C784);
        }
      }

      .funnel-info {
        display: flex;
        justify-content: space-between;
        margin-top: 0.25rem;

        .funnel-label {
          font-size: 0.85rem;
          color: #666;
        }

        .funnel-value {
          font-weight: 600;
        }
      }
    }

    .dispute-summary {
      display: flex;
      justify-content: space-around;
      padding: 1rem 0;

      .dispute-stat {
        text-align: center;

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
        }

        &.resolved .stat-value {
          color: #4CAF50;
        }

        &.pending .stat-value {
          color: #FF9800;
        }
      }
    }

    h4 {
      margin: 1rem 0 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 2rem;
    }
  `]
})
export class KpiOverviewComponent implements OnInit {
  private kpiService = inject(KpiAdminService);

  loading = signal(true);
  selectedPeriod = '30';

  summary = signal<DashboardSummary | null>(null);
  volumeMetrics = signal<VolumeMetrics | null>(null);
  revenueMetrics = signal<RevenueMetrics | null>(null);
  qualityMetrics = signal<QualityMetrics | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  onPeriodChange(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    const range = this.getDateRange();

    this.kpiService.getDashboardSummary(range).subscribe(data => {
      this.summary.set(data);
      this.loading.set(false);
    });

    this.kpiService.getVolumeMetrics(range).subscribe(data => {
      this.volumeMetrics.set(data);
    });

    this.kpiService.getRevenueMetrics(range).subscribe(data => {
      this.revenueMetrics.set(data);
    });

    this.kpiService.getQualityMetrics(range).subscribe(data => {
      this.qualityMetrics.set(data);
    });
  }

  private getDateRange(): DateRange {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(this.selectedPeriod));

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }

  getObjectEntries(obj: Record<string, number>): [string, number][] {
    return Object.entries(obj).sort((a, b) => b[1] - a[1]);
  }

  getTotalFromObject(obj: Record<string, number>): number {
    return Object.values(obj).reduce((sum, val) => sum + val, 0);
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }
}
