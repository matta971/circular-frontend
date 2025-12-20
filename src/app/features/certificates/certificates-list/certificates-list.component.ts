import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CertificateService } from '../../../core/services';
import { Certificate, CertificateType, CertificateStatus } from '../../../core/models';

@Component({
  selector: 'app-certificates-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="certificates-container">
      <header>
        <div>
          <h1>Mes certificats</h1>
          <p>Consultez vos certificats de recyclage, don et traçabilité</p>
        </div>
        <a mat-stroked-button routerLink="/certificates/verify">
          <mat-icon>verified</mat-icon>
          Vérifier un certificat
        </a>
      </header>

      @if (loading) {
        <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
      } @else if (certificates.length === 0) {
        <div class="empty-state">
          <mat-icon>workspace_premium</mat-icon>
          <h3>Aucun certificat</h3>
          <p>Vos certificats apparaîtront ici après le traitement de vos appareils</p>
        </div>
      } @else {
        <mat-tab-group>
          <mat-tab label="Tous ({{ certificates.length }})">
            <ng-container *ngTemplateOutlet="certificatesGrid; context: { certs: certificates }"></ng-container>
          </mat-tab>
          <mat-tab label="Recyclage ({{ getByType('RECYCLING').length }})">
            <ng-container *ngTemplateOutlet="certificatesGrid; context: { certs: getByType('RECYCLING') }"></ng-container>
          </mat-tab>
          <mat-tab label="Don ({{ getByType('DONATION').length }})">
            <ng-container *ngTemplateOutlet="certificatesGrid; context: { certs: getByType('DONATION') }"></ng-container>
          </mat-tab>
          <mat-tab label="Traçabilité ({{ getByType('TRACEABILITY').length }})">
            <ng-container *ngTemplateOutlet="certificatesGrid; context: { certs: getByType('TRACEABILITY') }"></ng-container>
          </mat-tab>
        </mat-tab-group>
      }

      <ng-template #certificatesGrid let-certs="certs">
        <div class="certificates-grid">
          @for (cert of certs; track cert.id) {
            <mat-card class="certificate-card" [routerLink]="['/certificates', cert.certificateNumber]">
              <div class="certificate-header" [class]="cert.type.toLowerCase()">
                <mat-icon>{{ getTypeIcon(cert.type) }}</mat-icon>
                <span>{{ getTypeLabel(cert.type) }}</span>
              </div>
              <mat-card-content>
                <div class="certificate-number">
                  <span class="label">N° Certificat</span>
                  <span class="value">{{ cert.certificateNumber }}</span>
                </div>
                <div class="certificate-device" *ngIf="cert.device">
                  <mat-icon>smartphone</mat-icon>
                  <span>{{ cert.device.brand }} {{ cert.device.model }}</span>
                </div>
                <div class="certificate-date">
                  <mat-icon>event</mat-icon>
                  <span>{{ cert.issuedAt | date:'dd/MM/yyyy' }}</span>
                </div>
                <mat-chip-set>
                  <mat-chip [class]="cert.status.toLowerCase()">
                    {{ getStatusLabel(cert.status) }}
                  </mat-chip>
                  @if (cert.blockchainHash) {
                    <mat-chip color="primary">
                      <mat-icon>verified</mat-icon> Blockchain
                    </mat-chip>
                  }
                </mat-chip-set>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button color="primary">
                  <mat-icon>visibility</mat-icon> Voir
                </button>
                <button mat-button (click)="downloadPdf($event, cert)">
                  <mat-icon>download</mat-icon> PDF
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .certificates-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    header h1 { margin: 0; }
    header p { color: #666; margin: 4px 0 0 0; }
    .certificates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; padding: 24px 0; }
    .certificate-card { cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .certificate-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .certificate-header { display: flex; align-items: center; gap: 12px; padding: 16px; color: white; }
    .certificate-header.recycling { background: linear-gradient(135deg, #4caf50, #2e7d32); }
    .certificate-header.donation { background: linear-gradient(135deg, #2196f3, #1565c0); }
    .certificate-header.refurbishment { background: linear-gradient(135deg, #ff9800, #ef6c00); }
    .certificate-header.destruction { background: linear-gradient(135deg, #f44336, #c62828); }
    .certificate-header.traceability { background: linear-gradient(135deg, #9c27b0, #6a1b9a); }
    .certificate-header mat-icon { font-size: 28px; width: 28px; height: 28px; }
    .certificate-header span { font-weight: 500; font-size: 1.1rem; }
    .certificate-number { margin-bottom: 12px; }
    .certificate-number .label { font-size: 0.75rem; color: #666; display: block; }
    .certificate-number .value { font-family: monospace; font-size: 1rem; font-weight: 500; }
    .certificate-device, .certificate-date { display: flex; align-items: center; gap: 8px; color: #666; margin-bottom: 8px; }
    .certificate-device mat-icon, .certificate-date mat-icon { font-size: 18px; width: 18px; height: 18px; }
    mat-chip.issued { background: #4caf50 !important; color: white !important; }
    mat-chip.verified { background: #2196f3 !important; color: white !important; }
    mat-chip.draft { background: #9e9e9e !important; color: white !important; }
    mat-chip.revoked { background: #f44336 !important; color: white !important; }
    mat-chip.expired { background: #ff9800 !important; color: white !important; }
    .loading, .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; text-align: center; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; margin-bottom: 16px; }
  `]
})
export class CertificatesListComponent implements OnInit {
  certificates: Certificate[] = [];
  loading = true;

  constructor(private certificateService: CertificateService) {}

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.certificateService.getMyCertificates().subscribe({
      next: (certs) => { this.certificates = certs; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getByType(type: string): Certificate[] {
    return this.certificates.filter(c => c.type === type);
  }

  downloadPdf(event: Event, cert: Certificate): void {
    event.stopPropagation();
    this.certificateService.downloadCertificatePdf(cert.certificateNumber).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificat-${cert.certificateNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  getTypeIcon(type: CertificateType | string): string {
    const icons: Record<string, string> = {
      RECYCLING: 'recycling', DONATION: 'volunteer_activism',
      REFURBISHMENT: 'build', DESTRUCTION: 'delete_forever', TRACEABILITY: 'timeline'
    };
    return icons[type] || 'description';
  }

  getTypeLabel(type: CertificateType | string): string {
    const labels: Record<string, string> = {
      RECYCLING: 'Recyclage', DONATION: 'Don',
      REFURBISHMENT: 'Reconditionnement', DESTRUCTION: 'Destruction', TRACEABILITY: 'Traçabilité'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: CertificateStatus | string): string {
    const labels: Record<string, string> = {
      DRAFT: 'Brouillon', ISSUED: 'Émis', VERIFIED: 'Vérifié', REVOKED: 'Révoqué', EXPIRED: 'Expiré'
    };
    return labels[status] || status;
  }
}
