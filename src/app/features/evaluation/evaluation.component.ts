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
import { DeviceCondition, CreateDeviceDraftRequest, RepairabilityAssessment } from '../../core/models';
import { forkJoin } from 'rxjs';

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
            <div class="upload-zone" (click)="fileInput.click()">
              <mat-icon>cloud_upload</mat-icon>
              <p>Cliquez ou glissez vos photos ici</p>
              <small>JPG, PNG (max 5MB par photo)</small>
              <input #fileInput type="file" accept="image/*" multiple hidden (change)="onFilesSelected($event)">
            </div>

            @if (selectedPhotos().length > 0) {
              <div class="photo-preview">
                @for (photo of selectedPhotos(); track photo.name; let i = $index) {
                  <div class="photo-item">
                    <img [src]="photo.preview" [alt]="photo.name">
                    <button mat-icon-button (click)="removePhoto(i)">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                }
              </div>
            }
          </div>
          <div class="step-actions">
            <button mat-button matStepperPrevious>Retour</button>
            <button mat-raised-button color="primary" (click)="submitEvaluation()">
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

                    <button mat-stroked-button color="primary" routerLink="/repairability" class="details-btn">
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
                  <button mat-raised-button color="accent" routerLink="/repairability">
                    <mat-icon>build</mat-icon>
                    Trouver un réparateur
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
  selectedPhotos = signal<{ file: File; preview: string; name: string }[]>([]);
  estimationResult = signal<{ minPrice: number; maxPrice: number; confidence: number } | null>(null);
  repairabilityResult = signal<RepairabilityAssessment | null>(null);

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
  }

  removePhoto(index: number): void {
    this.selectedPhotos.update(photos => {
      const removed = photos[index];
      URL.revokeObjectURL(removed.preview);
      return photos.filter((_, i) => i !== index);
    });
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

    // Appels API en parallèle pour l'estimation et la réparabilité
    forkJoin({
      draft: this.deviceService.createDraft(draft),
      repairability: this.deviceService.getRepairabilityAssessment(repairabilityRequest)
    }).subscribe({
      next: ({ draft: result, repairability }) => {
        this.estimationResult.set({
          minPrice: result.estimatedValueMin || 0,
          maxPrice: result.estimatedValueMax || 0,
          confidence: 85
        });
        this.repairabilityResult.set(repairability);
        // Stocker pour la page détaillée
        sessionStorage.setItem('repairabilityResult', JSON.stringify(repairability));
        this.loading.set(false);
        this.stepper.next();
      },
      error: () => {
        // Fallback: simulation locale
        const basePrice = this.getBasePrice(draft.type);
        const conditionMultiplier = this.getConditionMultiplier(draft.condition);
        const estimatedPrice = basePrice * conditionMultiplier;

        this.estimationResult.set({
          minPrice: Math.round(estimatedPrice * 0.8),
          maxPrice: Math.round(estimatedPrice * 1.2),
          confidence: Math.round(70 + Math.random() * 25)
        });
        this.loading.set(false);
        this.stepper.next();
      }
    });
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
