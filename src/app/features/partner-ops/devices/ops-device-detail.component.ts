import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PartnerOpsService } from '../services/partner-ops.service';
import {
  OpsDevice,
  DeviceStatus,
  DiagnosisUpdateRequest,
  DecisionDraftRequest,
  CloseExecutionRequest,
  PrepareTransferRequest,
  ThirdPartyTransfer
} from '../models/partner-ops.model';

interface WorkflowStep {
  label: string;
  icon: string;
  statuses: DeviceStatus[];
  timestamp?: string;
}

@Component({
  selector: 'app-ops-device-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule,
    MatStepperModule,
    MatDialogModule,
    MatTooltipModule
  ],
  template: `
    <div class="device-detail-container">
      <div class="header">
        <button mat-icon-button routerLink="../">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Appareil #{{ deviceId }}</h1>
        @if (isPostRepair()) {
          <mat-chip color="accent" highlighted>
            <mat-icon>build</mat-icon>
            Post-réparation
          </mat-chip>
        }
        @if (device()?.disputeOpen) {
          <mat-chip color="warn" highlighted>
            <mat-icon>warning</mat-icon>
            Litige en cours
          </mat-chip>
        }
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (device()) {
        <!-- Workflow Timeline -->
        <mat-card class="timeline-card">
          <mat-card-header>
            <mat-card-title>Progression du workflow</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="workflow-timeline">
              @for (step of workflowSteps(); track step.label; let i = $index) {
                <div class="step" [class.active]="isStepActive(step)" [class.completed]="isStepCompleted(step, i)">
                  <div class="step-icon">
                    <mat-icon>{{ step.icon }}</mat-icon>
                  </div>
                  <div class="step-label">{{ step.label }}</div>
                  @if (getStepTimestamp(step)) {
                    <div class="step-time">{{ getStepTimestamp(step) | date:'dd/MM HH:mm' }}</div>
                  }
                </div>
                @if (i < workflowSteps().length - 1) {
                  <div class="step-connector" [class.completed]="isStepCompleted(step, i)"></div>
                }
              }
            </div>
          </mat-card-content>
        </mat-card>

        <div class="content-grid">
          <!-- Device info card -->
          <mat-card class="info-card">
            <mat-card-header>
              <mat-card-title>Informations appareil</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Type</span>
                  <span class="value">{{ device()!.type }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Marque</span>
                  <span class="value">{{ device()!.brand || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Modèle</span>
                  <span class="value">{{ device()!.model || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">N° série</span>
                  <span class="value">{{ device()!.serialNumber || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">État déclaré</span>
                  <span class="value">
                    <mat-chip>{{ getConditionLabel(device()!.condition) }}</mat-chip>
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">Statut</span>
                  <span class="value">
                    <mat-chip [color]="getStatusColor(device()!.status)" highlighted>
                      {{ getStatusLabel(device()!.status) }}
                    </mat-chip>
                  </span>
                </div>
                <div class="info-item full-width">
                  <span class="label">Description</span>
                  <span class="value">{{ device()!.description || 'Aucune description' }}</span>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Valeur estimée</span>
                  <span class="value">{{ device()!.estimatedValue | currency:'EUR' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Reçu le</span>
                  <span class="value">{{ device()!.receivedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                @if (device()!.diagnosedValue) {
                  <div class="info-item">
                    <span class="label">Valeur diagnostiquée</span>
                    <span class="value highlight">{{ device()!.diagnosedValue | currency:'EUR' }}</span>
                  </div>
                }
                @if (device()!.actualValue) {
                  <div class="info-item">
                    <span class="label">Valeur réalisée</span>
                    <span class="value highlight">{{ device()!.actualValue | currency:'EUR' }}</span>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Actions card -->
          <mat-card class="actions-card">
            <mat-card-header>
              <mat-card-title>Actions disponibles</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @switch (device()!.status) {
                @case ('RECEIVED') {
                  <div class="action-buttons">
                    <button mat-raised-button color="primary" (click)="startReview()" [disabled]="processing()">
                      <mat-icon>play_arrow</mat-icon>
                      Démarrer l'analyse
                    </button>
                    <button mat-stroked-button color="warn" (click)="showHoldDialog()" [disabled]="processing()">
                      <mat-icon>pause</mat-icon>
                      Mettre en attente
                    </button>
                  </div>
                }
                @case ('ON_HOLD') {
                  <div class="hold-info">
                    <mat-icon>pause_circle</mat-icon>
                    <p>En attente: {{ device()!.holdReason }}</p>
                  </div>
                  <button mat-raised-button color="primary" (click)="resumeFromHold()" [disabled]="processing()">
                    <mat-icon>play_arrow</mat-icon>
                    Reprendre
                  </button>
                }
                @case ('UNDER_REVIEW') {
                  <form [formGroup]="diagnosisForm" class="form-section">
                    <h3>{{ isPostRepair() ? 'Diagnostic post-réparation' : 'Diagnostic' }}</h3>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>État diagnostiqué</mat-label>
                      <mat-select formControlName="diagnosedCondition">
                        <mat-option value="NEW">Neuf</mat-option>
                        <mat-option value="LIKE_NEW">Comme neuf</mat-option>
                        <mat-option value="GOOD">Bon état</mat-option>
                        <mat-option value="FAIR">État correct</mat-option>
                        <mat-option value="POOR">Mauvais état</mat-option>
                        <mat-option value="FOR_PARTS">Pour pièces</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Valeur estimée (EUR)</mat-label>
                      <input matInput type="number" formControlName="diagnosedValue">
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Notes de diagnostic</mat-label>
                      <textarea matInput formControlName="diagnosisNotes" rows="3"></textarea>
                    </mat-form-field>
                    <div class="action-buttons">
                      <button mat-raised-button (click)="saveDiagnosis()" [disabled]="processing()">
                        <mat-icon>save</mat-icon>
                        Sauvegarder
                      </button>
                      <button mat-raised-button color="primary" (click)="confirmDiagnosis()" [disabled]="processing()">
                        <mat-icon>check</mat-icon>
                        Confirmer diagnostic
                      </button>
                      <button mat-stroked-button (click)="undoReview()" [disabled]="processing()">
                        <mat-icon>undo</mat-icon>
                        Annuler analyse
                      </button>
                    </div>
                  </form>
                }
                @case ('DIAGNOSED') {
                  <div class="diagnosed-info">
                    <p><strong>État:</strong> {{ getConditionLabel(device()!.diagnosedCondition) }}</p>
                    <p><strong>Valeur:</strong> {{ device()!.diagnosedValue | currency:'EUR' }}</p>
                    @if (device()!.diagnosisNotes) {
                      <p><strong>Notes:</strong> {{ device()!.diagnosisNotes }}</p>
                    }
                  </div>
                  <form [formGroup]="decisionForm" class="form-section">
                    <h3>{{ isPostRepair() ? 'Décision finale' : 'Décision' }}</h3>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Type de décision</mat-label>
                      <mat-select formControlName="outcome" required>
                        <mat-option value="REEMPLOI_REVENTE">Réemploi / Revente</mat-option>
                        <mat-option value="REPARATION">Réparation (retour diagnostic après)</mat-option>
                        <mat-option value="MPIR_RECYCLE">Recyclage MPIR</mat-option>
                        <mat-option value="DESTRUCTION_SANS_VALEUR">Destruction sans valeur</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Canal d'exécution</mat-label>
                      <mat-select formControlName="channel" required>
                        <mat-option value="INTERNAL">Interne</mat-option>
                        <mat-option value="MARKETPLACE">Marketplace</mat-option>
                        <mat-option value="PARTNER">Partenaire</mat-option>
                        <mat-option value="DONATION">Don</mat-option>
                        <mat-option value="THIRD_PARTY">Tiers (recycleur/reconditionneur)</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Notes</mat-label>
                      <textarea matInput formControlName="notes" rows="2"></textarea>
                    </mat-form-field>
                    <div class="action-buttons">
                      <button mat-raised-button color="primary" (click)="draftDecision()"
                              [disabled]="decisionForm.invalid || processing()">
                        <mat-icon>description</mat-icon>
                        Créer décision
                      </button>
                      <button mat-stroked-button (click)="reopenReview()" [disabled]="processing()">
                        <mat-icon>edit</mat-icon>
                        Modifier diagnostic
                      </button>
                    </div>
                  </form>
                }
                @case ('DECISION_DRAFTED') {
                  <div class="decision-info">
                    <p><strong>Décision:</strong> {{ getDecisionLabel(device()!.draftDecision) }}</p>
                    <p><strong>Canal:</strong> {{ getChannelLabel(device()!.decisionChannel) }}</p>
                    @if (device()!.decisionNotes) {
                      <p><strong>Notes:</strong> {{ device()!.decisionNotes }}</p>
                    }
                  </div>
                  <div class="action-buttons">
                    <button mat-raised-button color="primary" (click)="confirmDecision()" [disabled]="processing()">
                      <mat-icon>check_circle</mat-icon>
                      Confirmer décision
                    </button>
                    <button mat-stroked-button (click)="showEditDecisionForm()" [disabled]="processing()">
                      <mat-icon>edit</mat-icon>
                      Modifier
                    </button>
                  </div>
                }
                @case ('DECISION_CONFIRMED') {
                  <div class="decision-info confirmed">
                    <mat-icon>verified</mat-icon>
                    <p><strong>Décision confirmée:</strong> {{ getDecisionLabel(device()!.confirmedDecision) }}</p>
                    <p><strong>Canal:</strong> {{ getChannelLabel(device()!.decisionChannel) }}</p>
                  </div>
                  <div class="action-buttons">
                    <button mat-raised-button color="primary" (click)="startExecution()" [disabled]="processing()">
                      <mat-icon>play_arrow</mat-icon>
                      Démarrer exécution
                    </button>
                  </div>
                }
                @case ('IN_EXECUTION') {
                  @if (device()!.decisionChannel === 'THIRD_PARTY') {
                    <form [formGroup]="transferForm" class="form-section">
                      <h3>Transfert vers tiers</h3>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Nom du tiers</mat-label>
                        <input matInput formControlName="thirdPartyName" required>
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Type</mat-label>
                        <mat-select formControlName="thirdPartyType" required>
                          <mat-option value="RECYCLER">Recycleur</mat-option>
                          <mat-option value="REFURBISHER">Reconditionneur</mat-option>
                          <mat-option value="CHARITY">Association</mat-option>
                        </mat-select>
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Transporteur</mat-label>
                        <input matInput formControlName="carrierName">
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>N° de suivi</mat-label>
                        <input matInput formControlName="trackingNumber">
                      </mat-form-field>
                      <div class="action-buttons">
                        <button mat-raised-button color="primary" (click)="prepareTransfer()"
                                [disabled]="transferForm.invalid || processing()">
                          <mat-icon>local_shipping</mat-icon>
                          Préparer envoi
                        </button>
                      </div>
                    </form>
                  } @else {
                    <form [formGroup]="closeForm" class="form-section">
                      <h3>Clôture interne</h3>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Valeur réalisée (EUR)</mat-label>
                        <input matInput type="number" formControlName="realizedValue">
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Notes</mat-label>
                        <textarea matInput formControlName="notes" rows="2"></textarea>
                      </mat-form-field>
                      <div class="action-buttons">
                        <button mat-raised-button color="primary" (click)="closeExecution()" [disabled]="processing()">
                          <mat-icon>check_circle</mat-icon>
                          Clôturer
                        </button>
                      </div>
                    </form>
                  }
                }
                @case ('TRANSFER_PREPARED') {
                  @if (transfer()) {
                    <div class="transfer-info">
                      <p><strong>Destinataire:</strong> {{ transfer()!.thirdPartyName }}</p>
                      <p><strong>Type:</strong> {{ transfer()!.thirdPartyType }}</p>
                      @if (transfer()!.trackingNumber) {
                        <p><strong>N° suivi:</strong> {{ transfer()!.trackingNumber }}</p>
                      }
                    </div>
                  }
                  <div class="action-buttons">
                    <button mat-raised-button color="primary" (click)="markSent()" [disabled]="processing()">
                      <mat-icon>send</mat-icon>
                      Marquer comme expédié
                    </button>
                  </div>
                }
                @case ('TRANSFER_SENT') {
                  @if (transfer()) {
                    <div class="transfer-info">
                      <p><strong>Expédié le:</strong> {{ transfer()!.sentAt | date:'dd/MM/yyyy HH:mm' }}</p>
                      @if (transfer()!.trackingNumber) {
                        <p><strong>N° suivi:</strong> {{ transfer()!.trackingNumber }}</p>
                      }
                    </div>
                  }
                  <div class="action-buttons">
                    <button mat-raised-button color="primary" (click)="markReceived()" [disabled]="processing()">
                      <mat-icon>inventory</mat-icon>
                      Confirmer réception par tiers
                    </button>
                  </div>
                }
                @case ('TRANSFER_RECEIVED') {
                  <div class="transfer-info">
                    <mat-icon>check_circle</mat-icon>
                    <p>Reçu par le tiers</p>
                  </div>
                  <div class="action-buttons">
                    <button mat-raised-button color="primary" (click)="markProcessing()" [disabled]="processing()">
                      <mat-icon>engineering</mat-icon>
                      Traitement en cours
                    </button>
                  </div>
                }
                @case ('THIRD_PARTY_PROCESSING') {
                  <form [formGroup]="proofForm" class="form-section">
                    <h3>Clôture après traitement tiers</h3>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>URL certificat/preuve</mat-label>
                      <input matInput formControlName="certificateUrl">
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Valeur réalisée (EUR)</mat-label>
                      <input matInput type="number" formControlName="realizedValue">
                    </mat-form-field>
                    <div class="action-buttons">
                      <button mat-raised-button color="primary" (click)="closeTransfer()" [disabled]="processing()">
                        <mat-icon>verified</mat-icon>
                        Clôturer avec preuve
                      </button>
                    </div>
                  </form>
                }
                @case ('CLOSED') {
                  <div class="closed-info">
                    <mat-icon>verified</mat-icon>
                    <h3>Appareil clôturé</h3>
                    <p>Clôturé le {{ device()!.closedAt | date:'dd/MM/yyyy HH:mm' }}</p>
                    <p><strong>Valeur réalisée:</strong> {{ device()!.actualValue | currency:'EUR' }}</p>
                  </div>
                }
                @case ('CANCELLED') {
                  <div class="cancelled-info">
                    <mat-icon>cancel</mat-icon>
                    <h3>Appareil annulé</h3>
                  </div>
                }
                @default {
                  <p>Statut: {{ device()!.status }}</p>
                }
              }

              @if (processing()) {
                <div class="processing-overlay">
                  <mat-spinner diameter="24"></mat-spinner>
                  <span>Traitement en cours...</span>
                </div>
              }
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Notes History Section -->
        @if (hasNotes()) {
          <mat-card class="notes-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>notes</mat-icon>
                Historique des notes
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="notes-list">
                @if (device()!.diagnosisNotes) {
                  <div class="note-item">
                    <div class="note-header">
                      <mat-icon>search</mat-icon>
                      <span class="note-type">Notes de diagnostic</span>
                      @if (device()!.diagnosedAt) {
                        <span class="note-date">{{ device()!.diagnosedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                      }
                    </div>
                    <div class="note-content">{{ device()!.diagnosisNotes }}</div>
                  </div>
                }
                @if (device()!.decisionNotes) {
                  <div class="note-item">
                    <div class="note-header">
                      <mat-icon>gavel</mat-icon>
                      <span class="note-type">Notes de décision</span>
                      @if (device()!.decisionConfirmedAt) {
                        <span class="note-date">{{ device()!.decisionConfirmedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                      } @else if (device()!.decisionDraftedAt) {
                        <span class="note-date">{{ device()!.decisionDraftedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                      }
                    </div>
                    <div class="note-content">{{ device()!.decisionNotes }}</div>
                  </div>
                }
                @if (device()!.holdReason) {
                  <div class="note-item warning">
                    <div class="note-header">
                      <mat-icon>pause_circle</mat-icon>
                      <span class="note-type">Raison mise en attente</span>
                    </div>
                    <div class="note-content">{{ device()!.holdReason }}</div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Dispute button -->
        @if (!isTerminalStatus(device()!.status) && !device()!.disputeOpen) {
          <div class="dispute-section">
            <button mat-stroked-button color="warn" (click)="showDisputeDialog()">
              <mat-icon>report_problem</mat-icon>
              Ouvrir un litige
            </button>
          </div>
        }
      } @else {
        <mat-card class="error-card">
          <mat-card-content>
            <mat-icon>error</mat-icon>
            <p>Impossible de charger les détails de l'appareil.</p>
            <button mat-button color="primary" routerLink="../">Retour à la liste</button>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .device-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;

      h1 {
        margin: 0;
        color: #1565c0;
        flex: 1;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .timeline-card {
      margin-bottom: 1.5rem;
    }

    .workflow-timeline {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
      overflow-x: auto;

      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 80px;

        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;

          mat-icon {
            color: #757575;
          }
        }

        .step-label {
          font-size: 0.75rem;
          text-align: center;
          color: #757575;
        }

        .step-time {
          font-size: 0.65rem;
          color: #9e9e9e;
        }

        &.active {
          .step-icon {
            background: #1565c0;
            mat-icon { color: white; }
          }
          .step-label { color: #1565c0; font-weight: 500; }
        }

        &.completed {
          .step-icon {
            background: #4caf50;
            mat-icon { color: white; }
          }
          .step-label { color: #4caf50; }
        }
      }

      .step-connector {
        flex: 1;
        height: 2px;
        background: #e0e0e0;
        margin: 0 0.5rem;
        margin-bottom: 2rem;

        &.completed {
          background: #4caf50;
        }
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .info-card mat-card-content {
      padding-top: 1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1rem 0;

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        &.full-width {
          grid-column: 1 / -1;
        }

        .label {
          font-size: 0.75rem;
          color: #78909c;
          text-transform: uppercase;
        }

        .value {
          font-size: 1rem;
          color: #37474f;

          &.highlight {
            color: #1565c0;
            font-weight: 500;
          }
        }
      }
    }

    mat-divider {
      margin: 1rem 0;
    }

    .actions-card {
      mat-card-content {
        padding-top: 1rem;
      }
    }

    .form-section {
      h3 {
        margin: 0 0 1rem 0;
        color: #37474f;
        font-size: 1rem;
      }

      .full-width {
        width: 100%;
      }
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1rem;

      button mat-icon {
        margin-right: 0.25rem;
      }
    }

    .hold-info, .diagnosed-info, .decision-info, .transfer-info, .closed-info, .cancelled-info {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;

      mat-icon {
        vertical-align: middle;
        margin-right: 0.5rem;
      }

      p {
        margin: 0.25rem 0;
      }
    }

    .decision-info.confirmed {
      background: #e8f5e9;
      border-left: 4px solid #4caf50;

      mat-icon {
        color: #4caf50;
      }
    }

    .closed-info {
      background: #e8f5e9;
      text-align: center;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #4caf50;
      }

      h3 {
        color: #2e7d32;
      }
    }

    .cancelled-info {
      background: #ffebee;
      text-align: center;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #f44336;
      }

      h3 {
        color: #c62828;
      }
    }

    .processing-overlay {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      margin-top: 1rem;

      span {
        color: #1565c0;
      }
    }

    .dispute-section {
      margin-top: 1.5rem;
      text-align: center;
    }

    .notes-card {
      margin-top: 1.5rem;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;

        mat-icon {
          color: #1565c0;
        }
      }
    }

    .notes-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .note-item {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 1rem;
      border-left: 4px solid #1565c0;

      &.warning {
        border-left-color: #ff9800;
        background: #fff8e1;
      }

      .note-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: #1565c0;
        }

        .note-type {
          font-weight: 500;
          color: #37474f;
          flex: 1;
        }

        .note-date {
          font-size: 0.75rem;
          color: #78909c;
        }
      }

      .note-content {
        color: #546e7a;
        font-size: 0.9rem;
        white-space: pre-wrap;
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
    }
  `]
})
export class OpsDeviceDetailComponent implements OnInit {
  deviceId!: number;
  device = signal<OpsDevice | null>(null);
  transfer = signal<ThirdPartyTransfer | null>(null);
  loading = signal(true);
  processing = signal(false);

