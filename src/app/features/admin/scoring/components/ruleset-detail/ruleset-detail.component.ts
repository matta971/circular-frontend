import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScoringAdminService, ScoringRuleSet, ScoringWeight, ScoringParam } from '../../services/scoring-admin.service';

const DEFAULT_WEIGHTS: ScoringWeight[] = [
  { componentType: 'ETAT_PHYSIQUE', weight: 0.25, description: 'État physique (écran, coque, boutons)' },
  { componentType: 'ETAT_FONCTIONNEL', weight: 0.25, description: 'État fonctionnel (batterie, performances)' },
  { componentType: 'REPARABILITE', weight: 0.15, description: 'Indice de réparabilité' },
  { componentType: 'VALEUR_MARCHE', weight: 0.15, description: 'Prix marché de référence' },
  { componentType: 'AGE_APPAREIL', weight: 0.10, description: 'Ancienneté du modèle' },
  { componentType: 'RARETE', weight: 0.10, description: 'Disponibilité sur le marché' }
];

@Component({
  selector: 'app-ruleset-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatTabsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="ruleset-detail-container">
      <div class="page-header">
        <button mat-icon-button routerLink="../">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ isEditMode() ? 'Modifier la version ' + ruleSet()?.version : 'Nouvelle version' }}</h1>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else {
        <mat-tab-group>
          <!-- General Info -->
          <mat-tab label="Informations">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Informations générales</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="infoForm">
                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Nom</mat-label>
                        <input matInput formControlName="name" placeholder="Ex: Production Q1 2024">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Version</mat-label>
                        <input matInput formControlName="version" placeholder="Ex: 1.0.0">
                        <mat-hint>Versioning sémantique recommandé</mat-hint>
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Description</mat-label>
                      <textarea matInput formControlName="description" rows="3"
                                placeholder="Décrivez les changements de cette version..."></textarea>
                    </mat-form-field>
                  </form>

                  <div class="form-actions">
                    <button mat-raised-button color="primary"
                            [disabled]="infoForm.invalid || savingInfo()"
                            (click)="saveInfo()">
                      @if (savingInfo()) {
                        <mat-spinner diameter="20"></mat-spinner>
                      } @else {
                        Enregistrer
                      }
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Weights Editor -->
          <mat-tab label="Poids des composants" [disabled]="!isEditMode()">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Configuration des poids</mat-card-title>
                  <mat-card-subtitle>
                    Total: {{ totalWeight() * 100 | number:'1.0-0' }}%
                    @if (totalWeight() !== 1) {
                      <span class="weight-warning">(doit être 100%)</span>
                    }
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="weights-container">
                    @for (weight of weights(); track weight.componentType; let i = $index) {
                      <div class="weight-item">
                        <div class="weight-header">
                          <span class="weight-type">{{ formatComponentType(weight.componentType) }}</span>
                          <span class="weight-value">{{ (weight.weight * 100).toFixed(0) }}%</span>
                        </div>
                        <p class="weight-description">{{ weight.description }}</p>
                        <mat-slider min="0" max="100" step="5" discrete>
                          <input matSliderThumb
                                 [value]="weight.weight * 100"
                                 (valueChange)="updateWeight(i, $event)">
                        </mat-slider>
                      </div>
                    }
                  </div>

                  <mat-divider></mat-divider>

                  <div class="weights-summary">
                    <div class="summary-bar">
                      @for (weight of weights(); track weight.componentType) {
                        <div class="bar-segment"
                             [style.width.%]="weight.weight * 100"
                             [style.background]="getColorForType(weight.componentType)"
                             [matTooltip]="weight.componentType + ': ' + (weight.weight * 100).toFixed(0) + '%'">
                        </div>
                      }
                    </div>
                    <div class="legend">
                      @for (weight of weights(); track weight.componentType) {
                        <div class="legend-item">
                          <span class="legend-color" [style.background]="getColorForType(weight.componentType)"></span>
                          {{ formatComponentType(weight.componentType) }}
                        </div>
                      }
                    </div>
                  </div>

                  <div class="form-actions">
                    <button mat-button (click)="resetWeights()">
                      <mat-icon>restart_alt</mat-icon>
                      Réinitialiser
                    </button>
                    <button mat-raised-button color="primary"
                            [disabled]="totalWeight() !== 1 || savingWeights()"
                            (click)="saveWeights()">
                      @if (savingWeights()) {
                        <mat-spinner diameter="20"></mat-spinner>
                      } @else {
                        Enregistrer les poids
                      }
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Params Editor -->
          <mat-tab label="Paramètres" [disabled]="!isEditMode()">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Paramètres de scoring</mat-card-title>
                  <mat-card-subtitle>Configuration avancée en clé-valeur</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="paramsForm">
                    <div formArrayName="params">
                      @for (param of paramsArray.controls; track param; let i = $index) {
                        <div class="param-row" [formGroupName]="i">
                          <mat-form-field appearance="outline">
                            <mat-label>Clé</mat-label>
                            <input matInput formControlName="paramKey" placeholder="ex: min_score_threshold">
                          </mat-form-field>
                          <mat-form-field appearance="outline" class="value-field">
                            <mat-label>Valeur</mat-label>
                            <input matInput formControlName="paramValue" placeholder="ex: 0.5">
                          </mat-form-field>
                          <mat-form-field appearance="outline" class="desc-field">
                            <mat-label>Description</mat-label>
                            <input matInput formControlName="description" placeholder="Description optionnelle">
                          </mat-form-field>
                          <button mat-icon-button color="warn" (click)="removeParam(i)">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </div>
                      }
                    </div>
                  </form>

                  <button mat-stroked-button (click)="addParam()">
                    <mat-icon>add</mat-icon>
                    Ajouter un paramètre
                  </button>

                  <div class="form-actions">
                    <button mat-raised-button color="primary"
                            [disabled]="savingParams()"
                            (click)="saveParams()">
                      @if (savingParams()) {
                        <mat-spinner diameter="20"></mat-spinner>
                      } @else {
                        Enregistrer les paramètres
                      }
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      }
    </div>
  `,
  styles: [`
    .ruleset-detail-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;

      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 500;
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

    mat-card-content {
      padding-top: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    /* Weights */
    .weight-warning {
      color: #f44336;
      font-weight: 500;
    }

    .weights-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .weight-item {
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;

      .weight-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;

        .weight-type {
          font-weight: 500;
        }

        .weight-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1976d2;
        }
      }

      .weight-description {
        font-size: 0.85rem;
        color: #666;
        margin: 0 0 0.5rem;
      }

      mat-slider {
        width: 100%;
      }
    }

    .weights-summary {
      margin-top: 1.5rem;

      .summary-bar {
        display: flex;
        height: 24px;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 1rem;
      }

      .bar-segment {
        transition: width 0.3s ease;
      }

      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;

          .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
          }
        }
      }
    }

    /* Params */
    .param-row {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 0.5rem;

      mat-form-field {
        flex: 1;
      }

      .value-field {
        flex: 0.8;
      }

      .desc-field {
        flex: 1.5;
      }
    }
  `]
})
export class RulesetDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private scoringService = inject(ScoringAdminService);

  loading = signal(false);
  savingInfo = signal(false);
  savingWeights = signal(false);
  savingParams = signal(false);
  isEditMode = signal(false);
  ruleSet = signal<ScoringRuleSet | null>(null);
  weights = signal<ScoringWeight[]>([...DEFAULT_WEIGHTS]);

  totalWeight = computed(() =>
    Math.round(this.weights().reduce((sum, w) => sum + w.weight, 0) * 100) / 100
  );

  infoForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    version: ['', Validators.required],
    description: ['']
  });

  paramsForm: FormGroup = this.fb.group({
    params: this.fb.array([])
  });

  get paramsArray(): FormArray {
    return this.paramsForm.get('params') as FormArray;
  }

  private componentColors: Record<string, string> = {
    'ETAT_PHYSIQUE': '#2196F3',
    'ETAT_FONCTIONNEL': '#4CAF50',
    'REPARABILITE': '#FF9800',
    'VALEUR_MARCHE': '#9C27B0',
    'AGE_APPAREIL': '#F44336',
    'RARETE': '#00BCD4'
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.loadRuleSet(+id);
    }
  }

  private loadRuleSet(id: number): void {
    this.loading.set(true);
    this.scoringService.getById(id).subscribe({
      next: (ruleSet) => {
        if (ruleSet) {
          this.ruleSet.set(ruleSet);
          this.infoForm.patchValue({
            name: ruleSet.name,
            version: ruleSet.version,
            description: ruleSet.description
          });
          if (ruleSet.weights?.length) {
            this.weights.set(ruleSet.weights);
          }
          this.loadParams(ruleSet.params || []);
        } else {
          this.snackBar.open('Version non trouvée', 'Fermer', { duration: 3000 });
          this.router.navigate(['../'], { relativeTo: this.route });
        }
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  private loadParams(params: ScoringParam[]): void {
    this.paramsArray.clear();
    params.forEach(p => this.addParam(p));
  }

  saveInfo(): void {
    if (this.infoForm.invalid) return;

    this.savingInfo.set(true);
    const data = this.infoForm.value;

    const operation = this.isEditMode()
      ? this.scoringService.update(this.ruleSet()!.id, data)
      : this.scoringService.create(data);

    operation.subscribe({
      next: (result) => {
        if (result) {
          this.snackBar.open('Informations enregistrées', 'Fermer', { duration: 3000 });
          if (!this.isEditMode()) {
            this.router.navigate(['..', result.id], { relativeTo: this.route });
          } else {
            this.ruleSet.set(result);
          }
        } else {
          this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
        }
        this.savingInfo.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
        this.savingInfo.set(false);
      }
    });
  }

  updateWeight(index: number, value: number): void {
    const updated = [...this.weights()];
    updated[index] = { ...updated[index], weight: value / 100 };
    this.weights.set(updated);
  }

  resetWeights(): void {
    this.weights.set([...DEFAULT_WEIGHTS]);
  }

  saveWeights(): void {
    if (!this.ruleSet()) return;

    this.savingWeights.set(true);
    this.scoringService.updateWeights(this.ruleSet()!.id, this.weights()).subscribe({
      next: (result) => {
        if (result.length) {
          this.snackBar.open('Poids enregistrés', 'Fermer', { duration: 3000 });
          this.weights.set(result);
        } else {
          this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
        }
        this.savingWeights.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
        this.savingWeights.set(false);
      }
    });
  }

  addParam(param?: ScoringParam): void {
    this.paramsArray.push(this.fb.group({
      paramKey: [param?.paramKey || '', Validators.required],
      paramValue: [param?.paramValue || '', Validators.required],
      description: [param?.description || '']
    }));
  }

  removeParam(index: number): void {
    this.paramsArray.removeAt(index);
  }

  saveParams(): void {
    if (!this.ruleSet()) return;

    this.savingParams.set(true);
    const params = this.paramsArray.value as ScoringParam[];

    this.scoringService.updateParams(this.ruleSet()!.id, params).subscribe({
      next: (result) => {
        this.snackBar.open('Paramètres enregistrés', 'Fermer', { duration: 3000 });
        this.loadParams(result);
        this.savingParams.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
        this.savingParams.set(false);
      }
    });
  }

  formatComponentType(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
  }

  getColorForType(type: string): string {
    return this.componentColors[type] || '#9E9E9E';
  }
}
