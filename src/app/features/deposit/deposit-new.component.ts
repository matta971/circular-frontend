import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CollectionService } from '../../core/services/collection.service';

@Component({
  selector: 'app-deposit-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="deposit-new-container">
      <h1>Préparer un dépôt</h1>
      <p class="subtitle">Enregistrez vos appareils et générez votre QR code</p>

      <mat-stepper orientation="vertical" [linear]="true" #stepper>
        <!-- Étape 1: Appareils -->
        <mat-step [stepControl]="devicesForm">
          <ng-template matStepLabel>Vos appareils</ng-template>
          <form [formGroup]="devicesForm">
            @for (device of devices(); track $index; let i = $index) {
              <mat-card class="device-card">
                <div class="device-header">
                  <mat-icon>{{ getDeviceTypeIcon(device.deviceType) }}</mat-icon>
                  <span>{{ device.brand }} {{ device.model }}</span>
                  <button mat-icon-button color="warn" (click)="removeDevice(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </mat-card>
            }

            <mat-card class="add-device-card">
              <h3>Ajouter un appareil</h3>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Type d'appareil</mat-label>
                  <mat-select formControlName="deviceType">
                    @for (type of deviceTypes; track type.value) {
                      <mat-option [value]="type.value">{{ type.label }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Marque</mat-label>
                  <input matInput formControlName="brand">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Modèle</mat-label>
                  <input matInput formControlName="model">
                </mat-form-field>
              </div>

              <button mat-stroked-button color="primary" type="button" (click)="addDevice()"
                [disabled]="devicesForm.invalid">
                <mat-icon>add</mat-icon>
                Ajouter cet appareil
              </button>
            </mat-card>

            <div class="step-actions">
              <button mat-raised-button color="primary" matStepperNext [disabled]="devices().length === 0">
                Continuer
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Étape 2: Point de dépôt -->
        <mat-step>
          <ng-template matStepLabel>Point de dépôt</ng-template>
          @if (selectedPoint()) {
            <mat-card class="point-card">
              <mat-icon>store</mat-icon>
              <div class="point-info">
                <h3>{{ selectedPoint()!.name }}</h3>
                <p>{{ selectedPoint()!.address }}</p>
                <p>{{ selectedPoint()!.city }}</p>
              </div>
              <button mat-button routerLink="/deposit">Changer</button>
            </mat-card>
          } @else {
            <p>Aucun point de dépôt sélectionné</p>
            <button mat-raised-button color="primary" routerLink="/deposit">
              Choisir un point de dépôt
            </button>
          }

          <div class="step-actions">
            <button mat-button matStepperPrevious>Retour</button>
            <button mat-raised-button color="primary" (click)="generateQRCode()" [disabled]="!selectedPoint()">
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Générer mon QR code
              }
            </button>
          </div>
        </mat-step>

        <!-- Étape 3: QR Code -->
        <mat-step>
          <ng-template matStepLabel>Votre QR code</ng-template>
          @if (qrCode()) {
            <div class="qr-result">
              <mat-card class="qr-card">
                <div class="qr-placeholder">
                  <mat-icon>qr_code_2</mat-icon>
                  <p class="code">{{ qrCode() }}</p>
                </div>
                <p class="instructions">Présentez ce QR code lors de votre dépôt</p>
                <p class="validity">Valide jusqu'au {{ validUntil() | date:'fullDate' }}</p>
              </mat-card>

              <div class="qr-actions">
                <button mat-raised-button color="primary" (click)="downloadQR()">
                  <mat-icon>download</mat-icon>
                  Télécharger
                </button>
                <button mat-stroked-button (click)="shareQR()">
                  <mat-icon>share</mat-icon>
                  Partager
                </button>
              </div>
            </div>
          }
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .deposit-new-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      text-align: center;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .device-card {
      padding: 1rem;
      margin-bottom: 1rem;

      .device-header {
        display: flex;
        align-items: center;
        gap: 1rem;

        mat-icon {
          color: #1976d2;
        }

        span {
          flex: 1;
          font-weight: 500;
        }
      }
    }

    .add-device-card {
      padding: 1.5rem;
      margin-bottom: 1rem;
      background: #fafafa;

      h3 {
        margin: 0 0 1rem;
      }
    }

    .point-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #1976d2;
      }

      .point-info {
        flex: 1;

        h3 {
          margin: 0 0 0.25rem;
        }

        p {
          margin: 0;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .step-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .qr-result {
      text-align: center;
    }

    .qr-card {
      max-width: 350px;
      margin: 0 auto 1.5rem;
      padding: 2rem;

      .qr-placeholder {
        background: #f5f5f5;
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 1rem;

        mat-icon {
          font-size: 120px;
          width: 120px;
          height: 120px;
          color: #333;
        }

        .code {
          font-family: monospace;
          font-size: 1.2rem;
          margin: 1rem 0 0;
          word-break: break-all;
        }
      }

      .instructions {
        font-weight: 500;
        margin-bottom: 0.5rem;
      }

      .validity {
        color: rgba(0, 0, 0, 0.6);
        font-size: 0.9rem;
      }
    }

    .qr-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
  `]
})
export class DepositNewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private collectionService = inject(CollectionService);

  deviceTypes = [
    { value: 'SMARTPHONE', label: 'Smartphone' },
    { value: 'LAPTOP', label: 'Ordinateur portable' },
    { value: 'TABLET', label: 'Tablette' },
    { value: 'DESKTOP', label: 'PC Bureau' },
    { value: 'TV', label: 'Télévision' },
    { value: 'CONSOLE', label: 'Console' },
    { value: 'PERIPHERAL', label: 'Périphérique' },
    { value: 'OTHER', label: 'Autre' }
  ];

  devicesForm = this.fb.group({
    deviceType: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required]
  });

  devices = signal<{ deviceType: string; brand: string; model: string }[]>([]);
  selectedPoint = signal<{ id: number; name: string; address: string; city: string } | null>(null);
  loading = signal(false);
  qrCode = signal<string | null>(null);
  validUntil = signal<Date | null>(null);

  ngOnInit(): void {
    const pointId = this.route.snapshot.queryParamMap.get('point');
    if (pointId) {
      // Charger les infos du point depuis l'API
      this.collectionService.getDropOffPoints().subscribe(points => {
        const point = points.find(p => p.id === Number(pointId));
        if (point) {
          this.selectedPoint.set({
            id: point.id,
            name: point.name,
            address: point.address,
            city: point.city
          });
        }
      });
    }
  }

  getDeviceTypeIcon(deviceType: string): string {
    const icons: Record<string, string> = {
      SMARTPHONE: 'smartphone',
      LAPTOP: 'laptop',
      TABLET: 'tablet',
      DESKTOP: 'desktop_windows',
      TV: 'tv',
      CONSOLE: 'videogame_asset',
      PERIPHERAL: 'keyboard',
      OTHER: 'devices_other'
    };
    return icons[deviceType] || 'devices';
  }

  addDevice(): void {
    if (this.devicesForm.invalid) return;

    this.devices.update(devices => [
      ...devices,
      {
        deviceType: this.devicesForm.value.deviceType!,
        brand: this.devicesForm.value.brand!,
        model: this.devicesForm.value.model!
      }
    ]);

    this.devicesForm.reset();
  }

  removeDevice(index: number): void {
    this.devices.update(devices => devices.filter((_, i) => i !== index));
  }

  generateQRCode(): void {
    const point = this.selectedPoint();
    if (!point) return;

    this.loading.set(true);

    this.collectionService.createDropOff({
      dropOffPointId: point.id,
      declaredItemCount: this.devices().length
    }).subscribe({
      next: (dropOff) => {
        this.qrCode.set(dropOff.code);

        const validity = new Date();
        validity.setDate(validity.getDate() + 7);
        this.validUntil.set(validity);

        this.loading.set(false);

        // Naviguer vers la page du code
        this.router.navigate(['/deposit/code', dropOff.code]);
      },
      error: () => {
        // Fallback simulation
        const code = 'CIR-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        this.qrCode.set(code);

        const validity = new Date();
        validity.setDate(validity.getDate() + 7);
        this.validUntil.set(validity);

        this.loading.set(false);
        this.router.navigate(['/deposit/code', code]);
      }
    });
  }

  downloadQR(): void {
    // Simulation de téléchargement
    alert('Téléchargement du QR code...');
  }

  shareQR(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Mon QR code Circular',
        text: `Code de dépôt: ${this.qrCode()}`,
        url: window.location.href
      });
    }
  }
}
