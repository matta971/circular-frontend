import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { PartnerAnalyticsService } from '../../services/partner-analytics.service';
import { DataScope } from '../../models/partner-analytics.model';

@Component({
  selector: 'app-partner-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule,
    DecimalPipe,
    PercentPipe,
    DatePipe
  ],
  template: `
    <div class="partner-detail">
      <div class="back-link">
        <a mat-button routerLink="/admin/partner-analytics">
          <mat-icon>arrow_back</mat-icon>
          Retour a la liste
        </a>
      </div>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner diameter="48"></mat-spinner>
          <span>Chargement des donnees...</span>
        </div>
      } @else if (partnerData) {
        <!-- En-tete partenaire -->
        <header class="partner-header">
          <div class="partner-info">
            <div class="partner-icon" [class]="'type-' + partnerData.partner.type.toLowerCase()">
              <mat-icon>business</mat-icon>
            </div>
            <div class="partner-details">
              <h1>{{ partnerData.partner.name }}</h1>
              <div class="meta">
                <mat-chip>{{ getPartnerTypeLabel(partnerData.partner.type) }}</mat-chip>
                <span class="status-badge" [class.active]="partnerData.partner.active">
                  {{ partnerData.partner.active ? 'Actif' : 'Inactif' }}
                </span>
              </div>
            </div>
          </div>

          @if (partnerData.subscription) {
            <mat-card class="subscription-card">
              <mat-card-content>
                <div class="subscription-info">
                  <span class="plan-name">{{ partnerData.subscription.plan }}</span>
                  <span class="status">{{ partnerData.subscription.status }}</span>
                </div>
                <div class="subscription-meta">
                  <span>Depuis le {{ partnerData.subscription.startDate | date:'dd/MM/yyyy' }}</span>
                  <span>{{ partnerData.subscription.requestLimit | number }} requetes/mois</span>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </header>

        <!-- Scopes accessibles -->
        @if (partnerData.subscription) {
          <mat-card class="scopes-card">
            <mat-card-header>
              <mat-card-title>Scopes de donnees accessibles</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="scopes-grid">
                @for (scope of partnerData.subscription.scopes; track scope) {
                  <mat-chip class="scope-chip">
                    <mat-icon>check_circle</mat-icon>
                    {{ getScopeLabel(scope) }}
                  </mat-chip>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Analytics complet -->
        @if (fullAnalytics) {
          <mat-tab-group class="analytics-tabs" animationDuration="200ms">
            <!-- REP Compliance -->
            <mat-tab label="Conformite REP">
              <ng-template matTabContent>
                <div class="tab-content">
                  @if (fullAnalytics.repCompliance) {
                    <div class="rep-summary">
                      <mat-card [class.compliant]="fullAnalytics.repCompliance.repTargets?.compliance">
                        <mat-card-content>
                          <mat-icon>{{ fullAnalytics.repCompliance.repTargets?.compliance ? 'verified' : 'warning' }}</mat-icon>
                          <span>{{ fullAnalytics.repCompliance.repTargets?.compliance ? 'Conforme aux objectifs REP' : 'Non conforme' }}</span>
                        </mat-card-content>
                      </mat-card>
                    </div>

                    <div class="rates-grid">
                      <div class="rate-item">
                        <span class="label">Taux de reemploi</span>
                        <span class="value">{{ fullAnalytics.repCompliance.outcomeRates?.reuseRate | percent }}</span>
                        <span class="target">Objectif: {{ fullAnalytics.repCompliance.repTargets?.targetReuseRate | percent }}</span>
                      </div>
                      <div class="rate-item">
                        <span class="label">Taux de reconditionnement</span>
                        <span class="value">{{ fullAnalytics.repCompliance.outcomeRates?.refurbishmentRate | percent }}</span>
                      </div>
                      <div class="rate-item">
                        <span class="label">Taux de recyclage</span>
                        <span class="value">{{ fullAnalytics.repCompliance.outcomeRates?.recyclingRate | percent }}</span>
                        <span class="target">Objectif: {{ fullAnalytics.repCompliance.repTargets?.targetRecyclingRate | percent }}</span>
                      </div>
                    </div>

                    <h3>Certificats generes</h3>
                    <mat-list>
                      <mat-list-item>
                        <span matListItemTitle>Certificats de tracabilite</span>
                        <span matListItemMeta>{{ fullAnalytics.repCompliance.certificates?.traceabilityCertificates | number }}</span>
                      </mat-list-item>
                      <mat-list-item>
                        <span matListItemTitle>Certificats de recyclage</span>
                        <span matListItemMeta>{{ fullAnalytics.repCompliance.certificates?.recyclingCertificates | number }}</span>
                      </mat-list-item>
                      <mat-list-item>
                        <span matListItemTitle>Certificats de destruction</span>
                        <span matListItemMeta>{{ fullAnalytics.repCompliance.certificates?.destructionCertificates | number }}</span>
                      </mat-list-item>
                    </mat-list>
                  }
                </div>
              </ng-template>
            </mat-tab>

            <!-- Impact CO2 -->
            <mat-tab label="Impact CO2">
              <ng-template matTabContent>
                <div class="tab-content">
                  @if (fullAnalytics.co2Impact) {
                    <mat-card class="co2-highlight">
                      <mat-card-content>
                        <div class="big-number">
                          <span class="value">{{ fullAnalytics.co2Impact.summary?.totalCo2AvoidedTons | number:'1.1-1' }}</span>
                          <span class="unit">tonnes CO2 evitees</span>
                        </div>
                      </mat-card-content>
                    </mat-card>

                    <div class="equivalences-grid">
                      <div class="equiv-item">
                        <mat-icon>park</mat-icon>
                        <span class="value">{{ fullAnalytics.co2Impact.equivalences?.treesPlantedForOneYear | number }}</span>
                        <span class="label">arbres plantes</span>
                      </div>
                      <div class="equiv-item">
                        <mat-icon>directions_car</mat-icon>
                        <span class="value">{{ fullAnalytics.co2Impact.equivalences?.carKilometersAvoided | number }}</span>
                        <span class="label">km evites</span>
                      </div>
                      <div class="equiv-item">
                        <mat-icon>flight</mat-icon>
                        <span class="value">{{ fullAnalytics.co2Impact.equivalences?.domesticFlightsAvoided | number }}</span>
                        <span class="label">vols evites</span>
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
                  @if (fullAnalytics.deviceFlows) {
                    <div class="flows-summary">
                      <div class="flow-box inflow">
                        <mat-icon>arrow_downward</mat-icon>
                        <span class="value">{{ fullAnalytics.deviceFlows.inflows?.total | number }}</span>
                        <span class="label">Entrees</span>
                      </div>
                      <div class="flow-box outflow">
                        <mat-icon>arrow_upward</mat-icon>
                        <span class="value">{{ fullAnalytics.deviceFlows.outflows?.total | number }}</span>
                        <span class="label">Sorties</span>
                      </div>
                      <div class="flow-box stock">
                        <mat-icon>inventory_2</mat-icon>
                        <span class="value">{{ fullAnalytics.deviceFlows.outflows?.inStock | number }}</span>
                        <span class="label">En stock</span>
                      </div>
                    </div>
                  }
                </div>
              </ng-template>
            </mat-tab>

            <!-- Impact Territorial -->
            <mat-tab label="Impact Territorial">
              <ng-template matTabContent>
                <div class="tab-content">
                  @if (fullAnalytics.territorialImpact) {
                    <h3>Par region</h3>
                    <mat-list>
                      @for (region of fullAnalytics.territorialImpact.byRegion; track region.code) {
                        <mat-list-item>
                          <span matListItemTitle>{{ region.region }}</span>
                          <span matListItemLine>{{ region.units | number }} appareils - {{ region.collectionPoints }} points</span>
                          <span matListItemMeta>{{ (region.co2AvoidedKg / 1000) | number:'1.1-1' }} t CO2</span>
                        </mat-list-item>
                      }
                    </mat-list>
                  }
                </div>
              </ng-template>
            </mat-tab>

            <!-- Materiaux -->
            <mat-tab label="Materiaux">
              <ng-template matTabContent>
                <div class="tab-content">
                  @if (fullAnalytics.materialRecovery) {
                    <div class="materials-summary">
                      <div class="summary-item">
                        <span class="value">{{ fullAnalytics.materialRecovery.summary?.totalWeightKg | number:'1.1-1' }}</span>
                        <span class="label">kg recuperes</span>
                      </div>
                      <div class="summary-item">
                        <span class="value">{{ fullAnalytics.materialRecovery.summary?.totalValueEur | number:'1.0-0' }}</span>
                        <span class="label">EUR de valeur</span>
                      </div>
                    </div>

                    <h3>Detail par materiau</h3>
                    <mat-list>
                      @for (material of fullAnalytics.materialRecovery.byMaterial; track material.symbol) {
                        <mat-list-item>
                          <span matListItemTitle>{{ material.material }} ({{ material.symbol }})</span>
                          <span matListItemLine>{{ material.weightKg | number:'1.2-2' }} kg a {{ material.pricePerKg | number:'1.0-0' }} EUR/kg</span>
                          <span matListItemMeta>{{ material.valueEur | number:'1.0-0' }} EUR</span>
                        </mat-list-item>
                      }
                    </mat-list>
                  }
                </div>
              </ng-template>
            </mat-tab>
          </mat-tab-group>
        }
      }
    </div>
  `,
  styles: [`
    .partner-detail {
      max-width: 1200px;
      margin: 0 auto;
    }

    .back-link {
      margin-bottom: 1rem;

      a {
        color: #607d8b;
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

    .partner-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .partner-info {
      display: flex;
      align-items: center;
      gap: 1rem;

      .partner-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #4caf50;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: white;
        }
      }

      h1 {
        margin: 0;
        font-size: 1.75rem;
      }

      .meta {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }

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

    .subscription-card {
      min-width: 300px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: white;

      .subscription-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        .plan-name {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .status {
          background: rgba(255,255,255,0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }
      }

      .subscription-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
        opacity: 0.9;
      }
    }

    .scopes-card {
      margin-bottom: 2rem;

      .scopes-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .scope-chip {
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          margin-right: 0.25rem;
          color: #4caf50;
        }
      }
    }

    .analytics-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .tab-content {
      padding: 1.5rem;
    }

    .rep-summary {
      margin-bottom: 1.5rem;

      mat-card {
        display: inline-flex;
        background: #ffebee;
        color: #c62828;

        &.compliant {
          background: #e8f5e9;
          color: #2e7d32;
        }

        mat-card-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem !important;
        }
      }
    }

    .rates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;

      .rate-item {
        background: #f5f5f5;
        padding: 1.25rem;
        border-radius: 8px;
        display: flex;
        flex-direction: column;

        .label {
          font-size: 0.875rem;
          color: #607d8b;
        }

        .value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #263238;
        }

        .target {
          font-size: 0.75rem;
          color: #90a4ae;
        }
      }
    }

    .co2-highlight {
      background: linear-gradient(135deg, #4caf50, #2e7d32);
      color: white;
      margin-bottom: 1.5rem;
      text-align: center;

      .big-number {
        display: flex;
        flex-direction: column;
        align-items: center;

        .value {
          font-size: 3rem;
          font-weight: 700;
        }

        .unit {
          font-size: 1.25rem;
          opacity: 0.9;
        }
      }
    }

    .equivalences-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;

      .equiv-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
        background: #f5f5f5;
        border-radius: 8px;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #4caf50;
          margin-bottom: 0.5rem;
        }

        .value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .label {
          font-size: 0.875rem;
          color: #607d8b;
        }
      }
    }

    .flows-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;

      .flow-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        border-radius: 8px;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          margin-bottom: 0.5rem;
        }

        .value {
          font-size: 2rem;
          font-weight: 700;
        }

        .label {
          font-size: 0.875rem;
        }

        &.inflow {
          background: #e3f2fd;
          color: #1565c0;
        }

        &.outflow {
          background: #fff3e0;
          color: #ef6c00;
        }

        &.stock {
          background: #e8f5e9;
          color: #2e7d32;
        }
      }
    }

    .materials-summary {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-bottom: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #ff9800, #f57c00);
      border-radius: 8px;
      color: white;

      .summary-item {
        display: flex;
        flex-direction: column;
        align-items: center;

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

    h3 {
      margin: 1.5rem 0 1rem;
      font-size: 1rem;
      color: #455a64;
    }
  `]
})
export class PartnerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly analyticsService = inject(PartnerAnalyticsService);

  loading = true;
  partnerId!: number;
  partnerData: any = null;
  fullAnalytics: any = null;

  ngOnInit() {
    this.partnerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPartnerData();
  }

  loadPartnerData() {
    this.loading = true;

    // Charger les details du partenaire
    this.analyticsService.getPartnerDetail(this.partnerId).subscribe({
      next: (data) => {
        this.partnerData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading partner:', err);
        this.loading = false;
      }
    });

    // Charger les analytics complets
    this.analyticsService.getPartnerFullAnalytics(this.partnerId).subscribe({
      next: (data) => {
        this.fullAnalytics = data;
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

  getScopeLabel(scope: DataScope | string): string {
    const labels: Record<string, string> = {
      'REP_COMPLIANCE': 'Conformite REP',
      'TRACEABILITY': 'Tracabilite',
      'DEVICE_FLOWS': 'Flux appareils',
      'CO2_IMPACT': 'Impact CO2',
      'TERRITORIAL_IMPACT': 'Impact territorial',
      'MATERIAL_RECOVERY': 'Recuperation materiaux',
      'REUSE_RATES': 'Taux de reemploi',
      'COLLECTION_VOLUMES': 'Volumes collectes',
      'MARKET_PRICES': 'Prix du marche',
      'MARKET_TRENDS': 'Tendances marche',
      'REPAIRABILITY': 'Reparabilite',
      'METAL_PRICES': 'Prix metaux',
      'DEVICE_CONDITIONS': 'Etats appareils',
      'REPAIR_COSTS': 'Couts reparation',
      'WARRANTY_DATA': 'Donnees garantie',
      'CONSUMER_BEHAVIOR': 'Comportement consommateur',
      'PRODUCT_LIFECYCLE': 'Cycle de vie produit',
      'RECYCLING_RATES': 'Taux recyclage'
    };
    return labels[scope] || scope;
  }
}
