import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { PartnerOpsService } from '../services/partner-ops.service';
import { OpsDevice } from '../models/partner-ops.model';

@Component({
  selector: 'app-ops-finalization',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="finalization-container">
      <h1>Appareils à finaliser</h1>
      <p class="subtitle">Appareils reçus en attente de décision (réemploi, réparation, recyclage)</p>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (devices().length === 0) {
        <mat-card class="empty-state">
          <mat-card-content>
            <mat-icon>check_circle</mat-icon>
            <h3>Aucun appareil en attente</h3>
            <p>Tous les appareils ont été finalisés.</p>
            <button mat-raised-button color="primary" routerLink="../devices">
              Voir tous les appareils
            </button>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="devices-grid">
          @for (device of devices(); track device.id) {
            <mat-card class="device-card" [routerLink]="['/ops/devices', device.id]">
              <mat-card-header>
                <mat-card-title>{{ device.brand }} {{ device.model }}</mat-card-title>
                <mat-card-subtitle>{{ device.type }} - #{{ device.id }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="device-info">
                  <div class="info-row">
                    <span class="label">État :</span>
                    <mat-chip>{{ device.condition || 'N/A' }}</mat-chip>
                  </div>
                  <div class="info-row">
                    <span class="label">Valeur estimée :</span>
                    <span class="value">{{ device.estimatedValue | currency:'EUR' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Reçu le :</span>
                    <span class="value">{{ device.receivedAt | date:'dd/MM/yyyy' }}</span>
                  </div>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" [routerLink]="['/ops/devices', device.id]">
                  <mat-icon>check_circle</mat-icon>
                  Finaliser
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .finalization-container {
      max-width: 1200px;
      margin: 0 auto;

      h1 {
        margin-bottom: 0.5rem;
        color: #1565c0;
      }

      .subtitle {
        color: #78909c;
        margin-bottom: 1.5rem;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #4caf50;
      }

      h3 {
        margin: 1rem 0 0.5rem;
        color: #37474f;
      }

      p {
        color: #78909c;
        margin-bottom: 1.5rem;
      }
    }

    .devices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .device-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      .device-info {
        padding: 1rem 0;

        .info-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;

          .label {
            color: #78909c;
            font-size: 0.875rem;
          }

          .value {
            font-weight: 500;
          }
        }
      }

      mat-card-actions {
        padding: 1rem;

        button {
          width: 100%;

          mat-icon {
            margin-right: 0.5rem;
          }
        }
      }
    }
  `]
})
export class OpsFinalizationComponent implements OnInit {
  devices = signal<OpsDevice[]>([]);
  loading = signal(true);

  constructor(private opsService: PartnerOpsService) {}

  ngOnInit(): void {
    this.loadPendingDevices();
  }

  loadPendingDevices(): void {
    this.loading.set(true);
    this.opsService.getDevicesPending().subscribe({
      next: (response) => {
        if (response.success) {
          this.devices.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
