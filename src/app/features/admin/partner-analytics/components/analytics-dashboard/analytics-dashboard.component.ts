import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

import { PartnerAnalyticsService } from '../../services/partner-analytics.service';
import {
  GlobalDashboard,
  PartnerSummary,
  Co2Impact,
  DeviceFlows,
  MaterialRecovery
} from '../../models/partner-analytics.model';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    DecimalPipe,
    PercentPipe
  ],
  template: `
    <div class="analytics-dashboard">
      <header class="page-header">
        <div class="header-content">
          <h1>Analytics Partenaires</h1>
          <p>Vue d'ensemble des metriques et donnees de tous les partenaires</p>
        </div>

        <div class="date-filters">
          <mat-form-field appearance="outline">
            <mat-label>Date debut</mat-label>
            <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate" (dateChange)="loadData()">
            <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date fin</mat-label>
            <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDate" (dateChange)="loadData()">
            <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>
      </header>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner diameter="48"></mat-spinner>
          <span>Chargement des donnees...</span>
        </div>
      } @else if (dashboard) {
        <!-- KPIs principaux -->
        <div class="kpi-grid">
          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="kpi-icon partners">
                <mat-icon>business</mat-icon>
              </div>
              <div class="kpi-details">
                <span class="kpi-value">{{ dashboard.partners.active }}</span>
                <span class="kpi-label">Partenaires actifs</span>
                <span class="kpi-secondary">sur {{ dashboard.partners.total }} total</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="kpi-icon revenue">
                <mat-icon>euro</mat-icon>
              </div>
              <div class="kpi-details">
                <span class="kpi-value">{{ dashboard.subscriptionRevenue.monthlyRecurringRevenue | number:'1.0-0' }}</span>
                <span class="kpi-label">MRR (euros/mois)</span>
                <span class="kpi-secondary">{{ dashboard.subscriptionRevenue.activeSubscriptions }} abonnements</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="kpi-icon devices">
                <mat-icon>devices</mat-icon>
              </div>
              <div class="kpi-details">
                <span class="kpi-value">{{ dashboard.aggregatedMetrics.overview?.devicesProcessed | number }}</span>
                <span class="kpi-label">Appareils traites</span>
                <span class="kpi-secondary positive" *ngIf="dashboard.aggregatedMetrics.overview?.changeFromPrevious">
                  +{{ dashboard.aggregatedMetrics.overview.changeFromPrevious | percent }}
                </span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="kpi-icon co2">
                <mat-icon>eco</mat-icon>
              </div>
              <div class="kpi-details">
                <span class="kpi-value">{{ dashboard.aggregatedMetrics.co2Impact?.co2AvoidedTons | number:'1.1-1' }}</span>
                <span class="kpi-label">Tonnes CO2 evitees</span>
                <span class="kpi-secondary">{{ dashboard.aggregatedMetrics.co2Impact?.treesEquivalent | number }} arbres equiv.</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Onglets de donnees -->
        <mat-tab-group class="data-tabs" animationDuration="200ms">
          <!-- Partenaires -->
          <mat-tab label="Partenaires">
            <ng-template matTabContent>
              <div class="tab-content">
                <div class="partners-by-type">
                  <h3>Repartition par type</h3>
                  <div class="type-chips">
                    @for (entry of partnerTypeEntries; track entry[0]) {
                      <mat-chip>
                        {{ getPartnerTypeLabel(entry[0]) }}: {{ entry[1] }}
                      </mat-chip>
                    }
                  </div>
                </div>

                <table mat-table [dataSource]="partners" class="partners-table">
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef>Nom</th>
                    <td mat-cell *matCellDef="let p">{{ p.name }}</td>
                  </ng-container>

                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef>Type</th>
                    <td mat-cell *matCellDef="let p">
                      <mat-chip [class]="'type-' + p.type.toLowerCase()">
                        {{ getPartnerTypeLabel(p.type) }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="plan">
                    <th mat-header-cell *matHeaderCellDef>Plan</th>
                    <td mat-cell *matCellDef="let p">{{ p.plan || '-' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Statut</th>
                    <td mat-cell *matCellDef="let p">
                      <span class="status-badge" [class.active]="p.active">
                        {{ p.active ? 'Actif' : 'Inactif' }}
                      </span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef></th>
                    <td mat-cell *matCellDef="let p">
                      <a mat-icon-button [routerLink]="['/admin/partner-analytics', p.id]">
                        <mat-icon>visibility</mat-icon>
                      </a>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="partnerColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: partnerColumns;"></tr>
                </table>
              </div>
            </ng-template>
          </mat-tab>

          <!-- Impact CO2 -->
          <mat-tab label="Impact CO2">
            <ng-template matTabContent>
              <div class="tab-content">
                @if (co2Impact) {
                  <div class="co2-summary">
                    <mat-card class="highlight-card">
                      <mat-card-content>
                        <div class="big-number">
                          <span class="value">{{ co2Impact.summary.totalCo2AvoidedTons | number:'1.1-1' }}</span>
                          <span class="unit">tonnes CO2</span>
                        </div>
                        <p>evitees sur la periode</p>
                      </mat-card-content>
                    </mat-card>

                    <div class="equivalences">
                      <h3>Equivalences</h3>
                      <div class="equiv-grid">
                        <div class="equiv-item">
                          <mat-icon>park</mat-icon>
                          <span class="equiv-value">{{ co2Impact.equivalences.treesPlantedForOneYear | number }}</span>
                          <span class="equiv-label">arbres plantes pour 1 an</span>
                        </div>
                        <div class="equiv-item">
                          <mat-icon>directions_car</mat-icon>
                          <span class="equiv-value">{{ co2Impact.equivalences.carKilometersAvoided | number }}</span>
                          <span class="equiv-label">km en voiture evites</span>
                        </div>
                        <div class="equiv-item">
                          <mat-icon>flight</mat-icon>
                          <span class="equiv-value">{{ co2Impact.equivalences.domesticFlightsAvoided | number }}</span>
                          <span class="equiv-label">vols domestiques evites</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="co2-by-action">
                    <h3>Par type d'action</h3>
                    <div class="action-bars">
                      @for (action of co2Impact.byAction; track action.action) {
                        <div class="action-bar">
                          <span class="action-label">{{ action.action }}</span>
                          <div class="bar-container">
                            <div class="bar" [style.width.%]="action.percentage * 100"></div>
                          </div>
                          <span class="action-value">{{ action.co2AvoidedKg | number:'1.0-0' }} kg</span>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </ng-template>
          </mat-tab>

          <!-- Flux Appareils -->
          <mat-tab label="Flux Appareils">
            <ng-template matTabContent>
              <div class="tab-content">
                @if (deviceFlows) {
                  <div class="flows-grid">
                    <mat-card>
                      <mat-card-header>
                        <mat-card-title>Entrees</mat-card-title>
                      </mat-card-header>
                      <mat-card-content>
                        <div class="flow-item">
                          <span class="label">Collectes</span>
                          <span class="value">{{ deviceFlows.inflows.collections | number }}</span>
                        </div>
                        <div class="flow-item">
                          <span class="label">Depots</span>
                          <span class="value">{{ deviceFlows.inflows.dropOffs | number }}</span>
                        </div>
                        <div class="flow-item">
                          <span class="label">Rachats</span>
                          <span class="value">{{ deviceFlows.inflows.buybacks | number }}</span>
                        </div>
                        <div class="flow-item total">
                          <span class="label">Total</span>
                          <span class="value">{{ deviceFlows.inflows.total | number }}</span>
                        </div>
                      </mat-card-content>
                    </mat-card>

                    <mat-card>
                      <mat-card-header>
                        <mat-card-title>Sorties</mat-card-title>
                      </mat-card-header>
                      <mat-card-content>
                        <div class="flow-item">
                          <span class="label">Revente directe</span>
                          <span class="value">{{ deviceFlows.outflows.directResale | number }}</span>
                        </div>
                        <div class="flow-item">
                          <span class="label">Reconditionnement</span>
                          <span class="value">{{ deviceFlows.outflows.refurbishment | number }}</span>
                        </div>
                        <div class="flow-item">
                          <span class="label">Recyclage</span>
                          <span class="value">{{ deviceFlows.outflows.materialRecycling | number }}</span>
                        </div>
                        <div class="flow-item">
                          <span class="label">En stock</span>
                          <span class="value">{{ deviceFlows.outflows.inStock | number }}</span>
                        </div>
                      </mat-card-content>
                    </mat-card>
                  </div>

                  <div class="brands-section">
                    <h3>Par marque</h3>
                    <div class="brand-bars">
                      @for (brand of deviceFlows.byBrand; track brand.brand) {
                        <div class="brand-bar">
                          <span class="brand-name">{{ brand.brand }}</span>
                          <div class="bar-container">
                            <div class="bar" [style.width.%]="brand.percentage * 100"></div>
                          </div>
                          <span class="brand-value">{{ brand.units | number }} ({{ brand.percentage | percent }})</span>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </ng-template>
          </mat-tab>

          <!-- Materiaux -->
          <mat-tab label="Materiaux">
            <ng-template matTabContent>
              <div class="tab-content">
                @if (materialRecovery) {
                  <mat-card class="highlight-card materials-summary">
                    <mat-card-content>
                      <div class="summary-grid">
                        <div class="summary-item">
                          <span class="value">{{ materialRecovery.summary.totalWeightKg | number:'1.1-1' }}</span>
                          <span class="label">kg recuperes</span>
                        </div>
                        <div class="summary-item">
                          <span class="value">{{ materialRecovery.summary.totalValueEur | number:'1.0-0' }}</span>
                          <span class="label">EUR de valeur</span>
                        </div>
                        <div class="summary-item">
                          <span class="value">{{ materialRecovery.summary.devicesProcessed | number }}</span>
                          <span class="label">appareils traites</span>
                        </div>
                      </div>
                    </mat-card-content>
                  </mat-card>

                  <table mat-table [dataSource]="materialRecovery.byMaterial" class="materials-table">
                    <ng-container matColumnDef="material">
                      <th mat-header-cell *matHeaderCellDef>Materiau</th>
                      <td mat-cell *matCellDef="let m">
                        <span class="material-name">{{ m.material }}</span>
                        <span class="material-symbol">({{ m.symbol }})</span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="weight">
                      <th mat-header-cell *matHeaderCellDef>Poids (kg)</th>
                      <td mat-cell *matCellDef="let m">{{ m.weightKg | number:'1.2-2' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="value">
                      <th mat-header-cell *matHeaderCellDef>Valeur (EUR)</th>
                      <td mat-cell *matCellDef="let m">{{ m.valueEur | number:'1.0-0' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="price">
                      <th mat-header-cell *matHeaderCellDef>Prix/kg</th>
                      <td mat-cell *matCellDef="let m">{{ m.pricePerKg | number:'1.0-0' }} EUR</td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="materialColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: materialColumns;"></tr>
                  </table>
                }
              </div>
            </ng-template>
          </mat-tab>
        </mat-tab-group>
      }
    </div>
  `,
  styles: [`
    .analytics-dashboard {
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
        color: #263238;
      }

      p {
        margin: 0.5rem 0 0;
        color: #607d8b;
      }
    }

    .date-filters {
      display: flex;
      gap: 1rem;

      mat-form-field {
        width: 160px;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      gap: 1rem;
      color: #607d8b;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .kpi-card {
      mat-card-content {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        padding: 1.25rem !important;
      }

      .kpi-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
          color: white;
        }

        &.partners { background: linear-gradient(135deg, #2196f3, #1976d2); }
        &.revenue { background: linear-gradient(135deg, #4caf50, #388e3c); }
        &.devices { background: linear-gradient(135deg, #ff9800, #f57c00); }
        &.co2 { background: linear-gradient(135deg, #00bcd4, #0097a7); }
      }

      .kpi-details {
        display: flex;
        flex-direction: column;

        .kpi-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #263238;
        }

        .kpi-label {
          font-size: 0.875rem;
          color: #607d8b;
        }

        .kpi-secondary {
          font-size: 0.75rem;
          color: #90a4ae;

          &.positive { color: #4caf50; }
          &.negative { color: #f44336; }
        }
      }
    }

    .data-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .tab-content {
      padding: 1.5rem;
    }

    .partners-by-type {
      margin-bottom: 1.5rem;

      h3 {
        margin: 0 0 1rem;
        font-size: 1rem;
        color: #455a64;
      }

      .type-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    }

    .partners-table {
      width: 100%;

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        background: #ffebee;
        color: #c62828;

        &.active {
          background: #e8f5e9;
          color: #2e7d32;
        }
      }
    }

    .highlight-card {
      background: linear-gradient(135deg, #4caf50, #2e7d32);
      color: white;
      margin-bottom: 1.5rem;

      .big-number {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;

        .value {
          font-size: 3rem;
          font-weight: 700;
        }

        .unit {
          font-size: 1.25rem;
          opacity: 0.9;
        }
      }

      p {
        margin: 0.5rem 0 0;
        opacity: 0.9;
      }
    }

    .equivalences {
      margin-top: 2rem;

      h3 {
        margin: 0 0 1rem;
        font-size: 1rem;
        color: #455a64;
      }

      .equiv-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .equiv-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
        background: #f5f5f5;
        border-radius: 8px;
        text-align: center;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #4caf50;
          margin-bottom: 0.5rem;
        }

        .equiv-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #263238;
        }

        .equiv-label {
          font-size: 0.875rem;
          color: #607d8b;
        }
      }
    }

    .action-bars, .brand-bars {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .action-bar, .brand-bar {
      display: grid;
      grid-template-columns: 150px 1fr 100px;
      align-items: center;
      gap: 1rem;

      .bar-container {
        height: 24px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;

        .bar {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #81c784);
          border-radius: 4px;
        }
      }
    }

    .flows-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;

      .flow-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e0e0e0;

        &.total {
          border-bottom: none;
          font-weight: 600;
          padding-top: 1rem;
          border-top: 2px solid #263238;
        }
      }
    }

    .brands-section {
      h3 {
        margin: 0 0 1rem;
        font-size: 1rem;
        color: #455a64;
      }
    }

    .materials-summary {
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        text-align: center;

        .summary-item {
          display: flex;
          flex-direction: column;

          .value {
            font-size: 2rem;
            font-weight: 700;
          }

          .label {
            font-size: 0.875rem;
            opacity: 0.9;
          }
        }
      }
    }

    .materials-table {
      width: 100%;

      .material-name {
        font-weight: 500;
      }

      .material-symbol {
        color: #90a4ae;
        margin-left: 0.25rem;
      }
    }
  `]
})
export class AnalyticsDashboardComponent implements OnInit {
  private readonly analyticsService = inject(PartnerAnalyticsService);

