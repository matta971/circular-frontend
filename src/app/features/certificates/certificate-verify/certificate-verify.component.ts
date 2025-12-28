import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CertificateService } from '../../../core/services';
import { CertificateVerification } from '../../../core/models';

@Component({
  selector: 'app-certificate-verify',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="verify-container">
      <mat-card class="verify-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>verified</mat-icon>
          <mat-card-title>Vérifier un certificat</mat-card-title>
          <mat-card-subtitle>Entrez le numéro de certificat pour vérifier son authenticité</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Numéro de certificat</mat-label>
            <input matInput [(ngModel)]="certificateNumber" placeholder="CERT-XXXX-XXXX-XXXX"
              (keyup.enter)="verify()">
            <mat-icon matSuffix>qr_code</mat-icon>
          </mat-form-field>

          @if (verifying) {
            <div class="verifying">
              <mat-spinner diameter="32"></mat-spinner>
              <span>Vérification en cours...</span>
            </div>
          }

          @if (result) {
            <div class="result" [class.valid]="result.valid" [class.invalid]="!result.valid">
              <mat-icon>{{ result.valid ? 'check_circle' : 'cancel' }}</mat-icon>
              <div class="result-content">
                <h3>{{ result.valid ? 'Certificat valide' : 'Certificat invalide' }}</h3>
                <p>{{ result.message }}</p>
                @if (result.valid && result.certificate) {
                  <div class="certificate-summary">
                    <p><strong>Type:</strong> {{ getTypeLabel(result.certificate.type) }}</p>
                    <p><strong>Émis le:</strong> {{ result.certificate.issuedAt | date:'dd/MM/yyyy' }}</p>
                    @if (result.blockchainVerified) {
                      <p class="blockchain">
                        <mat-icon>verified</mat-icon>
                        Vérifié sur blockchain
                      </p>
                    }
                  </div>
                  <a mat-stroked-button color="primary" [routerLink]="['/certificates', result.certificate.certificateNumber]">
                    Voir le certificat complet
                  </a>
                }
              </div>
            </div>
          }
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="verify()" [disabled]="!certificateNumber || verifying">
            <mat-icon>search</mat-icon>
            Vérifier
          </button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="info-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>help_outline</mat-icon>
          <mat-card-title>Comment ça marche ?</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="info-step">
            <span class="step-number">1</span>
            <div>
              <strong>Trouvez le numéro</strong>
              <p>Le numéro de certificat se trouve sur le document PDF ou via le QR code</p>
            </div>
          </div>
          <div class="info-step">
            <span class="step-number">2</span>
            <div>
              <strong>Entrez le numéro</strong>
              <p>Saisissez le numéro complet dans le champ ci-dessus</p>
            </div>
          </div>
          <div class="info-step">
            <span class="step-number">3</span>
            <div>
              <strong>Vérification instantanée</strong>
              <p>Notre système vérifie l'authenticité du certificat en temps réel</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .verify-container { padding: 24px; max-width: 600px; margin: 0 auto; }
    .verify-card { margin-bottom: 24px; }
    .verify-card mat-card-header mat-icon { font-size: 40px; width: 40px; height: 40px; color: #1976d2; }
    .full-width { width: 100%; }
    .verifying { display: flex; align-items: center; gap: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px; }
    .result { display: flex; gap: 16px; padding: 16px; border-radius: 8px; margin-top: 16px; }
    .result.valid { background: #e8f5e9; }
    .result.invalid { background: #ffebee; }
    .result mat-icon { font-size: 48px; width: 48px; height: 48px; }
    .result.valid mat-icon { color: #4caf50; }
    .result.invalid mat-icon { color: #f44336; }
    .result-content h3 { margin: 0 0 8px 0; }
    .result-content p { margin: 0 0 8px 0; color: #666; }
    .certificate-summary { background: rgba(255,255,255,0.7); padding: 12px; border-radius: 8px; margin: 12px 0; }
    .certificate-summary p { margin: 4px 0; }
    .blockchain { display: flex; align-items: center; gap: 4px; color: #1976d2; }
    .blockchain mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .info-card mat-card-header mat-icon { color: #666; }
    .info-step { display: flex; gap: 16px; padding: 12px 0; border-bottom: 1px solid #eee; }
    .info-step:last-child { border-bottom: none; }
    .step-number { width: 32px; height: 32px; background: #1976d2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
    .info-step strong { display: block; margin-bottom: 4px; }
    .info-step p { margin: 0; color: #666; font-size: 0.875rem; }
  `]
})
export class CertificateVerifyComponent {
  certificateNumber = '';
  verifying = false;
  result: CertificateVerification | null = null;

  constructor(private certificateService: CertificateService) {}

  verify(): void {
    if (!this.certificateNumber) return;

    this.verifying = true;
    this.result = null;

    this.certificateService.verifyCertificate(this.certificateNumber).subscribe({
      next: (res) => {
        this.result = res;
        this.verifying = false;
      },
      error: () => {
        this.result = { valid: false, verifiedAt: new Date().toISOString(), message: 'Erreur lors de la vérification' };
        this.verifying = false;
      }
    });
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = { RECYCLING: 'Recyclage', DONATION: 'Don', REFURBISHMENT: 'Reconditionnement', DESTRUCTION: 'Destruction', TRACEABILITY: 'Traçabilité' };
    return labels[type] || type;
  }
}
