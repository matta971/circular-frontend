import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { DeviceService } from '../../core/services/device.service';
import { EvaluationService } from '../../core/services/evaluation.service';
import { AuthService } from '../../core/services/auth.service';
import { DeviceCondition, CreateDeviceDraftRequest, RepairabilityAssessment, VisionAnalysisResult, MaterialValueResponse } from '../../core/models';
import { EvaluationSource, CreateEvaluationRequest } from '../../core/models/evaluation.model';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <div class="evaluation-container">
      <h1>Évaluation de vos appareils</h1>
      <p class="subtitle">Obtenez une estimation de la valeur de vos équipements électroniques</p>

      <mat-stepper orientation="vertical" [linear]="true" #stepper>
        <!-- Étape 1: Type d'appareil -->
        <mat-step [stepControl]="typeForm">
          <ng-template matStepLabel>Type d'appareil</ng-template>
          <form [formGroup]="typeForm">
            <div class="category-grid">
              @for (type of deviceTypes; track type.value) {
                <mat-card
                  class="category-card"
                  [class.selected]="typeForm.controls.type.value === type.value"
                  (click)="selectType(type.value)">
                  <mat-icon>{{ type.icon }}</mat-icon>
                  <span>{{ type.label }}</span>
                </mat-card>
              }
            </div>
            <div class="step-actions">
              <button mat-raised-button color="primary" matStepperNext [disabled]="typeForm.invalid">
                Continuer
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Étape 2: Informations de l'appareil -->
        <mat-step [stepControl]="deviceForm">
          <ng-template matStepLabel>Informations de l'appareil</ng-template>
          <form [formGroup]="deviceForm">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Marque</mat-label>
                <input matInput formControlName="brand" placeholder="Ex: Apple, Samsung...">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Modèle</mat-label>
                <input matInput formControlName="model" placeholder="Ex: iPhone 14, Galaxy S23...">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description (optionnel)</mat-label>
              <textarea matInput formControlName="description" rows="3"
                placeholder="Détails supplémentaires sur l'appareil..."></textarea>
            </mat-form-field>

            <div class="step-actions">
              <button mat-button matStepperPrevious>Retour</button>
              <button mat-raised-button color="primary" matStepperNext [disabled]="deviceForm.invalid">
                Continuer
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Étape 3: État de l'appareil -->
        <mat-step [stepControl]="conditionForm">
          <ng-template matStepLabel>État de l'appareil</ng-template>
          <form [formGroup]="conditionForm">
            <div class="condition-grid">
              @for (cond of conditions; track cond.value) {
                <mat-card
                  class="condition-card"
                  [class.selected]="conditionForm.controls.condition.value === cond.value"
                  (click)="selectCondition(cond.value)">
                  <div class="condition-header">
                    <mat-icon [class]="cond.colorClass">{{ cond.icon }}</mat-icon>
                    <span class="condition-label">{{ cond.label }}</span>
                  </div>
                  <p class="condition-desc">{{ cond.description }}</p>
                </mat-card>
              }
            </div>
            <div class="step-actions">
              <button mat-button matStepperPrevious>Retour</button>
              <button mat-raised-button color="primary" matStepperNext [disabled]="conditionForm.invalid">
                Continuer
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Étape 4: Photos (optionnel) -->
        <mat-step [optional]="true">
          <ng-template matStepLabel>Photos (optionnel)</ng-template>
          <div class="photo-upload">
            <div class="upload-zone" (click)="fileInput.click()" [class.disabled]="analyzingPhotos()">
              <mat-icon>cloud_upload</mat-icon>
              <p>Cliquez ou glissez vos photos ici</p>
              <small>JPG, PNG (max 5MB par photo) - L'IA analysera automatiquement vos images</small>
              <input #fileInput type="file" accept="image/*" multiple hidden (change)="onFilesSelected($event)">
            </div>

            @if (selectedPhotos().length > 0) {
              <div class="photo-preview">
                @for (photo of selectedPhotos(); track photo.name; let i = $index) {
                  <div class="photo-item">
                    <img [src]="photo.preview" [alt]="photo.name">
                    <button mat-icon-button (click)="removePhoto(i)" [disabled]="analyzingPhotos()">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                }
              </div>
            }

            <!-- Vision Analysis Progress -->
            @if (analyzingPhotos()) {
              <div class="vision-analyzing">
                <mat-spinner diameter="32"></mat-spinner>
                <p>Analyse IA en cours...</p>
                <small>Identification de l'appareil et évaluation de l'état</small>
              </div>
            }

            <!-- Vision Analysis Results -->
            @if (visionResult() && !analyzingPhotos()) {
              <div class="vision-results">
                <h4><mat-icon>auto_awesome</mat-icon> Analyse IA des photos</h4>

                <!-- Identification -->
                <div class="vision-section">
                  <div class="vision-row">
                    <span class="label">Appareil détecté</span>
                    <span class="value">
                      {{ visionResult()!.identification.brand }} {{ visionResult()!.identification.model }}
                      <span class="confidence">({{ (visionResult()!.identification.brandConfidence * 100) | number:'1.0-0' }}%)</span>
                    </span>
                  </div>
                  <div class="vision-row">
                    <span class="label">Type</span>
                    <span class="value">{{ getDeviceTypeLabel(visionResult()!.identification.deviceType) }}</span>
                  </div>
                </div>

                <!-- Condition -->
                <div class="vision-section">
                  <div class="vision-row">
                    <span class="label">État détecté</span>
                    <span class="value condition-badge" [class]="'condition-' + visionResult()!.condition.overallCondition.toLowerCase()">
                      {{ getConditionLabel(visionResult()!.condition.overallCondition) }}
                    </span>
                  </div>
                  <div class="vision-row">
                    <span class="label">Grade cosmétique</span>
                    <span class="value grade-badge" [class]="'grade-' + visionResult()!.condition.cosmeticGrade.toLowerCase()">
                      {{ visionResult()!.condition.cosmeticGrade }}
                    </span>
                  </div>
                  @if (visionResult()!.condition.screenState && visionResult()!.condition.screenState !== 'NOT_VISIBLE') {
                    <div class="vision-row">
                      <span class="label">Écran</span>
                      <span class="value">{{ getScreenStateLabel(visionResult()!.condition.screenState) }}</span>
                    </div>
                  }
                  @if (visionResult()!.condition.estimatedBatteryHealthPct) {
                    <div class="vision-row">
                      <span class="label">Batterie estimée</span>
                      <span class="value">~{{ visionResult()!.condition.estimatedBatteryHealthPct }}%</span>
                    </div>
                  }
                </div>

                <!-- Damages -->
                @if (visionResult()!.damageReport.damages.length > 0) {
                  <div class="vision-section damages">
                    <strong><mat-icon>warning</mat-icon> Dommages détectés</strong>
                    @for (damage of visionResult()!.damageReport.damages; track damage.damageType) {
                      <div class="damage-item" [class]="'severity-' + damage.severity.toLowerCase()">
                        <span>{{ getDamageLabel(damage.damageType) }} - {{ damage.location }}</span>
                        <small>{{ damage.description }}</small>
                      </div>
                    }
                    @if (visionResult()!.damageReport.estimatedRepairCost > 0) {
                      <div class="repair-cost">
                        Coût de réparation estimé: {{ visionResult()!.damageReport.estimatedRepairCost | currency:'EUR' }}
                      </div>
                    }
                  </div>
                }

                <!-- Confidence -->
                <div class="vision-confidence">
                  <mat-icon>verified</mat-icon>
                  Confiance globale: {{ (visionResult()!.overallConfidence * 100) | number:'1.0-0' }}%
                  @if (visionResult()!.manualReviewRequired) {
                    <span class="review-required">- Vérification manuelle recommandée</span>
                  }
                </div>
              </div>
            }
          </div>
          <div class="step-actions">
            <button mat-button matStepperPrevious [disabled]="analyzingPhotos()">Retour</button>
            <button mat-raised-button color="primary" (click)="submitEvaluation()" [disabled]="analyzingPhotos()">
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Obtenir mon estimation
              }
            </button>
          </div>
        </mat-step>

        <!-- Étape 5: Résultat -->
        <mat-step>
          <ng-template matStepLabel>Estimation</ng-template>
          @if (estimationResult()) {
            <div class="estimation-result">
              <div class="result-grid">
                <!-- Carte Estimation -->
                <mat-card class="result-card value-card">
                  <mat-icon class="result-icon">paid</mat-icon>
                  <h2>Valeur estimée</h2>
                  <div class="price-range">
                    <span class="price">{{ estimationResult()!.minPrice | currency:'EUR' }}</span>
                    <span class="separator">-</span>
                    <span class="price">{{ estimationResult()!.maxPrice | currency:'EUR' }}</span>
                  </div>
                  <p class="confidence">Confiance: {{ estimationResult()!.confidence }}%</p>
                </mat-card>

                <!-- Carte Réparabilité -->
                @if (repairabilityResult()) {
                  <mat-card class="result-card repairability-card">
                    <div class="repairability-header">
                      <div class="index-circle" [class]="'grade-' + repairabilityResult()!.repairabilityGrade.toLowerCase()">
                        <span class="index-value">{{ repairabilityResult()!.repairabilityIndex }}</span>
                        <span class="index-max">/10</span>
                      </div>
                      <div class="repairability-info">
                        <h2>Indice de réparabilité</h2>
                        <span class="grade-badge" [class]="'grade-' + repairabilityResult()!.repairabilityGrade.toLowerCase()">
                          Grade {{ repairabilityResult()!.repairabilityGrade }}
                        </span>
                      </div>
                    </div>

                    <mat-divider></mat-divider>

                    <!-- Recommandation -->
                    <div class="recommendation">
                      <mat-icon [class]="getRecommendationClass(repairabilityResult()!.recommendation.action)">
                        {{ getRecommendationIcon(repairabilityResult()!.recommendation.action) }}
                      </mat-icon>
                      <div>
                        <strong>{{ getRecommendationLabel(repairabilityResult()!.recommendation.action) }}</strong>
                        <p>{{ repairabilityResult()!.recommendation.reason }}</p>
                      </div>
                    </div>

                    @if (repairabilityResult()!.recommendation.environmentallyRecommended) {
                      <div class="eco-badge">
                        <mat-icon>eco</mat-icon>
                        <span>{{ repairabilityResult()!.recommendation.co2SavedKg }} kg CO₂ économisés</span>
                      </div>
                    }

                    <button mat-stroked-button color="primary"
                      [routerLink]="currentEvaluationId() ? ['/repairability', currentEvaluationId()] : ['/repairability']"
                      class="details-btn">
                      <mat-icon>info</mat-icon>
                      Voir le diagnostic complet
                    </button>
                  </mat-card>
                }
              </div>

              <!-- Pannes potentielles -->
              @if (repairabilityResult()?.faultDiagnoses?.length) {
                <mat-card class="faults-card">
                  <h3><mat-icon>build</mat-icon> Diagnostic des pannes potentielles</h3>
                  <div class="faults-list">
                    @for (fault of repairabilityResult()!.faultDiagnoses.slice(0, 3); track fault.faultType) {
                      @if (fault.probability > 0.3) {
                        <div class="fault-item" [class]="'severity-' + fault.severity.toLowerCase()">
                          <div class="fault-header">
                            <span class="fault-name">{{ fault.faultName }}</span>
                            <span class="fault-probability">{{ (fault.probability * 100) | number:'1.0-0' }}%</span>
                          </div>
                          <p class="fault-desc">{{ fault.description }}</p>
                          <div class="fault-meta">
                            <span><mat-icon>euro</mat-icon> ~{{ fault.estimatedRepairCost | currency:'EUR' }}</span>
                            @if (fault.selfRepairable) {
                              <span class="self-repair"><mat-icon>handyman</mat-icon> Réparable soi-même</span>
                            }
                          </div>
                        </div>
                      }
                    }
                  </div>
                </mat-card>
              }

              <!-- Valeur matériaux récupérables -->
              @if (materialValueResult()) {
                <mat-card class="material-card">
                  <h3><mat-icon>science</mat-icon> Valeur des matériaux récupérables</h3>

                  <div class="material-summary">
                    <div class="material-value-box">
                      <span class="material-value">{{ materialValueResult()!.totalFloorValue | currency:'EUR' }}</span>
                      <span class="material-label">Valeur récupérable</span>
                    </div>
                    <div class="material-info">
                      <div class="info-row">
                        <span>Poids total</span>
                        <span>{{ materialValueResult()!.totalWeightGrams | number:'1.0-0' }}g</span>
                      </div>
                      <div class="info-row">
                        <span>Taux de récupération</span>
                        <span>{{ (materialValueResult()!.recoveryRate * 100) | number:'1.0-0' }}%</span>
                      </div>
                    </div>
                  </div>

                  <mat-divider></mat-divider>

                  <div class="material-breakdown">
                    <strong>Composition estimée:</strong>
                    <div class="materials-list">
                      @for (mat of materialValueResult()!.materialBreakdown.slice(0, 5); track mat.symbol) {
                        <div class="material-item">
                          <span class="material-symbol">{{ mat.symbol }}</span>
                          <span class="material-name">{{ mat.material }}</span>
                          <span class="material-weight">{{ mat.weightGrams | number:'1.1-1' }}g</span>
                          <span class="material-price">{{ mat.recoverableValue | currency:'EUR' }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  @if (materialValueResult()!.environmentalImpact) {
                    <mat-divider></mat-divider>
                    <div class="environmental-impact">
                      <strong><mat-icon>eco</mat-icon> Impact environnemental du recyclage</strong>
                      <div class="impact-grid">
                        <div class="impact-item">
                          <mat-icon>cloud_off</mat-icon>
                          <span class="impact-value">{{ materialValueResult()!.environmentalImpact.co2SavedKg | number:'1.1-1' }} kg</span>
                          <span class="impact-label">CO₂ économisé</span>
                        </div>
                        <div class="impact-item">
                          <mat-icon>water_drop</mat-icon>
                          <span class="impact-value">{{ materialValueResult()!.environmentalImpact.waterSavedLiters | number:'1.0-0' }} L</span>
                          <span class="impact-label">Eau économisée</span>
                        </div>
                        <div class="impact-item">
                          <mat-icon>bolt</mat-icon>
                          <span class="impact-value">{{ materialValueResult()!.environmentalImpact.energySavedKwh | number:'1.1-1' }} kWh</span>
                          <span class="impact-label">Énergie économisée</span>
                        </div>
                      </div>
                    </div>
                  }
                </mat-card>
              }

              <div class="result-actions">
                <button mat-raised-button color="primary" routerLink="/collection/new">
                  <mat-icon>local_shipping</mat-icon>
                  Demander une collecte
                </button>
                <button mat-raised-button routerLink="/deposit/new">
                  <mat-icon>place</mat-icon>
                  Trouver un point de dépôt
                </button>
                @if (repairabilityResult()?.repairPartners?.length) {
                  <button mat-raised-button color="accent"
                    [routerLink]="currentEvaluationId() ? ['/repairability', currentEvaluationId()] : ['/repairability']">
                    <mat-icon>build</mat-icon>
                    Trouver un reparateur
                  </button>
                }
              </div>
            </div>
          }
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .evaluation-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      text-align: center;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 2rem;
    }

    .category-grid, .condition-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem 1rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.selected {
        border: 2px solid #4caf50;
        background: #e8f5e9;
      }

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 0.5rem;
        color: #1976d2;
      }
    }

    .condition-card {
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: translateY(-2px);
      }

      &.selected {
        border: 2px solid #4caf50;
        background: #e8f5e9;
      }

      .condition-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .condition-label {
        font-weight: 500;
      }

      .condition-desc {
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
        margin: 0;
      }

      mat-icon {
        &.excellent { color: #4caf50; }
        &.good { color: #8bc34a; }
        &.fair { color: #ff9800; }
        &.poor { color: #f44336; }
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .step-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .photo-upload {
      .upload-zone {
        border: 2px dashed #ccc;
        border-radius: 8px;
        padding: 3rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: #1976d2;
          background: #e3f2fd;
        }

        &.disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: #1976d2;
        }

        p {
          margin: 0.5rem 0;
        }

        small {
          color: rgba(0, 0, 0, 0.5);
        }
      }

      .photo-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;

        .photo-item {
          position: relative;
          width: 100px;
          height: 100px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }

          button {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #f44336;
            color: white;

            mat-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
            }
          }
        }
      }

      .vision-analyzing {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        margin-top: 1rem;
        background: #f5f5f5;
        border-radius: 8px;

        p {
          margin: 1rem 0 0.25rem;
          font-weight: 500;
        }

        small {
          color: rgba(0, 0, 0, 0.6);
        }
      }

      .vision-results {
        margin-top: 1.5rem;
        padding: 1rem;
        background: #e8f5e9;
        border-radius: 8px;
        border-left: 4px solid #4caf50;

        h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1rem;
          color: #2e7d32;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        .vision-section {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);

          &:last-of-type {
            border-bottom: none;
          }

          &.damages {
            background: #fff3e0;
            border-radius: 8px;
            padding: 1rem;
            border-left: 3px solid #ff9800;

            strong {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              margin-bottom: 0.5rem;
              color: #e65100;

              mat-icon {
                font-size: 18px;
                width: 18px;
                height: 18px;
              }
            }
          }
        }

        .vision-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.25rem 0;

          .label {
            color: rgba(0, 0, 0, 0.6);
            font-size: 0.875rem;
          }

          .value {
            font-weight: 500;
          }

          .confidence {
            font-size: 0.75rem;
            color: rgba(0, 0, 0, 0.5);
            margin-left: 0.25rem;
          }

          .condition-badge, .grade-badge {
            padding: 0.125rem 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
            color: white;
          }

          .condition-new, .condition-excellent { background: #4caf50; }
          .condition-good { background: #8bc34a; }
          .condition-fair { background: #ff9800; }
          .condition-broken, .condition-poor { background: #f44336; }
          .condition-dead { background: #9e9e9e; }

          .grade-a { background: #4caf50; }
          .grade-b { background: #8bc34a; }
          .grade-c { background: #ff9800; }
          .grade-d { background: #ff5722; }
          .grade-e { background: #f44336; }
        }

        .damage-item {
          padding: 0.5rem;
          margin: 0.5rem 0;
          background: white;
          border-radius: 4px;

          span {
            font-weight: 500;
          }

          small {
            display: block;
            color: rgba(0, 0, 0, 0.6);
            margin-top: 0.25rem;
          }

          &.severity-minor { border-left: 3px solid #4caf50; }
          &.severity-moderate { border-left: 3px solid #ff9800; }
          &.severity-severe { border-left: 3px solid #f44336; }
        }

        .repair-cost {
          margin-top: 0.5rem;
          font-weight: 500;
          color: #e65100;
        }

        .vision-confidence {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: rgba(0, 0, 0, 0.6);
          margin-top: 0.5rem;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            color: #4caf50;
          }

          .review-required {
            color: #ff9800;
          }
        }
      }
    }

    .estimation-result {
      text-align: center;

      .result-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .result-card {
        padding: 1.5rem;
        text-align: left;
      }

      .value-card {
        text-align: center;

        .result-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          color: #4caf50;
        }
      }

      .price-range {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin: 1.5rem 0;

        .price {
          font-size: 2rem;
          font-weight: bold;
          color: #4caf50;
        }

        .separator {
          font-size: 1.5rem;
          color: rgba(0, 0, 0, 0.4);
        }
      }

      .confidence {
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 1.5rem;
      }

      /* Repairability card styles */
      .repairability-card {
        .repairability-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .index-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;

          .index-value {
            font-size: 1.5rem;
            font-weight: bold;
            line-height: 1;
          }

          .index-max {
            font-size: 0.75rem;
            opacity: 0.8;
          }
        }

        .repairability-info {
          h2 {
            margin: 0 0 0.5rem;
            font-size: 1.1rem;
          }
        }

        .grade-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
        }

        mat-divider {
          margin: 1rem 0;
        }

        .recommendation {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1rem;

          mat-icon {
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
            color: rgba(0, 0, 0, 0.6);
          }
        }

        .recommendation-repair mat-icon { color: #4caf50; }
        .recommendation-sell mat-icon { color: #ff9800; }
        .recommendation-recycle mat-icon { color: #2196f3; }
        .recommendation-refurbish mat-icon { color: #9c27b0; }

        .eco-badge {
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
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        .details-btn {
          width: 100%;
        }
      }

      /* Grade colors */
      .grade-a { background: #4caf50; }
      .grade-b { background: #8bc34a; }
      .grade-c { background: #ff9800; }
      .grade-d { background: #ff5722; }
      .grade-e { background: #f44336; }

      /* Faults card */
      .faults-card {
        margin-bottom: 1.5rem;
        padding: 1.5rem;
        text-align: left;

        h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1rem;
          font-size: 1.1rem;

          mat-icon {
            color: #ff9800;
          }
        }

        .faults-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .fault-item {
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid;

          &.severity-low {
            background: #e8f5e9;
            border-color: #4caf50;
          }

          &.severity-medium {
            background: #fff3e0;
            border-color: #ff9800;
          }

          &.severity-high {
            background: #ffebee;
            border-color: #f44336;
          }

          &.severity-critical {
            background: #fce4ec;
            border-color: #e91e63;
          }

          .fault-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            .fault-name {
              font-weight: 500;
            }

            .fault-probability {
              font-size: 0.875rem;
              color: rgba(0, 0, 0, 0.6);
              background: rgba(0, 0, 0, 0.05);
              padding: 0.125rem 0.5rem;
              border-radius: 4px;
            }
          }

          .fault-desc {
            margin: 0 0 0.5rem;
            font-size: 0.875rem;
            color: rgba(0, 0, 0, 0.6);
          }

          .fault-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.875rem;
            color: rgba(0, 0, 0, 0.7);

            span {
              display: flex;
              align-items: center;
              gap: 0.25rem;

              mat-icon {
                font-size: 16px;
                width: 16px;
                height: 16px;
              }
            }

            .self-repair {
              color: #4caf50;
            }
          }
        }
      }

      /* Material Value Card */
      .material-card {
        margin-bottom: 1.5rem;
        padding: 1.5rem;
        text-align: left;

        h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1rem;
          font-size: 1.1rem;

          mat-icon {
            color: #9c27b0;
          }
        }

        .material-summary {
          display: flex;
          gap: 2rem;
          align-items: center;
          margin-bottom: 1rem;

          .material-value-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #9c27b0, #7b1fa2);
            border-radius: 12px;
            color: white;

            .material-value {
              font-size: 1.5rem;
              font-weight: bold;
            }

            .material-label {
              font-size: 0.75rem;
              opacity: 0.9;
            }
          }

          .material-info {
            flex: 1;

            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 0.25rem 0;
              font-size: 0.875rem;

              span:first-child {
                color: rgba(0, 0, 0, 0.6);
              }

              span:last-child {
                font-weight: 500;
              }
            }
          }
        }

        .material-breakdown {
          margin: 1rem 0;

          strong {
            display: block;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            color: rgba(0, 0, 0, 0.7);
          }

          .materials-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .material-item {
            display: grid;
            grid-template-columns: 40px 1fr 60px 70px;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            background: #f5f5f5;
            border-radius: 6px;
            font-size: 0.875rem;

            .material-symbol {
              font-weight: bold;
              color: #9c27b0;
              text-align: center;
            }

            .material-name {
              color: rgba(0, 0, 0, 0.8);
            }

            .material-weight {
              text-align: right;
              color: rgba(0, 0, 0, 0.6);
            }

            .material-price {
              text-align: right;
              font-weight: 500;
              color: #4caf50;
            }
          }
        }

        .environmental-impact {
          margin-top: 1rem;

          strong {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            color: #2e7d32;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
            }
          }

          .impact-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }

          .impact-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0.75rem;
            background: #e8f5e9;
            border-radius: 8px;
            text-align: center;

            mat-icon {
              color: #4caf50;
              margin-bottom: 0.25rem;
            }

            .impact-value {
              font-weight: bold;
              font-size: 1rem;
              color: #2e7d32;
            }

            .impact-label {
              font-size: 0.75rem;
              color: rgba(0, 0, 0, 0.6);
            }
          }
        }

        mat-divider {
          margin: 1rem 0;
        }
      }

      .result-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;

        button {
          mat-icon {
            margin-right: 0.5rem;
          }
        }
      }
    }
  `]
})
export class EvaluationComponent {
  private fb = inject(FormBuilder);
  private deviceService = inject(DeviceService);
  private evaluationService = inject(EvaluationService);
  private authService = inject(AuthService);

  @ViewChild('stepper') stepper!: MatStepper;

  deviceTypes = [
    { value: 'SMARTPHONE', label: 'Smartphone', icon: 'smartphone' },
    { value: 'LAPTOP', label: 'Ordinateur portable', icon: 'laptop' },
    { value: 'TABLET', label: 'Tablette', icon: 'tablet' },
    { value: 'DESKTOP', label: 'PC Bureau', icon: 'desktop_windows' },
    { value: 'TV', label: 'Télévision', icon: 'tv' },
    { value: 'CONSOLE', label: 'Console', icon: 'videogame_asset' },
    { value: 'PERIPHERAL', label: 'Périphérique', icon: 'keyboard' },
    { value: 'OTHER', label: 'Autre', icon: 'devices_other' }
  ];

  conditions = [
    {
      value: DeviceCondition.NEW,
      label: 'Neuf',
      icon: 'verified',
      colorClass: 'excellent',
      description: 'Comme neuf, aucune trace d\'usure'
    },
    {
      value: DeviceCondition.GOOD,
      label: 'Bon',
      icon: 'thumb_up',
      colorClass: 'good',
      description: 'Légères traces d\'usure, fonctionne parfaitement'
    },
    {
      value: DeviceCondition.FAIR,
      label: 'Correct',
      icon: 'thumbs_up_down',
      colorClass: 'fair',
      description: 'Traces d\'usure visibles, fonctionnel'
    },
    {
      value: DeviceCondition.BROKEN,
      label: 'Endommagé',
      icon: 'thumb_down',
      colorClass: 'poor',
      description: 'Très usé ou dysfonctionnements'
    }
  ];

  typeForm = this.fb.group({
    type: ['', Validators.required]
  });

  deviceForm = this.fb.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    description: ['']
  });

  conditionForm = this.fb.group({
    condition: ['', Validators.required]
  });

  loading = signal(false);
  analyzingPhotos = signal(false);
  selectedPhotos = signal<{ file: File; preview: string; name: string }[]>([]);
  estimationResult = signal<{ minPrice: number; maxPrice: number; confidence: number } | null>(null);
  repairabilityResult = signal<RepairabilityAssessment | null>(null);
  visionResult = signal<VisionAnalysisResult | null>(null);
  materialValueResult = signal<MaterialValueResponse | null>(null);
  currentEvaluationId = signal<number | null>(null);

  selectType(type: string): void {
    this.typeForm.controls.type.setValue(type);
  }

  selectCondition(condition: string): void {
    this.conditionForm.controls.condition.setValue(condition);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const newPhotos = Array.from(input.files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    this.selectedPhotos.update(photos => [...photos, ...newPhotos]);

    // Trigger Vision AI analysis
    this.analyzePhotosWithVision();
  }

  removePhoto(index: number): void {
    this.selectedPhotos.update(photos => {
      const removed = photos[index];
      URL.revokeObjectURL(removed.preview);
      return photos.filter((_, i) => i !== index);
    });

    // Re-analyze if photos remain, otherwise clear results
    if (this.selectedPhotos().length > 0) {
      this.analyzePhotosWithVision();
    } else {
      this.visionResult.set(null);
    }
  }

  private analyzePhotosWithVision(): void {
    const photos = this.selectedPhotos();
    if (photos.length === 0) return;

    this.analyzingPhotos.set(true);
    this.visionResult.set(null);

    const files = photos.map(p => p.file);
    const options = {
      expectedDeviceType: this.typeForm.controls.type.value || undefined,
      expectedBrand: this.deviceForm.controls.brand.value || undefined
    };

    this.deviceService.analyzeDeviceImages(files, options).subscribe({
      next: (result) => {
        this.visionResult.set(result);
        this.analyzingPhotos.set(false);

        // Auto-fill form fields if empty and vision detected values
        if (result.identification) {
          if (!this.deviceForm.controls.brand.value && result.identification.brand) {
            this.deviceForm.controls.brand.setValue(result.identification.brand);
          }
          if (!this.deviceForm.controls.model.value && result.identification.model) {
            this.deviceForm.controls.model.setValue(result.identification.model);
          }
        }

        console.log('Vision analysis completed:', result);
      },
      error: (err) => {
        console.warn('Vision analysis failed:', err);
        this.analyzingPhotos.set(false);
      }
    });
  }

  // Label helper methods for Vision results
  getDeviceTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'SMARTPHONE': 'Smartphone',
      'LAPTOP': 'Ordinateur portable',
      'TABLET': 'Tablette',
      'DESKTOP': 'PC Bureau',
      'TV': 'Télévision',
      'CONSOLE': 'Console',
      'PERIPHERAL': 'Périphérique',
      'OTHER': 'Autre'
    };
    return labels[type] || type;
  }

  getConditionLabel(condition: string): string {
    const labels: Record<string, string> = {
      'NEW': 'Neuf',
      'EXCELLENT': 'Excellent',
      'GOOD': 'Bon',
      'FAIR': 'Correct',
      'BROKEN': 'Endommagé',
      'POOR': 'Mauvais',
      'DEAD': 'HS'
    };
    return labels[condition] || condition;
  }

  getScreenStateLabel(state: string): string {
    const labels: Record<string, string> = {
      'INTACT': 'Intact',
      'CRACKED': 'Fissuré',
      'SHATTERED': 'Brisé',
      'DEAD_PIXELS': 'Pixels morts',
      'BURN_IN': 'Marquage écran',
      'NOT_VISIBLE': 'Non visible'
    };
    return labels[state] || state;
  }

  getDamageLabel(damageType: string): string {
    const labels: Record<string, string> = {
      'CRACK': 'Fissure',
      'DENT': 'Bosse',
      'SCRATCH': 'Rayure',
      'CORROSION': 'Corrosion',
      'BURN': 'Brûlure',
      'MISSING_PART': 'Pièce manquante',
      'DISCOLORATION': 'Décoloration'
    };
    return labels[damageType] || damageType;
  }

  submitEvaluation(): void {
    this.loading.set(true);

    const draft: CreateDeviceDraftRequest = {
      type: this.typeForm.controls.type.value!,
      brand: this.deviceForm.controls.brand.value!,
      model: this.deviceForm.controls.model.value!,
      description: this.deviceForm.controls.description.value || undefined,
      condition: this.conditionForm.controls.condition.value as DeviceCondition
    };

    const repairabilityRequest = {
      type: draft.type,
      brand: draft.brand || '',
      model: draft.model || '',
      condition: draft.condition,
      description: draft.description
    };

    // Etape 1: Creer le draft, obtenir la reparabilite et la valeur materiaux
    forkJoin({
      draft: this.deviceService.createDraft(draft),
      repairability: this.deviceService.getRepairabilityAssessment(repairabilityRequest),
      materialValue: this.deviceService.getMaterialValue(draft.type, draft.brand, draft.model)
    }).subscribe({
      next: ({ draft: draftResult, repairability, materialValue }) => {
        // Stocker immediatement les resultats de reparabilite et valeur materiaux
        this.repairabilityResult.set(repairability);
        this.materialValueResult.set(materialValue);

        // Calculer l'estimation locale
        this.estimationResult.set({
          minPrice: draftResult.estimatedValueMin || 0,
          maxPrice: draftResult.estimatedValueMax || 0,
          confidence: 85
        });

        // Generer un ID temporaire
        const tempId = draftResult.id ?? draftResult.deviceId ?? Date.now();
        this.currentEvaluationId.set(tempId);

        // Stocker pour la page detaillee
        sessionStorage.setItem('repairabilityResult', JSON.stringify(repairability));
        sessionStorage.setItem('currentEvaluationId', tempId.toString());
        sessionStorage.setItem(`repairability_${tempId}`, JSON.stringify(repairability));

        // Etape 2: Creer une evaluation dans le backend (en arriere-plan)
        const userId = this.authService.currentUser()?.id;
        const deviceId = draftResult.id ?? draftResult.deviceId ?? 0;

        if (deviceId) {
          // Use Vision results if available for more accurate evaluation
          const visionData = this.visionResult();

          const evaluationRequest: CreateEvaluationRequest = {
            deviceId: deviceId,
            deviceType: visionData?.identification?.deviceType || draft.type,
            deviceBrand: visionData?.identification?.brand || draft.brand,
            deviceModel: visionData?.identification?.model || draft.model,
            userId: userId,
            source: EvaluationSource.CLIENT_DRAFT,
            powersOn: visionData?.condition?.powersOnDetected ?? (draft.condition !== DeviceCondition.DEAD),
            screenCracked: visionData?.condition?.screenState === 'CRACKED' || visionData?.condition?.screenState === 'SHATTERED' || draft.condition === DeviceCondition.BROKEN,
            batteryHealthPct: visionData?.condition?.estimatedBatteryHealthPct ?? this.getBatteryHealthFromCondition(draft.condition),
            waterDamage: visionData?.condition?.waterDamageIndicators ?? false,
            fetchMarketPrice: true,  // Let backend fetch from eBay API
            conditionNotes: visionData?.condition?.detailedNotes || draft.description,
            visionAnalysisId: visionData?.analysisId
          };

          this.evaluationService.createEvaluation(evaluationRequest).subscribe({
            next: (evaluation) => {
              // Mettre a jour avec l'ID reel de l'evaluation
              const evalId = evaluation.id;
              this.currentEvaluationId.set(evalId);

              // Mettre a jour les valeurs si disponibles
              if (evaluation.result) {
                // Backend returns confidence as decimal (0.7 = 70%), convert to percentage
                const rawConfidence = evaluation.result.confidence || 0.85;
                const confidence = rawConfidence < 1 ? Math.round(rawConfidence * 100) : rawConfidence;

                this.estimationResult.set({
                  minPrice: evaluation.result.indicativeBuybackEur || draftResult.estimatedValueMin || 0,
                  maxPrice: evaluation.result.marketReferenceEur || draftResult.estimatedValueMax || 0,
                  confidence
                });
              }

              // Mettre a jour le stockage avec l'ID reel
              sessionStorage.setItem('currentEvaluationId', evalId.toString());
              sessionStorage.setItem(`repairability_${evalId}`, JSON.stringify(repairability));
              sessionStorage.setItem(`evaluation_${evalId}`, JSON.stringify({
                ...evaluation,
                device: {
                  type: draft.type,
                  brand: draft.brand,
                  model: draft.model,
                  condition: draft.condition
                }
              }));

              console.log('Evaluation creee avec succes, ID:', evalId);
            },
            error: (err) => {
              console.warn('Impossible de creer l\'evaluation backend, utilisation ID local:', err);
            }
          });
        }

        this.loading.set(false);
        this.stepper.next();
      },
      error: (err) => {
        console.warn('Erreur creation draft/reparabilite, fallback local:', err);
        // Fallback complet: simulation locale
        const basePrice = this.getBasePrice(draft.type);
        const conditionMultiplier = this.getConditionMultiplier(draft.condition);
        const estimatedPrice = basePrice * conditionMultiplier;

        // Generer un ID local pour le fallback
        const localEvalId = Date.now();
        this.currentEvaluationId.set(localEvalId);

        this.estimationResult.set({
          minPrice: Math.round(estimatedPrice * 0.8),
          maxPrice: Math.round(estimatedPrice * 1.2),
          confidence: Math.round(70 + Math.random() * 25)
        });

        // Generer des donnees de reparabilite mock
        this.deviceService.getRepairabilityAssessment(repairabilityRequest).subscribe({
          next: (repairability) => {
            this.repairabilityResult.set(repairability);
            sessionStorage.setItem('repairabilityResult', JSON.stringify(repairability));
            sessionStorage.setItem(`repairability_${localEvalId}`, JSON.stringify(repairability));
          },
          error: () => {
            console.warn('Impossible de charger la reparabilite');
          }
        });

        sessionStorage.setItem('currentEvaluationId', localEvalId.toString());

        this.loading.set(false);
        this.stepper.next();
      }
    });
  }

  private getBatteryHealthFromCondition(condition?: DeviceCondition): number {
    if (!condition) return 70;
    const healthMap: Record<DeviceCondition, number> = {
      [DeviceCondition.NEW]: 100,
      [DeviceCondition.GOOD]: 85,
      [DeviceCondition.FAIR]: 70,
      [DeviceCondition.BROKEN]: 50,
      [DeviceCondition.DEAD]: 0
    };
    return healthMap[condition] || 70;
  }

  getRecommendationIcon(action: string): string {
    const icons: Record<string, string> = {
      'REPAIR': 'build',
      'SELL_AS_IS': 'sell',
      'RECYCLE': 'recycling',
      'REFURBISH': 'auto_fix_high'
    };
    return icons[action] || 'help';
  }

  getRecommendationLabel(action: string): string {
    const labels: Record<string, string> = {
      'REPAIR': 'Réparation recommandée',
      'SELL_AS_IS': 'Vente en l\'état',
      'RECYCLE': 'Recyclage conseillé',
      'REFURBISH': 'Reconditionnement possible'
    };
    return labels[action] || action;
  }

  getRecommendationClass(action: string): string {
    const classes: Record<string, string> = {
      'REPAIR': 'recommendation-repair',
      'SELL_AS_IS': 'recommendation-sell',
      'RECYCLE': 'recommendation-recycle',
      'REFURBISH': 'recommendation-refurbish'
    };
    return classes[action] || '';
  }

  private getBasePrice(type: string): number {
    const prices: Record<string, number> = {
      SMARTPHONE: 150,
      LAPTOP: 300,
      TABLET: 120,
      DESKTOP: 200,
      TV: 180,
      CONSOLE: 100,
      PERIPHERAL: 30,
      OTHER: 50
    };
    return prices[type] || 50;
  }

  private getConditionMultiplier(condition: DeviceCondition | undefined): number {
    if (!condition) return 0.5;
    const multipliers: Record<DeviceCondition, number> = {
      [DeviceCondition.NEW]: 1.0,
      [DeviceCondition.GOOD]: 0.75,
      [DeviceCondition.FAIR]: 0.5,
      [DeviceCondition.BROKEN]: 0.25,
      [DeviceCondition.DEAD]: 0.1
    };
    return multipliers[condition] || 0.5;
  }
}