  loading = true;
  dashboard: GlobalDashboard | null = null;
  partners: PartnerSummary[] = [];
  co2Impact: Co2Impact | null = null;
  deviceFlows: DeviceFlows | null = null;
  materialRecovery: MaterialRecovery | null = null;

  startDate = new Date(new Date().setDate(new Date().getDate() - 30));
  endDate = new Date();

  partnerColumns = ['name', 'type', 'plan', 'status', 'actions'];
  materialColumns = ['material', 'weight', 'value', 'price'];

  get partnerTypeEntries(): [string, number][] {
    if (!this.dashboard?.partners.byType) return [];
    return Object.entries(this.dashboard.partners.byType);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const request = {
      startDate: this.formatDate(this.startDate),
      endDate: this.formatDate(this.endDate)
    };

    // Charger le dashboard global
    this.analyticsService.getGlobalDashboard(request).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading = false;
      }
    });

    // Charger la liste des partenaires
    this.analyticsService.getPartnersList().subscribe({
      next: (data) => {
        this.partners = data.content;
      }
    });

    // Charger les donnees CO2
    this.analyticsService.getGlobalCo2Impact(request).subscribe({
      next: (data) => {
        this.co2Impact = data;
      }
    });

    // Charger les flux d'appareils
    this.analyticsService.getGlobalDeviceFlows(request).subscribe({
      next: (data) => {
        this.deviceFlows = data;
      }
    });

    // Charger les materiaux
    this.analyticsService.getGlobalMaterialRecovery(request).subscribe({
      next: (data) => {
        this.materialRecovery = data;
      }
    });
  }

  getPartnerTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'PRODUCER': 'Producteur',
      'ECO_ORGANISM': 'Eco-organisme',
      'LOCAL_AUTHORITY': 'Collectivite',
      'REFURBISHER': 'Reconditionneur',
      'RECYCLER': 'Recycleur',
      'INSURER': 'Assureur',
      'RETAILER': 'Distributeur',
      'PUBLIC_AGENCY': 'Agence publique',
      'RESEARCH': 'Recherche'
    };
    return labels[type] || type;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
