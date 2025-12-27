import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

interface Certificate {
  id: number;
  deviceId: number;
  type: string;
  status: string;
  generatedAt: string;
  downloadUrl: string;
}

@Component({
  selector: 'app-ops-certificates',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="certificates-container">
      <h1>Certificats & Preuves</h1>
      <p class="subtitle">Certificats de traitement et attestations de conformité</p>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (certificates().length === 0) {
        <mat-card class="empty-state">
          <mat-card-content>
            <mat-icon>verified</mat-icon>
            <h3>Aucun certificat</h3>
            <p>Les certificats sont générés automatiquement lors de la finalisation des appareils.</p>
          </mat-card-content>
        </mat-card>
      } @else {
        <table mat-table [dataSource]="certificates()" class="mat-elevation-z2">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let c">#{{ c.id }}</td>
          </ng-container>

          <ng-container matColumnDef="deviceId">
            <th mat-header-cell *matHeaderCellDef>Appareil</th>
            <td mat-cell *matCellDef="let c">#{{ c.deviceId }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let c">
              <mat-chip>{{ getTypeLabel(c.type) }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let c">
              <mat-chip [color]="c.status === 'VALID' ? 'primary' : 'warn'" [highlighted]="true">
                {{ c.status === 'VALID' ? 'Valide' : 'Invalide' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="generatedAt">
            <th mat-header-cell *matHeaderCellDef>Généré le</th>
            <td mat-cell *matCellDef="let c">{{ c.generatedAt | date:'dd/MM/yyyy HH:mm' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let c">
              <button mat-icon-button color="primary" (click)="downloadCertificate(c)">
                <mat-icon>download</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      }

      <!-- Info card -->
      <mat-card class="info-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>info</mat-icon>
          <mat-card-title>À propos des certificats</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Les certificats sont générés automatiquement lors de la finalisation d'un appareil et incluent :</p>
          <ul>
            <li><strong>Certificat de traitement</strong> : Preuve de la décision prise (réemploi, réparation, recyclage)</li>
            <li><strong>Bordereau de suivi</strong> : Traçabilité du parcours de l'appareil</li>
            <li><strong>Attestation REP</strong> : Conformité réglementaire</li>
          </ul>
          <p>Tous les certificats sont horodatés et signés numériquement pour garantir leur authenticité.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .certificates-container {
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
        color: #78909c;
      }

      h3 {
        margin: 1rem 0 0.5rem;
        color: #37474f;
      }

      p {
        color: #78909c;
      }
    }

    table {
      width: 100%;
      margin-bottom: 2rem;
    }

    .info-card {
      margin-top: 2rem;
      background: #e3f2fd;
      border-left: 4px solid #1565c0;

      mat-icon[mat-card-avatar] {
        color: #1565c0;
        background: none;
      }

      mat-card-content {
        padding-top: 1rem;

        ul {
          margin: 1rem 0;
          padding-left: 1.5rem;

          li {
            margin-bottom: 0.5rem;
          }
        }
      }
    }
  `]
})
export class OpsCertificatesComponent implements OnInit {
  certificates = signal<Certificate[]>([]);
  loading = signal(true);

  displayedColumns = ['id', 'deviceId', 'type', 'status', 'generatedAt', 'actions'];

  ngOnInit(): void {
    // TODO: Load certificates from API
    // For now, show empty state
    this.loading.set(false);
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'TREATMENT': return 'Traitement';
      case 'TRACKING': return 'Suivi';
      case 'REP': return 'REP';
      default: return type;
    }
  }

  downloadCertificate(certificate: Certificate): void {
    if (certificate.downloadUrl) {
      window.open(certificate.downloadUrl, '_blank');
    }
  }
}
