import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CertificateService } from '../../../core/services';

interface VerificationResult {
  valid: boolean;
  certificateNumber?: string;
  type?: string;
  typeLabel?: string;
  issuedAt?: string;
  issuedAtFormatted?: string;
  deviceId?: number;
  deviceDescription?: string;
  status?: string;
  verificationMessage?: string;
}

@Component({
  selector: 'app-certificate-verify-direct',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="verify-container">
      <div class="logo-header">
        <div class="logo">
          <span class="logo-icon">♻</span>
          <div class="logo-text">
            <span class="brand-circular">CIRCULAR</span>
            <span class="brand-electronics">ELECTRONICS</span>
          </div>
        </div>
      </div>

      <mat-card class="verify-card">
        @if (loading) {
          <div class="loading-state">
            <mat-spinner diameter="48"></mat-spinner>
            <h2>Vérification en cours...</h2>
            <p>Numéro: {{ certificateNumber }}</p>
          </div>
        }

        @if (!loading && result) {
          <div class="result-state" [class.valid]="result.valid" [class.invalid]="!result.valid">
            <div class="status-icon">
              <mat-icon>{{ result.valid ? 'verified' : 'cancel' }}</mat-icon>
            </div>

            <h1>{{ result.valid ? 'Certificat Authentique' : 'Certificat Non Trouvé' }}</h1>
            <p class="status-badge" [class.authentic]="result.valid">
              {{ result.valid ? 'AUTHENTIQUE' : 'INVALIDE' }}
            </p>

            @if (result.valid) {
              <div class="certificate-details">
                <div class="detail-row">
                  <span class="label">Numéro</span>
                  <span class="value">{{ result.certificateNumber }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Type</span>
                  <span class="value">{{ result.typeLabel }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date d'émission</span>
                  <span class="value">{{ result.issuedAtFormatted }}</span>
                </div>
                @if (result.deviceDescription) {
                  <div class="detail-row">
                    <span class="label">Appareil</span>
                    <span class="value">{{ result.deviceDescription }}</span>
                  </div>
                }
              </div>

              <p class="verification-message">
                <mat-icon>check_circle</mat-icon>
                {{ result.verificationMessage }}
              </p>
            } @else {
              <p class="error-message">
                Ce numéro de certificat n'existe pas dans notre système.
                Veuillez vérifier le numéro et réessayer.
              </p>
            }
          </div>
        }

        @if (!loading && error) {
          <div class="error-state">
            <mat-icon>error_outline</mat-icon>
            <h2>Erreur de vérification</h2>
            <p>{{ error }}</p>
          </div>
        }
      </mat-card>

      <div class="footer-info">
        <p>
          <mat-icon>security</mat-icon>
          Les certificats Circular Electronics sont sécurisés et traçables
        </p>
        <a mat-button routerLink="/certificates/verify">
          Vérifier un autre certificat
        </a>
      </div>
    </div>
  `,
  styles: [`
    .verify-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .logo-header {
      margin-bottom: 32px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 48px;
      color: #1F23D6;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .brand-circular {
      font-size: 28px;
      font-weight: 700;
      color: #1F23D6;
      letter-spacing: 2px;
    }

    .brand-electronics {
      font-size: 14px;
      font-weight: 500;
      color: #10E068;
      letter-spacing: 4px;
    }

    .verify-card {
      max-width: 500px;
      width: 100%;
      padding: 32px;
      text-align: center;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px;
    }

    .loading-state h2 {
      margin: 0;
      color: #333;
    }

    .loading-state p {
      color: #666;
      font-family: monospace;
    }

    .result-state {
      padding: 16px;
    }

    .status-icon mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
    }

    .result-state.valid .status-icon mat-icon {
      color: #4CAF50;
    }

    .result-state.invalid .status-icon mat-icon {
      color: #f44336;
    }

    .result-state h1 {
      margin: 16px 0 8px;
      font-size: 24px;
    }

    .status-badge {
      display: inline-block;
      padding: 8px 24px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 1px;
    }

    .status-badge.authentic {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge:not(.authentic) {
      background: #ffebee;
      color: #c62828;
    }

    .certificate-details {
      background: #f5f5f5;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
      text-align: left;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row .label {
      color: #666;
      font-weight: 500;
    }

    .detail-row .value {
      color: #333;
      font-weight: 600;
    }

    .verification-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #2e7d32;
      background: #e8f5e9;
      padding: 12px;
      border-radius: 8px;
      margin-top: 16px;
    }

    .verification-message mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .error-message {
      color: #666;
      line-height: 1.6;
    }

    .error-state {
      padding: 32px;
      color: #f44336;
    }

    .error-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }

    .error-state h2 {
      margin: 16px 0 8px;
    }

    .error-state p {
      color: #666;
    }

    .footer-info {
      margin-top: 24px;
      text-align: center;
    }

    .footer-info p {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .footer-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #1976d2;
    }
  `]
})
export class CertificateVerifyDirectComponent implements OnInit {
  certificateNumber = '';
  loading = true;
  result: VerificationResult | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    this.certificateNumber = this.route.snapshot.paramMap.get('certificateNumber') || '';

    if (this.certificateNumber) {
      this.verify();
    } else {
      this.loading = false;
      this.error = 'Numéro de certificat manquant';
    }
  }

  private verify(): void {
    this.certificateService.verifyDirect(this.certificateNumber).subscribe({
      next: (result) => {
        this.result = result as VerificationResult;
        this.loading = false;
      },
      error: () => {
        this.result = { valid: false };
        this.loading = false;
      }
    });
  }
}
