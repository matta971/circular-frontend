import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { CollectionService } from '../../core/services/collection.service';
import { CollectionItem, CreateCollectionRequest, DeviceCondition } from '../../core/models';

@Component({
  selector: 'app-collection-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="collection-new-container">
      <h1>Planifier une collecte</h1>
      <p class="subtitle">Un chauffeur viendra récupérer vos appareils à domicile</p>

      <mat-stepper orientation="vertical" [linear]="true" #stepper>
        <!-- Étape 1: Appareils -->
        <mat-step [stepControl]="devicesForm">
          <ng-template matStepLabel>Vos appareils</ng-template>
          <form [formGroup]="devicesForm">
            <p>Ajoutez les appareils que vous souhaitez faire collecter</p>

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

              <mat-form-field appearance="outline">
                <mat-label>État</mat-label>
                <mat-select formControlName="condition">
                  <mat-option value="NEW">Neuf</mat-option>
                  <mat-option value="GOOD">Bon</mat-option>
                  <mat-option value="FAIR">Correct</mat-option>
                  <mat-option value="BROKEN">Endommagé</mat-option>
                </mat-select>
              </mat-form-field>

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

        <!-- Étape 2: Adresse -->
        <mat-step [stepControl]="addressForm">
          <ng-template matStepLabel>Adresse de collecte</ng-template>
          <form [formGroup]="addressForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rue et numéro</mat-label>
              <input matInput formControlName="line1">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Complément d'adresse (optionnel)</mat-label>
              <input matInput formControlName="line2" placeholder="Bâtiment, étage, code...">
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Code postal</mat-label>
                <input matInput formControlName="postalCode">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Ville</mat-label>
                <input matInput formControlName="city">
              </mat-form-field>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>Retour</button>
              <button mat-raised-button color="primary" matStepperNext [disabled]="addressForm.invalid">
                Continuer
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Étape 3: Date et créneau -->
        <mat-step [stepControl]="scheduleForm">
          <ng-template matStepLabel>Date et créneau</ng-template>
          <form [formGroup]="scheduleForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date souhaitée</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="preferredDate" [min]="minDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <div class="time-slots">
              <p>Choisissez un créneau horaire :</p>
              <div class="slots-grid">
                @for (slot of timeSlots; track slot.value) {
                  <mat-card
                    class="slot-card"
                    [class.selected]="selectedTimeSlot() === slot.value"
                    (click)="selectTimeSlot(slot.value)">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ slot.label }}</span>
                  </mat-card>
                }
              </div>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Instructions pour le chauffeur (optionnel)</mat-label>
              <textarea matInput formControlName="notes" rows="3"
                placeholder="Code d'entrée, étage, instructions spéciales..."></textarea>
            </mat-form-field>

            <div class="step-actions">
              <button mat-button matStepperPrevious>Retour</button>
              <button mat-raised-button color="primary" matStepperNext [disabled]="scheduleForm.invalid">
                Continuer
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Étape 4: Récapitulatif -->
        <mat-step>
          <ng-template matStepLabel>Confirmation</ng-template>
          <mat-card class="summary-card">
            <h2>Récapitulatif de votre collecte</h2>

            <div class="summary-section">
              <h3><mat-icon>devices</mat-icon> Appareils ({{ devices().length }})</h3>
              @for (device of devices(); track $index) {
                <p>{{ device.brand }} {{ device.model }} - {{ device.condition }}</p>
              }
            </div>

            <div class="summary-section">
              <h3><mat-icon>place</mat-icon> Adresse</h3>
              <p>{{ addressForm.value.line1 }}</p>
              @if (addressForm.value.line2) {
                <p>{{ addressForm.value.line2 }}</p>
              }
              <p>{{ addressForm.value.postalCode }} {{ addressForm.value.city }}</p>
            </div>

            <div class="summary-section">
              <h3><mat-icon>event</mat-icon> Date et horaire</h3>
              <p>{{ scheduleForm.value.preferredDate | date:'fullDate' }}</p>
              <p>{{ getTimeSlotLabel(selectedTimeSlot()) }}</p>
            </div>

            @if (scheduleForm.value.notes) {
              <div class="summary-section">
                <h3><mat-icon>notes</mat-icon> Instructions</h3>
                <p>{{ scheduleForm.value.notes }}</p>
              </div>
            }
          </mat-card>

          <div class="step-actions">
            <button mat-button matStepperPrevious>Retour</button>
            <button mat-raised-button color="primary" (click)="submitCollection()" [disabled]="loading()">
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Confirmer la collecte
              }
            </button>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .collection-new-container {
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

    .full-width {
      width: 100%;
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

    .time-slots {
      margin-bottom: 1.5rem;

      p {
        margin-bottom: 1rem;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    .slot-card {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: translateY(-2px);
      }

      &.selected {
        border: 2px solid #4caf50;
        background: #e8f5e9;
      }

      mat-icon {
        color: #1976d2;
      }
    }

    .step-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .summary-card {
      padding: 1.5rem;

      h2 {
        margin: 0 0 1.5rem;
        text-align: center;
      }
    }

    .summary-section {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 0 0.5rem;
        font-size: 1rem;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          color: #1976d2;
        }
      }

      p {
        margin: 0.25rem 0;
        padding-left: 28px;
        color: rgba(0, 0, 0, 0.7);
      }
    }
  `]
})
export class CollectionNewComponent {
  private fb = inject(FormBuilder);
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

  timeSlots = [
    { value: '08:00-12:00', label: '8h - 12h', start: '08:00', end: '12:00' },
    { value: '12:00-14:00', label: '12h - 14h', start: '12:00', end: '14:00' },
    { value: '14:00-18:00', label: '14h - 18h', start: '14:00', end: '18:00' },
    { value: '18:00-20:00', label: '18h - 20h', start: '18:00', end: '20:00' }
  ];

  minDate = new Date();

  devicesForm = this.fb.group({
    deviceType: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    condition: ['', Validators.required]
  });

  addressForm = this.fb.group({
    line1: ['', Validators.required],
    line2: [''],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    city: ['', Validators.required]
  });

  scheduleForm = this.fb.group({
    preferredDate: [null as Date | null, Validators.required],
    notes: ['']
  });

  devices = signal<CollectionItem[]>([]);
  selectedTimeSlot = signal<string>('');
  loading = signal(false);

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
        model: this.devicesForm.value.model!,
        condition: this.devicesForm.value.condition!
      }
    ]);

    this.devicesForm.reset();
  }

  removeDevice(index: number): void {
    this.devices.update(devices => devices.filter((_, i) => i !== index));
  }

  selectTimeSlot(slot: string): void {
    this.selectedTimeSlot.set(slot);
  }

  getTimeSlotLabel(value: string | null | undefined): string {
    if (!value) return '';
    const slot = this.timeSlots.find(s => s.value === value);
    return slot?.label || value;
  }

  submitCollection(): void {
    if (!this.selectedTimeSlot()) return;

    this.loading.set(true);
    const slot = this.timeSlots.find(s => s.value === this.selectedTimeSlot());
    const preferredDate = this.scheduleForm.value.preferredDate;
    const dateStr = preferredDate ? preferredDate.toISOString().split('T')[0] : undefined;

    const request: CreateCollectionRequest = {
      address: {
        line1: this.addressForm.value.line1!,
        line2: this.addressForm.value.line2 || undefined,
        postalCode: this.addressForm.value.postalCode!,
        city: this.addressForm.value.city!,
        country: 'France'
      },
      preferredDate: dateStr,
      preferredTimeStart: slot?.start,
      preferredTimeEnd: slot?.end,
      notes: this.scheduleForm.value.notes || undefined,
      items: this.devices()
    };

    this.collectionService.createCollection(request).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.router.navigate(['/collection', result.id]);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
