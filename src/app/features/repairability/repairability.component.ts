import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeviceService } from '../../core/services/device.service';
import { EvaluationService } from '../../core/services/evaluation.service';
import { RepairabilityAssessment, RepairPartner, FaultDiagnosis } from '../../core/models';
import { Evaluation } from '../../core/models/evaluation.model';

@Component({
  selector: 'app-repairability',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  template: `
    <div class="repairability-container">
      <header class="page-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          @if (evaluation() && evaluation()!.device) {
            <h1>Indice de réparabilité de votre {{ evaluation()!.device?.brand }} {{ evaluation()!.device?.model }}</h1>
            <p class="subtitle">
              Évaluation du {{ evaluation()!.createdAt | date:'dd/MM/yyyy à HH:mm' }}
            </p>
          } @else {
            <h1>Indice de réparabilité</h1>
            <p class="subtitle">Analyse détaillée de votre appareil</p>
          }
        </div>
      </header>

      @if (loading()) {
        <div class="loading">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Chargement de l'analyse...</p>
        </div>
      } @else if (assessment()) {
        <!-- Score principal -->
        <section class="main-score">
          <div class="score-circle" [class]="'grade-' + assessment()!.repairabilityGrade.toLowerCase()">
            <span class="score-value">{{ assessment()!.repairabilityIndex | number:'1.1-1' }}</span>
            <span class="score-max">/10</span>
          </div>
          <div class="score-info">
            <span class="grade-badge" [class]="'grade-' + assessment()!.repairabilityGrade.toLowerCase()">
              Grade {{ assessment()!.repairabilityGrade }}
            </span>
            <p class="grade-description">{{ getGradeDescription(assessment()!.repairabilityGrade) }}</p>
          </div>
        </section>

        <!-- Tabs pour les différentes sections -->
        <mat-tab-group animationDuration="200ms">
          <!-- Tab Détails du score -->
          <mat-tab label="Critères">
            <div class="tab-content">
              <mat-card class="criteria-card">
                <h3>Détail des critères d'évaluation</h3>
                <p class="criteria-note">Note sur 2 points par critère selon le barème officiel</p>

                <div class="criteria-list">
                  <div class="criteria-item">
                    <div class="criteria-header">
                      <mat-icon>menu_book</mat-icon>
                      <span class="criteria-name">Documentation</span>
                      <span class="criteria-score">{{ assessment()!.details.documentationScore | number:'1.1-1' }}/2</span>
                    </div>
                    <mat-progress-bar mode="determinate" [value]="assessment()!.details.documentationScore * 50"></mat-progress-bar>
                    <p class="criteria-comment">{{ assessment()!.details.documentationComment }}</p>
                  </div>

                  <div class="criteria-item">
                    <div class="criteria-header">
                      <mat-icon>build</mat-icon>
                      <span class="criteria-name">Démontabilité</span>
                      <span class="criteria-score">{{ assessment()!.details.disassemblyScore | number:'1.1-1' }}/2</span>
                    </div>
                    <mat-progress-bar mode="determinate" [value]="assessment()!.details.disassemblyScore * 50"></mat-progress-bar>
                    <p class="criteria-comment">{{ assessment()!.details.disassemblyComment }}</p>
                  </div>

                  <div class="criteria-item">
                    <div class="criteria-header">
                      <mat-icon>inventory_2</mat-icon>
                      <span class="criteria-name">Disponibilité des pièces</span>
                      <span class="criteria-score">{{ assessment()!.details.sparePartsScore | number:'1.1-1' }}/2</span>
                    </div>
                    <mat-progress-bar mode="determinate" [value]="assessment()!.details.sparePartsScore * 50"></mat-progress-bar>
                    <p class="criteria-comment">{{ assessment()!.details.sparePartsComment }}</p>
                    <div class="criteria-detail">
                      <mat-icon>schedule</mat-icon>
                      <span>Disponibilité: {{ assessment()!.details.sparePartsAvailabilityYears }} ans</span>
                    </div>
                  </div>

                  <div class="criteria-item">
                    <div class="criteria-header">
                      <mat-icon>euro</mat-icon>
                      <span class="criteria-name">Prix des pièces</span>
                      <span class="criteria-score">{{ assessment()!.details.sparePartsPriceScore | number:'1.1-1' }}/2</span>
                    </div>
                    <mat-progress-bar mode="determinate" [value]="assessment()!.details.sparePartsPriceScore * 50"></mat-progress-bar>
                    <p class="criteria-comment">{{ assessment()!.details.sparePartsPriceComment }}</p>
                  </div>

                  <div class="criteria-item">
                    <div class="criteria-header">
                      <mat-icon>tune</mat-icon>
                      <span class="criteria-name">Critères spécifiques</span>
                      <span class="criteria-score">{{ assessment()!.details.specificCriteriaScore | number:'1.1-1' }}/2</span>
                    </div>
                    <mat-progress-bar mode="determinate" [value]="assessment()!.details.specificCriteriaScore * 50"></mat-progress-bar>
                    <p class="criteria-comment">{{ assessment()!.details.specificCriteriaComment }}</p>
                  </div>
                </div>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Tab Diagnostic des pannes -->
          <mat-tab label="Diagnostic">
            <div class="tab-content">
              @if (assessment()!.faultDiagnoses.length === 0) {
                <mat-card class="empty-card">
                  <mat-icon>check_circle</mat-icon>
                  <h3>Aucune panne détectée</h3>
                  <p>Votre appareil semble en bon état de fonctionnement</p>
                </mat-card>
              } @else {
                <mat-card class="diagnosis-card">
                  <h3><mat-icon>troubleshoot</mat-icon> Diagnostic des pannes potentielles</h3>

                  <mat-accordion>
                    @for (fault of assessment()!.faultDiagnoses; track fault.faultType) {
                      <mat-expansion-panel [class]="'severity-' + fault.severity.toLowerCase()">
                        <mat-expansion-panel-header>
                          <mat-panel-title>
                            <mat-icon>{{ getFaultIcon(fault.faultType) }}</mat-icon>
                            {{ fault.faultName }}
                          </mat-panel-title>
                          <mat-panel-description>
                            <span class="probability">{{ (fault.probability * 100) | number:'1.0-0' }}%</span>
                            <mat-chip [class]="'severity-chip-' + fault.severity.toLowerCase()">
                              {{ getSeverityLabel(fault.severity) }}
                            </mat-chip>
                          </mat-panel-description>
                        </mat-expansion-panel-header>

                        <div class="fault-details">
                          <p>{{ fault.description }}</p>

                          <div class="fault-stats">
                            <div class="stat">
                              <mat-icon>euro</mat-icon>
                              <div>
                                <span class="stat-value">{{ fault.estimatedRepairCost | currency:'EUR' }}</span>
                                <span class="stat-label">Coût estimé</span>
                              </div>
                            </div>
                            <div class="stat">
                              <mat-icon>schedule</mat-icon>
                              <div>
                                <span class="stat-value">{{ fault.estimatedRepairTimeMinutes }} min</span>
                                <span class="stat-label">Temps estimé</span>
                              </div>
                            </div>
                            <div class="stat">
                              <mat-icon>{{ fault.selfRepairable ? 'handyman' : 'engineering' }}</mat-icon>
                              <div>
                                <span class="stat-value">{{ fault.selfRepairable ? 'Oui' : 'Non' }}</span>
                                <span class="stat-label">Auto-réparation</span>
                              </div>
                            </div>
                            <div class="stat">
                              <mat-icon>psychology</mat-icon>
                              <div>
                                <span class="stat-value">{{ getDifficultyLabel(fault.repairDifficulty) }}</span>
                                <span class="stat-label">Difficulté</span>
                              </div>
                            </div>
                          </div>

                          @if (fault.selfRepairable) {
                            <div class="self-repair-tip">
                              <mat-icon>lightbulb</mat-icon>
                              <p>Cette réparation peut être effectuée vous-même avec les bons outils et tutoriels.</p>
                            </div>
                          }
                        </div>
                      </mat-expansion-panel>
                    }
                  </mat-accordion>
                </mat-card>
              }
            </div>
          </mat-tab>

          <!-- Tab Partenaires réparateurs -->
          <mat-tab label="Réparateurs">
            <div class="tab-content">
              @if (assessment()!.repairPartners.length === 0) {
                <mat-card class="empty-card">
                  <mat-icon>location_off</mat-icon>
                  <h3>Aucun réparateur trouvé</h3>
                  <p>Nous n'avons pas trouvé de réparateur proche de votre position</p>
                </mat-card>
              } @else {
                <div class="partners-list">
                  @for (partner of assessment()!.repairPartners; track partner.id) {
                    <mat-card class="partner-card">
                      <div class="partner-header">
                        <div class="partner-info">
                          <h4>{{ partner.name }}</h4>
                          <mat-chip [class]="'partner-type-' + partner.type.toLowerCase()">
                            {{ getPartnerTypeLabel(partner.type) }}
                          </mat-chip>
                        </div>
                        <div class="partner-rating">
                          <mat-icon>star</mat-icon>
                          <span>{{ partner.rating | number:'1.1-1' }}</span>
                          <small>({{ partner.reviewCount }} avis)</small>
                        </div>
                      </div>

                      <div class="partner-details">
                        <div class="detail-row">
                          <mat-icon>place</mat-icon>
                          <span>{{ partner.address }}, {{ partner.postalCode }} {{ partner.city }}</span>
                        </div>
                        <div class="detail-row">
                          <mat-icon>directions_walk</mat-icon>
                          <span>{{ partner.distanceKm | number:'1.1-1' }} km</span>
                        </div>
                        <div class="detail-row">
                          <mat-icon>euro</mat-icon>
                          <span>{{ partner.estimatedCostMin | currency:'EUR' }} - {{ partner.estimatedCostMax | currency:'EUR' }}</span>
                        </div>
                        <div class="detail-row">
                          <mat-icon>schedule</mat-icon>
                          <span>Délai estimé: {{ partner.estimatedDelayDays }} jour(s)</span>
                        </div>
                      </div>

                      @if (partner.certifications.length) {
                        <div class="certifications">
                          @for (cert of partner.certifications; track cert) {
                            <mat-chip>
                              <mat-icon>verified</mat-icon>
                              {{ cert }}
                            </mat-chip>
                          }
                        </div>
                      }

                      @if (partner.warrantyProvided) {
                        <div class="warranty-badge">
                          <mat-icon>security</mat-icon>
                          <span>Garantie fournie</span>
                        </div>
                      }

                      <div class="partner-actions">
                        @if (partner.phoneNumber) {
                          <a mat-stroked-button [href]="'tel:' + partner.phoneNumber">
                            <mat-icon>phone</mat-icon>
                            Appeler
                          </a>
                        }
                        @if (partner.website) {
                          <a mat-stroked-button [href]="partner.website" target="_blank">
                            <mat-icon>language</mat-icon>
                            Site web
                          </a>
                        }
                        <a mat-raised-button color="primary"
                           [href]="'https://www.google.com/maps/dir/?api=1&destination=' + partner.latitude + ',' + partner.longitude"
                           target="_blank">
                          <mat-icon>directions</mat-icon>
                          Itinéraire
                        </a>
                      </div>
                    </mat-card>
                  }
                </div>
              }
            </div>
          </mat-tab>

          <!-- Tab Recommandation -->
          <mat-tab label="Conseil">
            <div class="tab-content">
              <mat-card class="recommendation-card" [class]="'recommendation-' + assessment()!.recommendation.action.toLowerCase()">
                <div class="recommendation-header">
                  <mat-icon>{{ getActionIcon(assessment()!.recommendation.action) }}</mat-icon>
                  <h3>{{ getActionLabel(assessment()!.recommendation.action) }}</h3>
                </div>

                <p class="recommendation-reason">{{ assessment()!.recommendation.reason }}</p>

                <mat-divider></mat-divider>

                <div class="recommendation-stats">
                  <div class="stat-row">
                    <span class="stat-label">Coût estimé de réparation</span>
                    <span class="stat-value">{{ assessment()!.recommendation.repairCostEstimate | currency:'EUR' }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Valeur après réparation</span>
                    <span class="stat-value positive">{{ assessment()!.recommendation.valueAfterRepair | currency:'EUR' }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Valeur sans réparation</span>
                    <span class="stat-value">{{ assessment()!.recommendation.valueWithoutRepair | currency:'EUR' }}</span>
                  </div>
                  <div class="stat-row highlight">
                    <span class="stat-label">Rentabilité de la réparation</span>
                    <span class="stat-value" [class.positive]="assessment()!.recommendation.repairProfitability > 1">
                      x{{ assessment()!.recommendation.repairProfitability | number:'1.1-1' }}
                    </span>
                  </div>
                </div>

                @if (assessment()!.recommendation.environmentallyRecommended) {
                  <div class="eco-section">
                    <mat-icon>eco</mat-icon>
                    <div>
                      <strong>Impact environnemental positif</strong>
                      <p>En réparant cet appareil, vous économisez environ <strong>{{ assessment()!.recommendation.co2SavedKg }} kg de CO₂</strong>.</p>
                    </div>
                  </div>
                }
              </mat-card>

              <div class="action-buttons">
                @if (assessment()!.recommendation.action === 'REPAIR' || assessment()!.recommendation.action === 'REFURBISH') {
                  <button mat-raised-button color="primary" (click)="scrollToPartners()">
                    <mat-icon>build</mat-icon>
                    Voir les réparateurs
                  </button>
                }
                <button mat-raised-button routerLink="/collection/new">
                  <mat-icon>local_shipping</mat-icon>
                  Demander une collecte
                </button>
                <button mat-stroked-button routerLink="/evaluation">
                  <mat-icon>restart_alt</mat-icon>
                  Nouvelle évaluation
                </button>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      } @else {
        <mat-card class="no-data-card">
          <mat-icon>info</mat-icon>
          <h3>Aucune analyse disponible</h3>
          <p>Commencez par évaluer un appareil pour obtenir son indice de réparabilité.</p>
          <button mat-raised-button color="primary" routerLink="/evaluation">
            <mat-icon>search</mat-icon>
            Évaluer un appareil
          </button>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .repairability-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
      }

      .subtitle {
        margin: 0;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem;
      gap: 1rem;
      color: rgba(0, 0, 0, 0.6);
    }

    /* Main Score Section */
    .main-score {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .score-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;

      .score-value {
        font-size: 2.5rem;
        font-weight: bold;
        line-height: 1;
      }

      .score-max {
        font-size: 1rem;
        opacity: 0.8;
      }
    }

    .score-info {
      .grade-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1.25rem;
        border-radius: 20px;
        color: white;
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 0.5rem;
        white-space: nowrap;
        min-width: 90px;
      }

      .grade-description {
        margin: 0;
        color: rgba(0, 0, 0, 0.7);
      }
    }

    /* Grade colors */
    .grade-a { background: #4caf50; }
    .grade-b { background: #8bc34a; }
    .grade-c { background: #ff9800; }
    .grade-d { background: #ff5722; }
    .grade-e { background: #f44336; }

    /* Tab content */
    .tab-content {
      padding: 1.5rem 0;
    }

    /* Criteria Card */
    .criteria-card {
      padding: 1.5rem;

      h3 {
        margin: 0 0 0.5rem;
      }

      .criteria-note {
        color: rgba(0, 0, 0, 0.6);
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
      }
    }

    .criteria-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .criteria-item {
      .criteria-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;

        mat-icon {
          color: #1976d2;
        }

        .criteria-name {
          flex: 1;
          font-weight: 500;
        }

        .criteria-score {
          font-weight: 500;
          color: #4caf50;
        }
      }

      mat-progress-bar {
        height: 8px;
        border-radius: 4px;
      }

      .criteria-comment {
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
        margin: 0.5rem 0 0;
      }

      .criteria-detail {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    }

    /* Diagnosis Card */
    .diagnosis-card {
      padding: 1.5rem;

      h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 0 1.5rem;
      }
    }

    .severity-low { border-left: 4px solid #4caf50; }
    .severity-medium { border-left: 4px solid #ff9800; }
    .severity-high { border-left: 4px solid #f44336; }
    .severity-critical { border-left: 4px solid #e91e63; }

    .severity-chip-low { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .severity-chip-medium { background: #fff3e0 !important; color: #e65100 !important; }
    .severity-chip-high { background: #ffebee !important; color: #c62828 !important; }
    .severity-chip-critical { background: #fce4ec !important; color: #ad1457 !important; }

    mat-expansion-panel-header {
      .probability {
        margin-right: 1rem;
        font-weight: 500;
      }
    }

    .fault-details {
      padding-top: 1rem;

      > p {
        margin: 0 0 1rem;
        color: rgba(0, 0, 0, 0.7);
      }
    }

    .fault-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;

      .stat {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        mat-icon {
          color: #1976d2;
        }

        .stat-value {
          font-weight: 500;
          display: block;
        }

        .stat-label {
          font-size: 0.75rem;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .self-repair-tip {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      background: #e3f2fd;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;

      mat-icon {
        color: #1976d2;
      }

      p {
        margin: 0;
        font-size: 0.875rem;
      }
    }

    /* Partners List */
    .partners-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .partner-card {
      padding: 1.5rem;

      .partner-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;

        h4 {
          margin: 0 0 0.5rem;
        }
      }

      .partner-rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        mat-icon {
          color: #ffc107;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        small {
          color: rgba(0, 0, 0, 0.6);
        }
      }

      .partner-type-authorized { background: #e8f5e9 !important; color: #2e7d32 !important; }
      .partner-type-independent { background: #e3f2fd !important; color: #1565c0 !important; }
      .partner-type-self_repair { background: #fff3e0 !important; color: #e65100 !important; }
    }

    .partner-details {
      margin-bottom: 1rem;

      .detail-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .certifications {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;

      mat-chip mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        margin-right: 0.25rem;
      }
    }

    .warranty-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #e8f5e9;
      color: #2e7d32;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1rem;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .partner-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      a mat-icon {
        margin-right: 0.25rem;
      }
    }

    /* Recommendation Card */
    .recommendation-card {
      padding: 1.5rem;

      .recommendation-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;

        mat-icon {
          font-size: 36px;
          width: 36px;
          height: 36px;
        }

        h3 {
          margin: 0;
        }
      }

      .recommendation-reason {
        font-size: 1.1rem;
        color: rgba(0, 0, 0, 0.7);
        margin-bottom: 1.5rem;
      }

      &.recommendation-repair {
        .recommendation-header mat-icon { color: #4caf50; }
      }

      &.recommendation-sell_as_is {
        .recommendation-header mat-icon { color: #ff9800; }
      }

      &.recommendation-recycle {
        .recommendation-header mat-icon { color: #2196f3; }
      }

      &.recommendation-refurbish {
        .recommendation-header mat-icon { color: #9c27b0; }
      }
    }

    .recommendation-stats {
      padding: 1rem 0;

      .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        &:last-child {
          border-bottom: none;
        }

        &.highlight {
          background: #f5f5f5;
          margin: 0 -1rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
        }

        .stat-label {
          color: rgba(0, 0, 0, 0.7);
        }

        .stat-value {
          font-weight: 500;

          &.positive {
            color: #4caf50;
          }
        }
      }
    }

    .eco-section {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      background: #e8f5e9;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;

      mat-icon {
        color: #4caf50;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      strong {
        display: block;
        margin-bottom: 0.25rem;
      }

      p {
        margin: 0;
        font-size: 0.875rem;
      }
    }

    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1.5rem;

      button mat-icon {
        margin-right: 0.5rem;
      }
    }

    /* Empty/No Data Cards */
    .empty-card, .no-data-card {
      text-align: center;
      padding: 3rem;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: rgba(0, 0, 0, 0.3);
        margin-bottom: 1rem;
      }

      h3 {
        margin: 0 0 0.5rem;
      }

      p {
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 1.5rem;
      }
    }
  `]
})
export class RepairabilityComponent implements OnInit {
  private deviceService = inject(DeviceService);
  private evaluationService = inject(EvaluationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  loading = signal(false);
  assessment = signal<RepairabilityAssessment | null>(null);
  evaluation = signal<any | null>(null);
  evaluationId = signal<number | null>(null);

  ngOnInit(): void {
    // Check if we have an evaluation ID in the URL
    const idParam = this.route.snapshot.paramMap.get('evaluationId');

    if (idParam) {
      const id = parseInt(idParam, 10);
      this.evaluationId.set(id);
      this.loadEvaluationData(id);
    } else {
      // Fallback: try session storage for backward compatibility
      const storedEvalId = sessionStorage.getItem('currentEvaluationId');

      if (storedEvalId) {
        const evalId = parseInt(storedEvalId, 10);
        this.evaluationId.set(evalId);
        // Always fetch fresh data from API instead of using cached data
        this.loadEvaluationData(evalId);
      } else {
        // Load default assessment for demo
        this.loadDefaultAssessment();
      }
    }
  }

  private loadEvaluationData(evaluationId: number): void {
    this.loading.set(true);

    // Load evaluation details from API
    this.evaluationService.getEvaluation(evaluationId).subscribe({
      next: (evalData) => {
        this.evaluation.set(evalData);
        // Always fetch fresh repairability data from API
        this.loadRepairabilityForEvaluation(evalData);
      },
      error: () => {
        // Fallback: load default assessment
        this.loadDefaultAssessment();
      }
    });
  }

  private loadRepairabilityForEvaluation(evalData: any): void {
    // Use device info from evaluation to get repairability assessment
    const request = {
      type: evalData.device?.type || 'SMARTPHONE',
      brand: evalData.device?.brand || '',
      model: evalData.device?.model || '',
      condition: evalData.device?.condition
    };

    this.deviceService.getRepairabilityAssessment(request).subscribe({
      next: (assessment) => {
        this.assessment.set(assessment);
        this.loading.set(false);
      },
      error: () => {
        this.loadDefaultAssessment();
      }
    });
  }

  private loadDefaultAssessment(): void {
    this.loading.set(true);
    // Fetch real data from API for default iPhone 14
    this.deviceService.getRepairabilityAssessment({
      type: 'SMARTPHONE',
      brand: 'Apple',
      model: 'iPhone 14'
    }).subscribe({
      next: (assessment) => {
        this.assessment.set(assessment);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getGradeDescription(grade: string): string {
    const descriptions: Record<string, string> = {
      'A': 'Excellent - Très facile à réparer, pièces abondantes',
      'B': 'Bon - Réparation accessible avec quelques outils',
      'C': 'Moyen - Réparation possible mais nécessite expertise',
      'D': 'Difficile - Réparation complexe, pièces rares',
      'E': 'Très difficile - Réparation quasi impossible'
    };
    return descriptions[grade] || '';
  }

  getFaultIcon(faultType: string): string {
    const icons: Record<string, string> = {
      'BATTERY': 'battery_alert',
      'SCREEN': 'smartphone',
      'CHARGING': 'power',
      'SPEAKER': 'volume_off',
      'CAMERA': 'camera_alt',
      'BUTTON': 'touch_app',
      'SOFTWARE': 'bug_report',
      'MOTHERBOARD': 'memory'
    };
    return icons[faultType] || 'error';
  }

  getSeverityLabel(severity: string): string {
    const labels: Record<string, string> = {
      'LOW': 'Mineur',
      'MEDIUM': 'Modéré',
      'HIGH': 'Important',
      'CRITICAL': 'Critique'
    };
    return labels[severity] || severity;
  }

  getDifficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      'EASY': 'Facile',
      'MEDIUM': 'Moyen',
      'HARD': 'Difficile',
      'EXPERT': 'Expert'
    };
    return labels[difficulty] || difficulty;
  }

  getPartnerTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'AUTHORIZED': 'Agréé constructeur',
      'INDEPENDENT': 'Indépendant',
      'SELF_REPAIR': 'Auto-réparation'
    };
    return labels[type] || type;
  }

  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      'REPAIR': 'build',
      'SELL_AS_IS': 'sell',
      'RECYCLE': 'recycling',
      'REFURBISH': 'auto_fix_high'
    };
    return icons[action] || 'help';
  }

  getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      'REPAIR': 'Réparation recommandée',
      'SELL_AS_IS': 'Vente en l\'état conseillée',
      'RECYCLE': 'Recyclage recommandé',
      'REFURBISH': 'Reconditionnement conseillé'
    };
    return labels[action] || action;
  }

  scrollToPartners(): void {
    // Switch to partners tab (index 2)
    const tabGroup = document.querySelector('mat-tab-group');
    if (tabGroup) {
      // This is a simplified approach - in production you'd use ViewChild
      const tabs = tabGroup.querySelectorAll('.mat-mdc-tab');
      if (tabs[2]) {
        (tabs[2] as HTMLElement).click();
      }
    }
  }
}
