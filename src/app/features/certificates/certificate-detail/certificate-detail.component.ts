import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CertificateService } from '../../../core/services';
import { Certificate, CertificateType, DeviceTraceability, TraceabilityEvent } from '../../../core/models';

@Component({
  selector: 'app-certificate-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    @if (loading) {
      <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
    } @else if (!certificate) {
      <div class="error">
        <mat-icon>error</mat-icon>
        <h2>Certificat introuvable</h2>
        <a mat-raised-button routerLink="/certificates">Retour</a>
      </div>
    } @else {
      <div class="certificate-detail">
        <mat-card class="main-card">
          <div class="certificate-banner" [class]="certificate.type.toLowerCase()">
            <mat-icon>{{ getTypeIcon(certificate.type) }}</mat-icon>
            <div>
              <h1>Certificat de {{ getTypeLabel(certificate.type) }}</h1>
              <span class="cert-number">{{ certificate.certificateNumber }}</span>
            </div>
          </div>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Statut</span>
                <mat-chip [class]="certificate.status.toLowerCase()">
                  {{ getStatusLabel(certificate.status) }}
                </mat-chip>
              </div>
              <div class="info-item">
                <span class="label">Date d'émission</span>
                <span class="value">{{ certificate.issuedAt | date:'dd MMMM yyyy' }}</span>
              </div>
              @if (certificate.expiresAt) {
                <div class="info-item">
                  <span class="label">Date d'expiration</span>
                  <span class="value">{{ certificate.expiresAt | date:'dd MMMM yyyy' }}</span>
                </div>
              }
              @if (certificate.blockchainHash) {
                <div class="info-item full">
                  <span class="label">Hash blockchain</span>
                  <span class="value mono">{{ certificate.blockchainHash }}</span>
                </div>
              }
            </div>

            @if (certificate.device) {
              <mat-divider></mat-divider>
              <h3>Appareil concerné</h3>
              <div class="device-info">
                <mat-icon>smartphone</mat-icon>
                <div>
                  <strong>{{ certificate.device.brand }} {{ certificate.device.model }}</strong>
                  <span *ngIf="certificate.device.serialNumber">S/N: {{ certificate.device.serialNumber }}</span>
                </div>
              </div>
            }

            @if (certificate.metadata?.environmentalImpact) {
              <mat-divider></mat-divider>
              <h3>Impact environnemental</h3>
              <div class="impact-grid">
                <div class="impact-item">
                  <mat-icon>eco</mat-icon>
                  <div>
                    <span class="value">{{ certificate.metadata!.environmentalImpact!.co2SavedKg }} kg</span>
                    <span class="label">CO₂ évité</span>
                  </div>
                </div>
                @if (certificate.metadata!.environmentalImpact!.waterSavedLiters) {
                  <div class="impact-item">
                    <mat-icon>water_drop</mat-icon>
                    <div>
                      <span class="value">{{ certificate.metadata!.environmentalImpact!.waterSavedLiters }} L</span>
                      <span class="label">Eau économisée</span>
                    </div>
                  </div>
                }
                @if (certificate.metadata!.environmentalImpact!.energySavedKwh) {
                  <div class="impact-item">
                    <mat-icon>bolt</mat-icon>
                    <div>
                      <span class="value">{{ certificate.metadata!.environmentalImpact!.energySavedKwh }} kWh</span>
                      <span class="label">Énergie économisée</span>
                    </div>
                  </div>
                }
              </div>
            }
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="downloadPdf()">
              <mat-icon>download</mat-icon> Télécharger le PDF
            </button>
            <button mat-stroked-button (click)="share()">
              <mat-icon>share</mat-icon> Partager
            </button>
          </mat-card-actions>
        </mat-card>

        @if (traceability && traceability.events.length > 0) {
          <mat-card class="timeline-card">
            <mat-card-header>
              <mat-card-title>Historique de traçabilité</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="timeline">
                @for (event of traceability.events; track event.id) {
                  <div class="timeline-item">
                    <div class="timeline-marker">
                      <mat-icon>{{ getEventIcon(event.eventType) }}</mat-icon>
                    </div>
                    <div class="timeline-content">
                      <strong>{{ getEventLabel(event.eventType) }}</strong>
                      <p>{{ event.description }}</p>
                      <div class="timeline-meta">
                        <span><mat-icon>schedule</mat-icon> {{ event.timestamp | date:'dd/MM/yyyy HH:mm' }}</span>
                        @if (event.location) {
                          <span><mat-icon>location_on</mat-icon> {{ event.location }}</span>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    }
  `,
  styles: [`
    .certificate-detail { padding: 24px; max-width: 900px; margin: 0 auto; }
    .main-card { margin-bottom: 24px; overflow: hidden; }
    .certificate-banner { display: flex; align-items: center; gap: 16px; padding: 24px; color: white; }
    .certificate-banner.recycling { background: linear-gradient(135deg, #4caf50, #2e7d32); }
    .certificate-banner.donation { background: linear-gradient(135deg, #2196f3, #1565c0); }
    .certificate-banner.refurbishment { background: linear-gradient(135deg, #ff9800, #ef6c00); }
    .certificate-banner.destruction { background: linear-gradient(135deg, #f44336, #c62828); }
    .certificate-banner.traceability { background: linear-gradient(135deg, #9c27b0, #6a1b9a); }
    .certificate-banner mat-icon { font-size: 48px; width: 48px; height: 48px; }
    .certificate-banner h1 { margin: 0; font-size: 1.5rem; }
    .cert-number { font-family: monospace; opacity: 0.9; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 16px 0; }
    .info-item { display: flex; flex-direction: column; }
    .info-item.full { grid-column: 1 / -1; }
    .info-item .label { font-size: 0.75rem; color: #666; margin-bottom: 4px; }
    .info-item .value { font-weight: 500; }
    .info-item .mono { font-family: monospace; font-size: 0.875rem; word-break: break-all; }
    h3 { margin: 16px 0 12px 0; }
    .device-info { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f5f5f5; border-radius: 8px; }
    .device-info mat-icon { color: #666; }
    .device-info span { color: #666; font-size: 0.875rem; display: block; }
    .impact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .impact-item { display: flex; align-items: center; gap: 12px; padding: 16px; background: #e8f5e9; border-radius: 8px; }
    .impact-item mat-icon { color: #4caf50; font-size: 32px; width: 32px; height: 32px; }
    .impact-item .value { font-size: 1.25rem; font-weight: bold; display: block; }
    .impact-item .label { font-size: 0.75rem; color: #666; }
    mat-chip.issued { background: #4caf50 !important; color: white !important; }
    mat-chip.verified { background: #2196f3 !important; color: white !important; }
    mat-chip.draft { background: #9e9e9e !important; color: white !important; }
    .timeline { position: relative; padding-left: 32px; }
    .timeline::before { content: ''; position: absolute; left: 11px; top: 0; bottom: 0; width: 2px; background: #e0e0e0; }
    .timeline-item { position: relative; padding-bottom: 24px; }
    .timeline-marker { position: absolute; left: -32px; width: 24px; height: 24px; background: white; border: 2px solid #1976d2; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .timeline-marker mat-icon { font-size: 14px; width: 14px; height: 14px; color: #1976d2; }
    .timeline-content strong { display: block; margin-bottom: 4px; }
    .timeline-content p { color: #666; margin: 0 0 8px 0; }
    .timeline-meta { display: flex; gap: 16px; font-size: 0.75rem; color: #999; }
    .timeline-meta span { display: flex; align-items: center; gap: 4px; }
    .timeline-meta mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .loading, .error { display: flex; flex-direction: column; align-items: center; padding: 64px; text-align: center; }
    .error mat-icon { font-size: 64px; width: 64px; height: 64px; color: #f44336; margin-bottom: 16px; }
  `]
})
export class CertificateDetailComponent implements OnInit {
  certificate: Certificate | null = null;
  traceability: DeviceTraceability | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    const certNumber = this.route.snapshot.paramMap.get('certificateNumber');
    if (certNumber) this.loadCertificate(certNumber);
  }

  loadCertificate(certNumber: string): void {
    this.certificateService.getCertificate(certNumber).subscribe({
      next: (cert) => {
        this.certificate = cert;
        if (cert?.deviceId) {
          this.certificateService.getDeviceTraceability(cert.deviceId).subscribe({
            next: (trace) => { this.traceability = trace; }
          });
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  downloadPdf(): void {
    if (!this.certificate) return;
    this.certificateService.downloadCertificatePdf(this.certificate.certificateNumber).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificat-${this.certificate!.certificateNumber}.pdf`;
        a.click();
      }
    });
  }

  share(): void {
    if (navigator.share && this.certificate) {
      navigator.share({
        title: `Certificat ${this.certificate.certificateNumber}`,
        url: window.location.href
      });
    }
  }

  getTypeIcon(type: CertificateType | string): string {
    const icons: Record<string, string> = { RECYCLING: 'recycling', DONATION: 'volunteer_activism', REFURBISHMENT: 'build', DESTRUCTION: 'delete_forever', TRACEABILITY: 'timeline' };
    return icons[type] || 'description';
  }

  getTypeLabel(type: CertificateType | string): string {
    const labels: Record<string, string> = { RECYCLING: 'Recyclage', DONATION: 'Don', REFURBISHMENT: 'Reconditionnement', DESTRUCTION: 'Destruction', TRACEABILITY: 'Traçabilité' };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = { DRAFT: 'Brouillon', ISSUED: 'Émis', VERIFIED: 'Vérifié', REVOKED: 'Révoqué', EXPIRED: 'Expiré' };
    return labels[status] || status;
  }

  getEventIcon(type: string): string {
    const icons: Record<string, string> = { COLLECTION: 'local_shipping', DROPOFF: 'store', RECEPTION: 'inventory', DIAGNOSTIC: 'search', REFURBISHMENT: 'build', QUALITY_CHECK: 'verified', LISTING: 'storefront', SALE: 'shopping_cart', SHIPPING: 'local_shipping', DELIVERY: 'check_circle', RECYCLING: 'recycling', DONATION: 'volunteer_activism', DESTRUCTION: 'delete_forever' };
    return icons[type] || 'fiber_manual_record';
  }

  getEventLabel(type: string): string {
    const labels: Record<string, string> = { COLLECTION: 'Collecte', DROPOFF: 'Dépôt', RECEPTION: 'Réception', DIAGNOSTIC: 'Diagnostic', REFURBISHMENT: 'Reconditionnement', QUALITY_CHECK: 'Contrôle qualité', LISTING: 'Mise en vente', SALE: 'Vente', SHIPPING: 'Expédition', DELIVERY: 'Livraison', RECYCLING: 'Recyclage', DONATION: 'Don', DESTRUCTION: 'Destruction' };
    return labels[type] || type;
  }
}
