import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { PartnerAnalyticsService } from '../../../partner-analytics/services/partner-analytics.service';
import { PartnerApiPlan, DataScope } from '../../../partner-analytics/models/partner-analytics.model';

@Component({
  selector: 'app-subscription-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    DecimalPipe,
    DatePipe,
    CurrencyPipe
  ],
  template: `
    <div class="subscription-management">
      <header class="page-header">
        <h1>Gestion des Abonnements API</h1>
        <p>Gerez les plans et abonnements des partenaires</p>
      </header>

      <mat-tab-group class="content-tabs" animationDuration="200ms">
        <!-- Plans disponibles -->
        <mat-tab label="Plans API">
          <ng-template matTabContent>
            <div class="tab-content">
              @if (loadingPlans) {
                <div class="loading-container">
                  <mat-spinner diameter="40"></mat-spinner>
                </div>
              } @else {
                <div class="plans-grid">
                  @for (plan of plans; track plan.id) {
                    <mat-card class="plan-card" [class.featured]="plan.code === 'BUSINESS'">
                      @if (plan.code === 'BUSINESS') {
                        <div class="featured-badge">Populaire</div>
                      }
                      <mat-card-header>
                        <mat-card-title>{{ plan.name }}</mat-card-title>
                        <mat-card-subtitle>{{ plan.code }}</mat-card-subtitle>
                      </mat-card-header>
                      <mat-card-content>
                        <div class="price">
                          @if (plan.monthlyPriceEur) {
                            <span class="amount">{{ plan.monthlyPriceEur }}</span>
                            <span class="period">EUR/mois</span>
                          } @else {
                            <span class="custom">Sur devis</span>
                          }
                        </div>

                        <p class="description">{{ plan.description }}</p>

                        <div class="limits">
                          <div class="limit-item">
                            <mat-icon>speed</mat-icon>
                            <span>{{ plan.monthlyRequestLimit === -1 ? 'Illimite' : (plan.monthlyRequestLimit | number) + ' req/mois' }}</span>
                          </div>
                          <div class="limit-item">
                            <mat-icon>timer</mat-icon>
                            <span>{{ plan.requestsPerMinute }} req/min</span>
                          </div>
                          <div class="limit-item">
                            <mat-icon>history</mat-icon>
                            <span>{{ plan.dataRetentionDays }} jours historique</span>
                          </div>
                        </div>

                        <div class="features">
                          <div class="feature" [class.enabled]="plan.dashboardAccess">
                            <mat-icon>{{ plan.dashboardAccess ? 'check_circle' : 'cancel' }}</mat-icon>
                            <span>Dashboard</span>
                          </div>
                          <div class="feature" [class.enabled]="plan.exportEnabled">
                            <mat-icon>{{ plan.exportEnabled ? 'check_circle' : 'cancel' }}</mat-icon>
                            <span>Export CSV</span>
                          </div>
                          <div class="feature" [class.enabled]="plan.webhooksEnabled">
                            <mat-icon>{{ plan.webhooksEnabled ? 'check_circle' : 'cancel' }}</mat-icon>
                            <span>Webhooks</span>
                          </div>
                          <div class="feature" [class.enabled]="plan.dedicatedSupport">
                            <mat-icon>{{ plan.dedicatedSupport ? 'check_circle' : 'cancel' }}</mat-icon>
                            <span>Support dedie</span>
                          </div>
                        </div>

                        <div class="scopes">
                          <h4>Scopes inclus ({{ plan.includedScopes?.length || 0 }})</h4>
                          <div class="scope-chips">
                            @for (scope of plan.includedScopes?.slice(0, 5); track scope) {
                              <mat-chip>{{ getScopeLabel(scope) }}</mat-chip>
                            }
                            @if ((plan.includedScopes?.length ?? 0) > 5) {
                              <mat-chip class="more">+{{ (plan.includedScopes?.length ?? 0) - 5 }}</mat-chip>
                            }
                          </div>
                        </div>
                      </mat-card-content>
                      <mat-card-actions>
                        <button mat-button color="primary">
                          <mat-icon>edit</mat-icon>
                          Modifier
                        </button>
                      </mat-card-actions>
                    </mat-card>
                  }
                </div>

                <div class="add-plan">
                  <button mat-raised-button color="primary">
                    <mat-icon>add</mat-icon>
                    Creer un nouveau plan
                  </button>
                </div>
              }
            </div>
          </ng-template>
        </mat-tab>

        <!-- Statistiques abonnements -->
        <mat-tab label="Statistiques">
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="stats-grid">
                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-icon revenue">
                      <mat-icon>euro</mat-icon>
                    </div>
                    <div class="stat-details">
                      <span class="stat-value">4 990</span>
                      <span class="stat-label">MRR (EUR/mois)</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-icon subs">
                      <mat-icon>subscriptions</mat-icon>
                    </div>
                    <div class="stat-details">
                      <span class="stat-value">12</span>
                      <span class="stat-label">Abonnements actifs</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-icon usage">
                      <mat-icon>trending_up</mat-icon>
                    </div>
                    <div class="stat-details">
                      <span class="stat-value">156K</span>
                      <span class="stat-label">Requetes ce mois</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-icon churn">
                      <mat-icon>trending_down</mat-icon>
                    </div>
                    <div class="stat-details">
                      <span class="stat-value">2.1%</span>
                      <span class="stat-label">Taux de churn</span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>

              <mat-card class="distribution-card">
                <mat-card-header>
                  <mat-card-title>Repartition par plan</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="distribution">
                    <div class="dist-item">
                      <div class="dist-bar starter" style="width: 25%"></div>
                      <span class="dist-label">Starter</span>
                      <span class="dist-value">3</span>
                    </div>
                    <div class="dist-item">
                      <div class="dist-bar business" style="width: 58%"></div>
                      <span class="dist-label">Business</span>
                      <span class="dist-value">7</span>
                    </div>
                    <div class="dist-item">
                      <div class="dist-bar enterprise" style="width: 17%"></div>
                      <span class="dist-label">Enterprise</span>
                      <span class="dist-value">2</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .subscription-management {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;

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

    .content-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .tab-content {
      padding: 1.5rem;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .plan-card {
      position: relative;
      border: 2px solid transparent;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      &.featured {
        border-color: #4caf50;

        .featured-badge {
          position: absolute;
          top: -12px;
          right: 16px;
          background: #4caf50;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }
      }

      .price {
        text-align: center;
        padding: 1.5rem 0;
        border-bottom: 1px solid #e0e0e0;
        margin-bottom: 1rem;

        .amount {
          font-size: 2.5rem;
          font-weight: 700;
          color: #263238;
        }

        .period {
          font-size: 1rem;
          color: #607d8b;
          margin-left: 0.25rem;
        }

        .custom {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1976d2;
        }
      }

      .description {
        color: #607d8b;
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }

      .limits {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;

        .limit-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #455a64;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: #90a4ae;
          }
        }
      }

      .features {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
        margin-bottom: 1rem;

        .feature {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #bdbdbd;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }

          &.enabled {
            color: #4caf50;
          }
        }
      }

      .scopes {
        h4 {
          margin: 0 0 0.5rem;
          font-size: 0.875rem;
          color: #455a64;
        }

        .scope-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;

          mat-chip {
            font-size: 0.7rem;
          }

          .more {
            background: #e0e0e0;
          }
        }
      }
    }

    .add-plan {
      margin-top: 2rem;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      mat-card-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.25rem !important;
      }

      .stat-icon {
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

        &.revenue { background: linear-gradient(135deg, #4caf50, #388e3c); }
        &.subs { background: linear-gradient(135deg, #2196f3, #1976d2); }
        &.usage { background: linear-gradient(135deg, #ff9800, #f57c00); }
        &.churn { background: linear-gradient(135deg, #f44336, #d32f2f); }
      }

      .stat-details {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #263238;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #607d8b;
        }
      }
    }

    .distribution-card {
      .distribution {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .dist-item {
        display: grid;
        grid-template-columns: 1fr 100px 50px;
        align-items: center;
        gap: 1rem;

        .dist-bar {
          height: 24px;
          border-radius: 4px;

          &.starter { background: linear-gradient(90deg, #90a4ae, #78909c); }
          &.business { background: linear-gradient(90deg, #4caf50, #66bb6a); }
          &.enterprise { background: linear-gradient(90deg, #1976d2, #42a5f5); }
        }

        .dist-label {
          font-size: 0.875rem;
          color: #455a64;
        }

        .dist-value {
          font-weight: 600;
          color: #263238;
        }
      }
    }
  `]
})
export class SubscriptionListComponent implements OnInit {
  private readonly analyticsService = inject(PartnerAnalyticsService);

  loadingPlans = true;
  plans: PartnerApiPlan[] = [];

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loadingPlans = true;
    this.analyticsService.getPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.loadingPlans = false;
      },
      error: (err) => {
        console.error('Error loading plans:', err);
        this.loadingPlans = false;
      }
    });
  }

  getScopeLabel(scope: DataScope | string): string {
    const labels: Record<string, string> = {
      'REP_COMPLIANCE': 'REP',
      'TRACEABILITY': 'Traca.',
      'DEVICE_FLOWS': 'Flux',
      'CO2_IMPACT': 'CO2',
      'TERRITORIAL_IMPACT': 'Territ.',
      'MATERIAL_RECOVERY': 'Mater.',
      'REUSE_RATES': 'Reempl.',
      'COLLECTION_VOLUMES': 'Collect.',
      'MARKET_PRICES': 'Prix',
      'MARKET_TRENDS': 'Trends',
      'REPAIRABILITY': 'Repar.',
      'METAL_PRICES': 'Metaux'
    };
    return labels[scope] || scope;
  }
}
