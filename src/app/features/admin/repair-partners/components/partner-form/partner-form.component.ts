import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { RepairPartnerAdminService, RepairPartner } from '../../services/repair-partner-admin.service';

@Component({
  selector: 'app-partner-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTabsModule
  ],
  template: `
    <div class="partner-form-container">
      <div class="page-header">
        <button mat-icon-button routerLink="../">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ isEditMode() ? 'Modifier le partenaire' : 'Nouveau partenaire' }}</h1>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-tab-group>
            <!-- Identification -->
            <mat-tab label="Identification">
              <div class="tab-content">
                <mat-card>
                  <mat-card-header>
                    <mat-card-title>Informations générales</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Nom commercial</mat-label>
                        <input matInput formControlName="name" placeholder="Ex: TechRepair Paris">
                        @if (form.get('name')?.hasError('required')) {
                          <mat-error>Le nom est requis</mat-error>
                        }
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Raison sociale</mat-label>
                        <input matInput formControlName="legalName" placeholder="Ex: TechRepair SARL">
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>SIRET</mat-label>
                        <input matInput formControlName="siret" placeholder="14 chiffres">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Type de partenaire</mat-label>
                        <mat-select formControlName="partnerType">
                          <mat-option value="AUTHORIZED">Réparateur agréé</mat-option>
                          <mat-option value="INDEPENDENT">Indépendant</mat-option>
                          <mat-option value="SELF_REPAIR">Auto-réparation</mat-option>
                          <mat-option value="REPAIR_CAFE">Repair Café</mat-option>
                          <mat-option value="MANUFACTURER">Fabricant</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Statut</mat-label>
                        <mat-select formControlName="status">
                          <mat-option value="PENDING">En attente</mat-option>
                          <mat-option value="ACTIVE">Actif</mat-option>
                          <mat-option value="INACTIVE">Inactif</mat-option>
                          <mat-option value="SUSPENDED">Suspendu</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </div>

                    <div class="checkbox-row">
                      <mat-checkbox formControlName="isEss">Économie Sociale et Solidaire (ESS)</mat-checkbox>
                      <mat-checkbox formControlName="hasQualiReparLabel">Label QualiRépar</mat-checkbox>
                      <mat-checkbox formControlName="acceptsBonusReparation">Accepte Bonus Réparation</mat-checkbox>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </mat-tab>

            <!-- Adresse -->
            <mat-tab label="Adresse">
              <div class="tab-content">
                <mat-card>
                  <mat-card-header>
                    <mat-card-title>Localisation</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Adresse</mat-label>
                      <textarea matInput formControlName="address" rows="2" placeholder="Numéro et rue"></textarea>
                      @if (form.get('address')?.hasError('required')) {
                        <mat-error>L'adresse est requise</mat-error>
                      }
                    </mat-form-field>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Code postal</mat-label>
                        <input matInput formControlName="postalCode" placeholder="75001">
                        @if (form.get('postalCode')?.hasError('required')) {
                          <mat-error>Le code postal est requis</mat-error>
                        }
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Ville</mat-label>
                        <input matInput formControlName="city" placeholder="Paris">
                        @if (form.get('city')?.hasError('required')) {
                          <mat-error>La ville est requise</mat-error>
                        }
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Département</mat-label>
                        <input matInput formControlName="department" placeholder="75">
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Latitude</mat-label>
                        <input matInput type="number" formControlName="latitude" step="0.000001">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Longitude</mat-label>
                        <input matInput type="number" formControlName="longitude" step="0.000001">
                      </mat-form-field>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </mat-tab>

            <!-- Contact -->
            <mat-tab label="Contact">
              <div class="tab-content">
                <mat-card>
                  <mat-card-header>
                    <mat-card-title>Coordonnées</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Téléphone</mat-label>
                        <input matInput formControlName="phoneNumber" placeholder="01 23 45 67 89">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Email</mat-label>
                        <input matInput type="email" formControlName="email" placeholder="contact@example.com">
                        @if (form.get('email')?.hasError('email')) {
                          <mat-error>Email invalide</mat-error>
                        }
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Site web</mat-label>
                      <input matInput formControlName="website" placeholder="https://example.com">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Horaires d'ouverture</mat-label>
                      <textarea matInput formControlName="openingHours" rows="3"
                                placeholder="Lun-Ven: 9h-18h&#10;Sam: 10h-13h"></textarea>
                    </mat-form-field>
                  </mat-card-content>
                </mat-card>
              </div>
            </mat-tab>

            <!-- Services -->
            <mat-tab label="Services">
              <div class="tab-content">
                <mat-card>
                  <mat-card-header>
                    <mat-card-title>Types d'appareils et marques</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Types d'appareils supportés</mat-label>
                      <input matInput formControlName="supportedDeviceTypesInput"
                             placeholder="Smartphone, Tablette, Laptop (séparés par virgule)">
                      <mat-hint>Séparez les types par des virgules</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Marques supportées</mat-label>
                      <input matInput formControlName="supportedBrandsInput"
                             placeholder="Apple, Samsung, Huawei (séparés par virgule)">
                      <mat-hint>Séparez les marques par des virgules</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Certifications</mat-label>
                      <input matInput formControlName="certificationsInput"
                             placeholder="Apple Certified, Samsung Partner (séparés par virgule)">
                    </mat-form-field>
                  </mat-card-content>
                </mat-card>

                <mat-card>
                  <mat-card-header>
                    <mat-card-title>Tarifs et délais</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Coût minimum (€)</mat-label>
                        <input matInput type="number" formControlName="estimatedCostMin" min="0">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Coût maximum (€)</mat-label>
                        <input matInput type="number" formControlName="estimatedCostMax" min="0">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Délai estimé (jours)</mat-label>
                        <input matInput type="number" formControlName="estimatedDelayDays" min="0">
                      </mat-form-field>
                    </div>

                    <div class="checkbox-row">
                      <mat-checkbox formControlName="providesWarranty">Fournit une garantie</mat-checkbox>
                    </div>

                    @if (form.get('providesWarranty')?.value) {
                      <mat-form-field appearance="outline">
                        <mat-label>Durée de garantie (mois)</mat-label>
                        <input matInput type="number" formControlName="warrantyDurationMonths" min="1">
                      </mat-form-field>
                    }
                  </mat-card-content>
                </mat-card>
              </div>
            </mat-tab>

            <!-- Contrat -->
            <mat-tab label="Contrat">
              <div class="tab-content">
                <mat-card>
                  <mat-card-header>
                    <mat-card-title>Informations contractuelles</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Numéro de contrat</mat-label>
                        <input matInput formControlName="contractNumber" placeholder="CTR-2024-001">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Taux de commission (%)</mat-label>
                        <input matInput type="number" formControlName="commissionRate" min="0" max="100" step="0.1">
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Date début contrat</mat-label>
                        <input matInput type="date" formControlName="contractStartDate">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Date fin contrat</mat-label>
                        <input matInput type="date" formControlName="contractEndDate">
                      </mat-form-field>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </mat-tab>
          </mat-tab-group>

          <div class="form-actions">
            <button mat-button type="button" routerLink="../">Annuler</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="saving() || form.invalid">
              @if (saving()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                {{ isEditMode() ? 'Enregistrer' : 'Créer' }}
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .partner-form-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;

      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 500;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .tab-content {
      padding: 1.5rem 0;

      mat-card {
        margin-bottom: 1rem;
      }
    }

    mat-card-content {
      padding-top: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .full-width {
      width: 100%;
    }

    .checkbox-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin: 1rem 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class PartnerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private partnerService = inject(RepairPartnerAdminService);

  loading = signal(false);
  saving = signal(false);
  isEditMode = signal(false);
  partnerId = signal<number | null>(null);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    legalName: [''],
    siret: [''],
    partnerType: ['INDEPENDENT', Validators.required],
    status: ['PENDING', Validators.required],
    isEss: [false],
    hasQualiReparLabel: [false],
    acceptsBonusReparation: [false],
    address: ['', Validators.required],
    postalCode: ['', Validators.required],
    city: ['', Validators.required],
    department: [''],
    latitude: [null],
    longitude: [null],
    phoneNumber: [''],
    email: ['', Validators.email],
    website: [''],
    openingHours: [''],
    supportedDeviceTypesInput: [''],
    supportedBrandsInput: [''],
    certificationsInput: [''],
    estimatedCostMin: [null],
    estimatedCostMax: [null],
    estimatedDelayDays: [null],
    providesWarranty: [false],
    warrantyDurationMonths: [null],
    contractNumber: [''],
    contractStartDate: [''],
    contractEndDate: [''],
    commissionRate: [null]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.partnerId.set(+id);
      this.loadPartner(+id);
    }
  }

  private loadPartner(id: number): void {
    this.loading.set(true);
    this.partnerService.getById(id).subscribe({
      next: (partner) => {
        if (partner) {
          this.form.patchValue({
            ...partner,
            supportedDeviceTypesInput: partner.supportedDeviceTypes?.join(', ') || '',
            supportedBrandsInput: partner.supportedBrands?.join(', ') || '',
            certificationsInput: partner.certifications?.join(', ') || ''
          });
        } else {
          this.snackBar.open('Partenaire non trouvé', 'Fermer', { duration: 3000 });
          this.router.navigate(['../'], { relativeTo: this.route });
        }
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const partner: Partial<RepairPartner> = {
      ...formValue,
      supportedDeviceTypes: this.parseCommaSeparated(formValue.supportedDeviceTypesInput),
      supportedBrands: this.parseCommaSeparated(formValue.supportedBrandsInput),
      certifications: this.parseCommaSeparated(formValue.certificationsInput)
    };

    delete (partner as any).supportedDeviceTypesInput;
    delete (partner as any).supportedBrandsInput;
    delete (partner as any).certificationsInput;

    this.saving.set(true);

    const operation = this.isEditMode()
      ? this.partnerService.update(this.partnerId()!, partner)
      : this.partnerService.create(partner);

    operation.subscribe({
      next: (result) => {
        if (result) {
          this.snackBar.open(
            this.isEditMode() ? 'Partenaire mis à jour' : 'Partenaire créé',
            'Fermer',
            { duration: 3000 }
          );
          this.router.navigate(['../'], { relativeTo: this.route });
        } else {
          this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
        }
        this.saving.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
        this.saving.set(false);
      }
    });
  }

  private parseCommaSeparated(value: string): string[] {
    if (!value) return [];
    return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
}
