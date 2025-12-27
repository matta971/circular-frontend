import { Component, OnInit, signal } from '@angular/core';
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
import { PartnerOpsService } from '../services/partner-ops.service';
import { OpsDevice, FinalizeDeviceRequest } from '../models/partner-ops.model';

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
    MatDividerModule
  ],
  template: `
    <div class="device-detail-container">
      <div class="header">
        <button mat-icon-button routerLink="../">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Appareil #{{ deviceId }}</h1>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (device()) {
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
                  <span class="label">État</span>
                  <span class="value">
                    <mat-chip>{{ device()!.condition || 'N/A' }}</mat-chip>
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">Statut</span>
                  <span class="value">
                    <mat-chip [color]="getStatusColor(device()!.status)" [highlighted]="true">
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
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Finalization card -->
          @if (device()!.status !== 'FINALIZED') {
            <mat-card class="finalization-card">
              <mat-card-header>
                <mat-card-title>Finalisation</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="finalizationForm" (ngSubmit)="submitFinalization()">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Décision</mat-label>
                    <mat-select formControlName="outcome" required>
                      <mat-option value="REUSE">Réemploi</mat-option>
                      <mat-option value="REPAIR">Réparation</mat-option>
                      <mat-option value="RECYCLE">Recyclage</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Valeur réalisée (EUR)</mat-label>
                    <input matInput type="number" formControlName="realizedValueEur" required>
                    <mat-hint>Valeur effectivement obtenue</mat-hint>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Canal</mat-label>
                    <mat-select formControlName="channel">
                      <mat-option value="INTERNAL">Interne</mat-option>
                      <mat-option value="MARKETPLACE">Marketplace</mat-option>
                      <mat-option value="PARTNER">Partenaire</mat-option>
                      <mat-option value="DONATION">Don</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Détails / Notes</mat-label>
                    <textarea matInput formControlName="details" rows="3"></textarea>
                  </mat-form-field>

                  <button mat-raised-button color="primary" type="submit"
                          [disabled]="finalizationForm.invalid || finalizing()">
                    @if (finalizing()) {
                      <mat-spinner diameter="20"></mat-spinner>
                    } @else {
                      <mat-icon>check_circle</mat-icon>
                      Finaliser l'appareil
                    }
                  </button>
                </form>
              </mat-card-content>
            </mat-card>
          } @else {
            <mat-card class="finalized-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>verified</mat-icon>
                  Appareil finalisé
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Cet appareil a été finalisé le {{ device()!.finalizedAt | date:'dd/MM/yyyy HH:mm' }}.</p>
                <p>Valeur réelle : <strong>{{ device()!.actualValue | currency:'EUR' }}</strong></p>
              </mat-card-content>
            </mat-card>
          }
        </div>
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
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;

      h1 {
        margin: 0;
        color: #1565c0;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .content-grid {
      display: grid;
      gap: 1.5rem;
    }

    .info-card {
      mat-card-content {
        padding-top: 1rem;
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
          letter-spacing: 0.05em;
        }

        .value {
          font-size: 1rem;
          color: #37474f;
        }
      }
    }

    mat-divider {
      margin: 1rem 0;
    }

    .finalization-card {
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-top: 1rem;
      }

      .full-width {
        width: 100%;
      }

      button {
        align-self: flex-start;

        mat-icon {
          margin-right: 0.5rem;
        }

        mat-spinner {
          display: inline-block;
        }
      }
    }

    .finalized-card {
      background: #e8f5e9;
      border-left: 4px solid #4caf50;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #2e7d32;
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
  loading = signal(true);
  finalizing = signal(false);

  finalizationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private opsService: PartnerOpsService,
    private snackBar: MatSnackBar
  ) {
    this.finalizationForm = this.fb.group({
      outcome: ['', Validators.required],
      realizedValueEur: [0, [Validators.required, Validators.min(0)]],
      channel: ['INTERNAL'],
      details: ['']
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
          // Pre-fill with estimated value
          if (response.data.estimatedValue) {
            this.finalizationForm.patchValue({
              realizedValueEur: response.data.estimatedValue
            });
          }
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  submitFinalization(): void {
    if (this.finalizationForm.invalid) return;

    this.finalizing.set(true);
    const request: FinalizeDeviceRequest = this.finalizationForm.value;

    this.opsService.finalizeDevice(this.deviceId, request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Appareil finalisé avec succès', 'OK', { duration: 3000 });
          this.loadDevice(); // Reload to show finalized state
        }
        this.finalizing.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la finalisation', 'OK', { duration: 3000 });
        this.finalizing.set(false);
      }
    });
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'RECEIVED': return 'accent';
      case 'DIAGNOSED': return 'primary';
      case 'FINALIZED': return 'primary';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'REGISTERED': return 'Enregistré';
      case 'COLLECTED': return 'Collecté';
      case 'DROPPED': return 'Déposé';
      case 'RECEIVED': return 'Reçu';
      case 'DIAGNOSED': return 'Diagnostiqué';
      case 'FINALIZED': return 'Finalisé';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  }
}