  diagnosisForm: FormGroup;
  decisionForm: FormGroup;
  transferForm: FormGroup;
  closeForm: FormGroup;
  proofForm: FormGroup;

  workflowSteps = computed<WorkflowStep[]>(() => {
    const postRepair = this.isPostRepair();
    return [
      { label: 'Reçu', icon: 'inventory_2', statuses: ['RECEIVED', 'ON_HOLD'] },
      { label: postRepair ? 'Analyse post-réparation' : 'Analyse', icon: 'search', statuses: ['UNDER_REVIEW'] },
      { label: postRepair ? 'Diagnostic post-réparation' : 'Diagnostic', icon: 'assignment', statuses: ['DIAGNOSED'] },
      { label: postRepair ? 'Décision finale' : 'Décision', icon: 'gavel', statuses: ['DECISION_DRAFTED', 'DECISION_CONFIRMED'] },
      { label: 'Exécution', icon: 'engineering', statuses: ['IN_EXECUTION', 'TRANSFER_PREPARED', 'TRANSFER_SENT', 'TRANSFER_RECEIVED', 'THIRD_PARTY_PROCESSING'] },
      { label: 'Clôturé', icon: 'verified', statuses: ['CLOSED'] }
    ];
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private opsService: PartnerOpsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.diagnosisForm = this.fb.group({
      diagnosedCondition: [''],
      diagnosedValue: [null],
      diagnosisNotes: ['']
    });

    this.decisionForm = this.fb.group({
      outcome: ['', Validators.required],
      channel: ['INTERNAL', Validators.required],
      notes: ['']
    });

    this.transferForm = this.fb.group({
      thirdPartyName: ['', Validators.required],
      thirdPartyType: ['RECYCLER', Validators.required],
      carrierName: [''],
      trackingNumber: ['']
    });

    this.closeForm = this.fb.group({
      realizedValue: [null],
      notes: ['']
    });

    this.proofForm = this.fb.group({
      certificateUrl: [''],
      realizedValue: [null]
    });
  }

  ngOnInit(): void {
    this.deviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDevice();
  }

  loadDevice(): void {
    this.loading.set(true);
    this.opsService.getDevice(this.deviceId).subscribe({
      next: (response) => {
        if (response.success) {
          this.device.set(response.data);
          this.prefillForms(response.data);
          if (response.data.thirdPartyTransferId) {
            this.loadTransfer();
          }
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadTransfer(): void {
    this.opsService.getTransfer(this.deviceId).subscribe({
      next: (response) => {
        if (response.success) {
          this.transfer.set(response.data);
        }
      }
    });
  }

  prefillForms(device: OpsDevice): void {
    if (device.diagnosedCondition || device.diagnosedValue) {
      this.diagnosisForm.patchValue({
        diagnosedCondition: device.diagnosedCondition,
        diagnosedValue: device.diagnosedValue,
        diagnosisNotes: device.diagnosisNotes
      });
    } else {
      this.diagnosisForm.patchValue({
        diagnosedCondition: device.condition,
        diagnosedValue: device.estimatedValue
      });
    }

    this.closeForm.patchValue({
      realizedValue: device.diagnosedValue || device.estimatedValue
    });

    this.proofForm.patchValue({
      realizedValue: device.diagnosedValue || device.estimatedValue
    });
  }

  // ========== WORKFLOW ACTIONS ==========

  startReview(): void {
    this.processing.set(true);
    this.opsService.startReview(this.deviceId).subscribe({
      next: () => this.handleSuccess('Analyse démarrée'),
      error: (err) => this.handleError(err)
    });
  }

  showHoldDialog(): void {
    const reason = prompt('Raison de la mise en attente:');
    if (reason) {
      this.processing.set(true);
      this.opsService.putOnHold(this.deviceId, reason).subscribe({
        next: () => this.handleSuccess('Appareil mis en attente'),
        error: (err) => this.handleError(err)
      });
    }
  }

  resumeFromHold(): void {
    this.processing.set(true);
    this.opsService.resumeFromHold(this.deviceId).subscribe({
      next: () => this.handleSuccess('Appareil repris'),
      error: (err) => this.handleError(err)
    });
  }

  saveDiagnosis(): void {
    this.processing.set(true);
    const request: DiagnosisUpdateRequest = this.diagnosisForm.value;
    this.opsService.updateDiagnosis(this.deviceId, request).subscribe({
      next: () => this.handleSuccess('Diagnostic sauvegardé'),
      error: (err) => this.handleError(err)
    });
  }

  confirmDiagnosis(): void {
    this.processing.set(true);
    this.opsService.confirmDiagnosis(this.deviceId).subscribe({
      next: () => this.handleSuccess('Diagnostic confirmé'),
      error: (err) => this.handleError(err)
    });
  }

  undoReview(): void {
    this.processing.set(true);
    this.opsService.undoReview(this.deviceId).subscribe({
      next: () => this.handleSuccess('Analyse annulée'),
      error: (err) => this.handleError(err)
    });
  }

  reopenReview(): void {
    this.processing.set(true);
    this.opsService.reopenReview(this.deviceId).subscribe({
      next: () => this.handleSuccess('Analyse rouverte'),
      error: (err) => this.handleError(err)
    });
  }

  draftDecision(): void {
    this.processing.set(true);
    const request: DecisionDraftRequest = this.decisionForm.value;
    this.opsService.draftDecision(this.deviceId, request).subscribe({
      next: () => this.handleSuccess('Décision créée'),
      error: (err) => this.handleError(err)
    });
  }

  showEditDecisionForm(): void {
    // For now, just allow editing via the form at DIAGNOSED status
    this.opsService.reopenReview(this.deviceId).subscribe({
      next: () => {
        this.handleSuccess('Retour au diagnostic pour modification');
      },
      error: (err) => this.handleError(err)
    });
  }

  confirmDecision(): void {
    this.processing.set(true);
    this.opsService.confirmDecision(this.deviceId).subscribe({
      next: () => this.handleSuccess('Décision confirmée'),
      error: (err) => this.handleError(err)
    });
  }

  startExecution(): void {
    this.processing.set(true);
    this.opsService.startExecution(this.deviceId).subscribe({
      next: () => this.handleSuccess('Exécution démarrée'),
      error: (err) => this.handleError(err)
    });
  }

  closeExecution(): void {
    this.processing.set(true);
    const request: CloseExecutionRequest = this.closeForm.value;
    this.opsService.closeExecution(this.deviceId, request).subscribe({
      next: () => this.handleSuccess('Appareil clôturé'),
      error: (err) => this.handleError(err)
    });
  }

  prepareTransfer(): void {
    this.processing.set(true);
    const request: PrepareTransferRequest = this.transferForm.value;
    this.opsService.prepareTransfer(this.deviceId, request).subscribe({
      next: () => this.handleSuccess('Transfert préparé'),
      error: (err) => this.handleError(err)
    });
  }

  markSent(): void {
    this.processing.set(true);
    this.opsService.markTransferSent(this.deviceId, {}).subscribe({
      next: () => this.handleSuccess('Marqué comme expédié'),
      error: (err) => this.handleError(err)
    });
  }

  markReceived(): void {
    this.processing.set(true);
    this.opsService.markTransferReceived(this.deviceId, {}).subscribe({
      next: () => this.handleSuccess('Réception confirmée'),
      error: (err) => this.handleError(err)
    });
  }

  markProcessing(): void {
    this.processing.set(true);
    this.opsService.markThirdPartyProcessing(this.deviceId).subscribe({
      next: () => this.handleSuccess('Traitement en cours'),
      error: (err) => this.handleError(err)
    });
  }

  closeTransfer(): void {
    this.processing.set(true);
    this.opsService.closeTransfer(this.deviceId, this.proofForm.value).subscribe({
      next: () => this.handleSuccess('Appareil clôturé avec preuve'),
      error: (err) => this.handleError(err)
    });
  }

  showDisputeDialog(): void {
    const summary = prompt('Résumé du litige:');
    if (summary) {
      this.processing.set(true);
      this.opsService.openDispute(this.deviceId, {
        type: 'OTHER',
        priority: 'MEDIUM',
        summary
      }).subscribe({
        next: () => this.handleSuccess('Litige ouvert'),
        error: (err) => this.handleError(err)
      });
    }
  }

  // ========== HELPERS ==========

  private handleSuccess(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000 });
    this.processing.set(false);
    this.loadDevice();
  }

  private handleError(err: any): void {
    const message = err.error?.message || 'Une erreur est survenue';
    this.snackBar.open(message, 'OK', { duration: 5000 });
    this.processing.set(false);
  }

  isStepActive(step: WorkflowStep): boolean {
    const device = this.device();
    return device ? step.statuses.includes(device.status) : false;
  }

  isStepCompleted(step: WorkflowStep, index: number): boolean {
    const device = this.device();
    if (!device) return false;

    const currentIndex = this.workflowSteps().findIndex(s => s.statuses.includes(device.status));
    return index < currentIndex;
  }

  getStepTimestamp(step: WorkflowStep): string | undefined {
    const device = this.device();
    if (!device) return undefined;

    if (step.statuses.includes('RECEIVED')) return device.receivedAt;
    if (step.statuses.includes('UNDER_REVIEW')) return device.reviewStartedAt;
    if (step.statuses.includes('DIAGNOSED')) return device.diagnosedAt;
    if (step.statuses.includes('DECISION_DRAFTED')) return device.decisionDraftedAt;
    if (step.statuses.includes('IN_EXECUTION')) return device.executionStartedAt;
    if (step.statuses.includes('CLOSED')) return device.closedAt;

    return undefined;
  }

  isTerminalStatus(status: DeviceStatus): boolean {
    return status === 'CLOSED' || status === 'CANCELLED';
  }

  hasNotes(): boolean {
    const device = this.device();
    return device ? !!(device.diagnosisNotes || device.decisionNotes || device.holdReason) : false;
  }

  isPostRepair(): boolean {
    const device = this.device();
    return device?.diagnosisNotes?.includes('[Réparation effectuée]') ?? false;
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'ON_HOLD':
      case 'CANCELLED':
        return 'warn';
      case 'CLOSED':
        return 'primary';
      default:
        return 'accent';
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'REGISTERED': 'Enregistré',
      'COLLECTED': 'Collecté',
      'DROPPED': 'Déposé',
      'RECEIVED': 'Reçu',
      'ON_HOLD': 'En attente',
      'UNDER_REVIEW': 'En analyse',
      'DIAGNOSED': 'Diagnostiqué',
      'DECISION_DRAFTED': 'Décision brouillon',
      'DECISION_CONFIRMED': 'Décision confirmée',
      'IN_EXECUTION': 'En exécution',
      'TRANSFER_PREPARED': 'Transfert préparé',
      'TRANSFER_SENT': 'Expédié',
      'TRANSFER_RECEIVED': 'Reçu par tiers',
      'THIRD_PARTY_PROCESSING': 'Traitement tiers',
      'CLOSED': 'Clôturé',
      'CANCELLED': 'Annulé',
      'FINALIZED': 'Finalisé'
    };
    return labels[status] || status;
  }

  getConditionLabel(condition: string): string {
    const labels: Record<string, string> = {
      'NEW': 'Neuf',
      'LIKE_NEW': 'Comme neuf',
      'GOOD': 'Bon état',
      'FAIR': 'État correct',
      'POOR': 'Mauvais état',
      'FOR_PARTS': 'Pour pièces'
    };
    return labels[condition] || condition || 'N/A';
  }

  getDecisionLabel(decision: string): string {
    const labels: Record<string, string> = {
      'REEMPLOI_REVENTE': 'Réemploi / Revente',
      'REPARATION': 'Réparation',
      'MPIR_RECYCLE': 'Recyclage MPIR',
      'DESTRUCTION_SANS_VALEUR': 'Destruction sans valeur'
    };
    return labels[decision] || decision || 'N/A';
  }

  getChannelLabel(channel: string): string {
    const labels: Record<string, string> = {
      'INTERNAL': 'Interne',
      'MARKETPLACE': 'Marketplace',
      'PARTNER': 'Partenaire',
      'DONATION': 'Don',
      'THIRD_PARTY': 'Tiers'
    };
    return labels[channel] || channel || 'N/A';
  }
}
