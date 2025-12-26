import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

export interface OnboardingQuestion {
  id: string;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'scale' | 'date';
  question: string;
  description?: string;
  required: boolean;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  category: string;
  order: number;
  active: boolean;
}

export interface OnboardingConfig {
  enabled: boolean;
  skipAllowed: boolean;
  showProgressBar: boolean;
  welcomeTitle: string;
  welcomeMessage: string;
  completionMessage: string;
  questions: OnboardingQuestion[];
}

@Component({
  selector: 'app-onboarding-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    DragDropModule
  ],
  template: `
    <div class="onboarding-config">
      <header class="page-header">
        <div class="header-content">
          <h1>Configuration de l'Onboarding</h1>
          <p>Personnalisez le questionnaire d'accueil des nouveaux utilisateurs</p>
        </div>
        <div class="header-actions">
          <button mat-button (click)="resetToDefault()">
            <mat-icon>restore</mat-icon>
            Réinitialiser
          </button>
          <button mat-raised-button color="primary" (click)="saveConfig()" [disabled]="saving()">
            @if (saving()) {
              <mat-spinner diameter="20"></mat-spinner>
            } @else {
              <mat-icon>save</mat-icon>
              Enregistrer
            }
          </button>
        </div>
      </header>

      <div class="config-grid">
        <!-- General Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>settings</mat-icon>
            <mat-card-title>Paramètres généraux</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="settings-row">
              <mat-slide-toggle [(ngModel)]="config.enabled" color="primary">
                Activer l'onboarding
              </mat-slide-toggle>
              <mat-slide-toggle [(ngModel)]="config.skipAllowed" color="primary">
                Autoriser à passer
              </mat-slide-toggle>
              <mat-slide-toggle [(ngModel)]="config.showProgressBar" color="primary">
                Afficher la progression
              </mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Welcome Message -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>waving_hand</mat-icon>
            <mat-card-title>Message d'accueil</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Titre de bienvenue</mat-label>
              <input matInput [(ngModel)]="config.welcomeTitle">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Message de bienvenue</mat-label>
              <textarea matInput [(ngModel)]="config.welcomeMessage" rows="3"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Message de fin</mat-label>
              <textarea matInput [(ngModel)]="config.completionMessage" rows="2"></textarea>
            </mat-form-field>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Questions Section -->
      <mat-card class="questions-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>quiz</mat-icon>
          <mat-card-title>Questions du questionnaire</mat-card-title>
          <button mat-stroked-button color="primary" (click)="addQuestion()">
            <mat-icon>add</mat-icon>
            Ajouter une question
          </button>
        </mat-card-header>
        <mat-card-content>
          <div class="questions-info">
            <mat-icon>info</mat-icon>
            <span>Glissez-déposez les questions pour les réorganiser</span>
          </div>

          <mat-accordion cdkDropList (cdkDropListDropped)="dropQuestion($event)">
            @for (question of config.questions; track question.id; let i = $index) {
              <mat-expansion-panel cdkDrag>
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon cdkDragHandle class="drag-handle">drag_indicator</mat-icon>
                    <span class="question-number">{{ i + 1 }}.</span>
                    <span class="question-title">{{ question.question || 'Nouvelle question' }}</span>
                  </mat-panel-title>
                  <mat-panel-description>
                    <span class="question-type-badge" [class]="question.type">
                      {{ getQuestionTypeLabel(question.type) }}
                    </span>
                    @if (!question.active) {
                      <span class="inactive-badge">Inactive</span>
                    }
                  </mat-panel-description>
                </mat-expansion-panel-header>

                <div class="question-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="flex-2">
                      <mat-label>Question</mat-label>
                      <input matInput [(ngModel)]="question.question" placeholder="Posez votre question...">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="flex-1">
                      <mat-label>Type</mat-label>
                      <mat-select [(ngModel)]="question.type">
                        <mat-option value="single_choice">Choix unique</mat-option>
                        <mat-option value="multiple_choice">Choix multiple</mat-option>
                        <mat-option value="text">Texte libre</mat-option>
                        <mat-option value="scale">Échelle</mat-option>
                        <mat-option value="date">Date</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="flex-1">
                      <mat-label>Catégorie</mat-label>
                      <mat-select [(ngModel)]="question.category">
                        <mat-option value="profile">Profil</mat-option>
                        <mat-option value="interests">Intérêts</mat-option>
                        <mat-option value="behavior">Comportement</mat-option>
                        <mat-option value="goals">Objectifs</mat-option>
                        <mat-option value="other">Autre</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Description (optionnelle)</mat-label>
                    <input matInput [(ngModel)]="question.description" placeholder="Explications supplémentaires...">
                  </mat-form-field>

                  @if (question.type === 'single_choice' || question.type === 'multiple_choice') {
                    <div class="options-section">
                      <label>Options de réponse</label>
                      <div class="options-list">
                        @for (option of question.options; track $index; let j = $index) {
                          <div class="option-item">
                            <mat-form-field appearance="outline">
                              <input matInput [(ngModel)]="question.options![j]" placeholder="Option {{ j + 1 }}">
                            </mat-form-field>
                            <button mat-icon-button color="warn" (click)="removeOption(question, j)">
                              <mat-icon>remove_circle</mat-icon>
                            </button>
                          </div>
                        }
                        <button mat-stroked-button (click)="addOption(question)">
                          <mat-icon>add</mat-icon>
                          Ajouter une option
                        </button>
                      </div>
                    </div>
                  }

                  @if (question.type === 'scale') {
                    <div class="scale-section">
                      <div class="form-row">
                        <mat-form-field appearance="outline">
                          <mat-label>Valeur min</mat-label>
                          <input matInput type="number" [(ngModel)]="question.scaleMin">
                        </mat-form-field>
                        <mat-form-field appearance="outline">
                          <mat-label>Valeur max</mat-label>
                          <input matInput type="number" [(ngModel)]="question.scaleMax">
                        </mat-form-field>
                        <mat-form-field appearance="outline">
                          <mat-label>Label min</mat-label>
                          <input matInput [(ngModel)]="question.scaleLabels!.min" placeholder="ex: Pas du tout">
                        </mat-form-field>
                        <mat-form-field appearance="outline">
                          <mat-label>Label max</mat-label>
                          <input matInput [(ngModel)]="question.scaleLabels!.max" placeholder="ex: Tout à fait">
                        </mat-form-field>
                      </div>
                    </div>
                  }

                  <div class="question-footer">
                    <div class="question-toggles">
                      <mat-checkbox [(ngModel)]="question.required" color="primary">
                        Obligatoire
                      </mat-checkbox>
                      <mat-checkbox [(ngModel)]="question.active" color="primary">
                        Active
                      </mat-checkbox>
                    </div>
                    <button mat-button color="warn" (click)="removeQuestion(i)">
                      <mat-icon>delete</mat-icon>
                      Supprimer
                    </button>
                  </div>
                </div>
              </mat-expansion-panel>
            }
          </mat-accordion>

          @if (config.questions.length === 0) {
            <div class="empty-state">
              <mat-icon>quiz</mat-icon>
              <h3>Aucune question configurée</h3>
              <p>Ajoutez des questions pour personnaliser l'expérience d'onboarding</p>
              <button mat-raised-button color="primary" (click)="addQuestion()">
                <mat-icon>add</mat-icon>
                Ajouter une question
              </button>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <!-- Preview Section -->
      <mat-card class="preview-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>preview</mat-icon>
          <mat-card-title>Aperçu</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="preview-container">
            <div class="preview-header">
              <h2>{{ config.welcomeTitle || 'Bienvenue !' }}</h2>
              <p>{{ config.welcomeMessage || 'Faites connaissance avec nous.' }}</p>
            </div>
            @if (config.showProgressBar) {
              <div class="preview-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 33%"></div>
                </div>
                <span>Question 1 sur {{ config.questions.length }}</span>
              </div>
            }
            <div class="preview-questions">
              @for (q of config.questions.slice(0, 2); track q.id) {
                <div class="preview-question">
                  <span class="preview-q-label">{{ q.question }}</span>
                  @if (q.type === 'single_choice' || q.type === 'multiple_choice') {
                    <div class="preview-options">
                      @for (opt of q.options?.slice(0, 3); track $index) {
                        <span class="preview-option">{{ opt }}</span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .onboarding-config {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .header-content h1 {
      margin: 0 0 0.25rem 0;
      font-size: 1.75rem;
      font-weight: 500;
    }

    .header-content p {
      margin: 0;
      color: #666;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .settings-card, .questions-card, .preview-card {
      border-radius: 12px;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    mat-card-header mat-icon[mat-card-avatar] {
      background: var(--primary-color, #2E7D32);
      color: white;
      padding: 8px;
      border-radius: 50%;
      font-size: 20px;
      width: 36px;
      height: 36px;
    }

    mat-card-header button {
      margin-left: auto;
    }

    .settings-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .full-width {
      width: 100%;
    }

    .questions-card {
      margin-bottom: 1.5rem;
    }

    .questions-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #e3f2fd;
      border-radius: 8px;
      margin-bottom: 1rem;
      color: #1565c0;
    }

    .questions-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    mat-expansion-panel {
      margin-bottom: 0.5rem;
      border-radius: 8px !important;
    }

    .drag-handle {
      cursor: move;
      color: #999;
      margin-right: 0.5rem;
    }

    .question-number {
      font-weight: 600;
      margin-right: 0.5rem;
      color: #666;
    }

    .question-title {
      flex: 1;
    }

    .question-type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .question-type-badge.single_choice { background: #e8f5e9; color: #2e7d32; }
    .question-type-badge.multiple_choice { background: #e3f2fd; color: #1565c0; }
    .question-type-badge.text { background: #fff3e0; color: #e65100; }
    .question-type-badge.scale { background: #f3e5f5; color: #7b1fa2; }
    .question-type-badge.date { background: #fce4ec; color: #c2185b; }

    .inactive-badge {
      margin-left: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: #f5f5f5;
      color: #999;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .question-form {
      padding-top: 1rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .flex-1 { flex: 1; min-width: 150px; }
    .flex-2 { flex: 2; min-width: 300px; }

    .options-section, .scale-section {
      margin: 1rem 0;
    }

    .options-section label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .option-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .option-item mat-form-field {
      flex: 1;
    }

    .question-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .question-toggles {
      display: flex;
      gap: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
    }

    .empty-state h3 {
      margin: 1rem 0 0.5rem;
    }

    .empty-state p {
      margin: 0 0 1.5rem;
    }

    .preview-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .preview-card mat-card-header mat-icon[mat-card-avatar] {
      background: rgba(255,255,255,0.2);
    }

    .preview-card mat-card-title {
      color: white;
    }

    .preview-container {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      color: #333;
    }

    .preview-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .preview-header h2 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
    }

    .preview-header p {
      margin: 0;
      color: #666;
    }

    .preview-progress {
      margin-bottom: 1.5rem;
    }

    .progress-bar {
      height: 6px;
      background: #e0e0e0;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 3px;
    }

    .preview-progress span {
      font-size: 0.875rem;
      color: #666;
    }

    .preview-question {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 0.75rem;
    }

    .preview-q-label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .preview-options {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .preview-option {
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #ddd;
      border-radius: 20px;
      font-size: 0.875rem;
    }

    .cdk-drag-preview {
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      border-radius: 8px;
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
    }

    @media (max-width: 768px) {
      .config-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        flex-direction: column;
      }

      .flex-1, .flex-2 {
        min-width: 100%;
      }
    }
  `]
})
export class OnboardingConfigComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  saving = signal(false);

  config: OnboardingConfig = {
    enabled: true,
    skipAllowed: true,
    showProgressBar: true,
    welcomeTitle: 'Bienvenue sur Circular !',
    welcomeMessage: 'Aidez-nous à personnaliser votre expérience en répondant à quelques questions.',
    completionMessage: 'Merci ! Votre profil est maintenant configuré.',
    questions: []
  };

  ngOnInit(): void {
    this.loadDefaultQuestions();
  }

  private loadDefaultQuestions(): void {
    this.config.questions = [
      {
        id: 'q1',
        type: 'single_choice',
        question: 'Quel type d\'utilisateur êtes-vous ?',
        description: 'Cela nous aide à personnaliser votre expérience',
        required: true,
        options: ['Particulier', 'Association', 'Entreprise', 'Collectivité'],
        category: 'profile',
        order: 1,
        active: true
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'Quels types d\'appareils vous intéressent ?',
        required: false,
        options: ['Smartphones', 'Tablettes', 'Ordinateurs', 'Téléviseurs', 'Électroménager', 'Autres'],
        category: 'interests',
        order: 2,
        active: true
      },
      {
        id: 'q3',
        type: 'single_choice',
        question: 'Qu\'est-ce qui vous motive à utiliser Circular ?',
        required: true,
        options: [
          'Économiser de l\'argent',
          'Protéger l\'environnement',
          'Trouver des appareils de qualité',
          'Valoriser mes anciens appareils'
        ],
        category: 'goals',
        order: 3,
        active: true
      },
      {
        id: 'q4',
        type: 'scale',
        question: 'À quel point êtes-vous sensible aux enjeux environnementaux ?',
        required: false,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: 'Peu sensible', max: 'Très sensible' },
        category: 'behavior',
        order: 4,
        active: true
      },
      {
        id: 'q5',
        type: 'single_choice',
        question: 'Comment avez-vous connu Circular ?',
        required: false,
        options: ['Réseaux sociaux', 'Bouche à oreille', 'Recherche Google', 'Publicité', 'Autre'],
        category: 'other',
        order: 5,
        active: true
      }
    ];
  }

  addQuestion(): void {
    const newQuestion: OnboardingQuestion = {
      id: `q${Date.now()}`,
      type: 'single_choice',
      question: '',
      required: false,
      options: ['Option 1', 'Option 2'],
      category: 'other',
      order: this.config.questions.length + 1,
      active: true,
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: '', max: '' }
    };
    this.config.questions.push(newQuestion);
  }

  removeQuestion(index: number): void {
    this.config.questions.splice(index, 1);
    this.reorderQuestions();
  }

  addOption(question: OnboardingQuestion): void {
    if (!question.options) {
      question.options = [];
    }
    question.options.push(`Option ${question.options.length + 1}`);
  }

  removeOption(question: OnboardingQuestion, index: number): void {
    question.options?.splice(index, 1);
  }

  dropQuestion(event: CdkDragDrop<OnboardingQuestion[]>): void {
    moveItemInArray(this.config.questions, event.previousIndex, event.currentIndex);
    this.reorderQuestions();
  }

  private reorderQuestions(): void {
    this.config.questions.forEach((q, i) => {
      q.order = i + 1;
    });
  }

  getQuestionTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'single_choice': 'Choix unique',
      'multiple_choice': 'Choix multiple',
      'text': 'Texte',
      'scale': 'Échelle',
      'date': 'Date'
    };
    return labels[type] || type;
  }

  resetToDefault(): void {
    this.loadDefaultQuestions();
    this.config.enabled = true;
    this.config.skipAllowed = true;
    this.config.showProgressBar = true;
    this.config.welcomeTitle = 'Bienvenue sur Circular !';
    this.config.welcomeMessage = 'Aidez-nous à personnaliser votre expérience en répondant à quelques questions.';
    this.config.completionMessage = 'Merci ! Votre profil est maintenant configuré.';
    this.snackBar.open('Configuration réinitialisée', 'OK', { duration: 3000 });
  }

  saveConfig(): void {
    this.saving.set(true);

    // TODO: Call API to save configuration
    // For now, simulate saving
    setTimeout(() => {
      this.saving.set(false);
      this.snackBar.open('Configuration enregistrée avec succès', 'OK', { duration: 3000 });
      console.log('Saved config:', this.config);
    }, 1000);
  }
}
