import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarketplaceService } from '../../../core/services';
import { DeviceCategory, ListingCondition, CreateListingRequest } from '../../../core/models';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="create-listing-container">
      <header>
        <h1>Vendre un appareil</h1>
        <p>Créez votre annonce en quelques étapes simples</p>
      </header>

      <mat-stepper linear #stepper>
        <!-- Step 1: Device Info -->
        <mat-step [stepControl]="deviceForm">
          <ng-template matStepLabel>Appareil</ng-template>
          <form [formGroup]="deviceForm">
            <mat-card>
              <mat-card-content>
                <h3>Informations sur l'appareil</h3>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Titre de l'annonce</mat-label>
                  <input matInput formControlName="title" placeholder="Ex: iPhone 13 Pro 256Go">
                  <mat-error *ngIf="deviceForm.get('title')?.hasError('required')">
                    Le titre est requis
                  </mat-error>
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Catégorie</mat-label>
                    <mat-select formControlName="category">
                      @for (cat of categories; track cat) {
                        <mat-option [value]="cat">{{ getCategoryLabel(cat) }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>État</mat-label>
                    <mat-select formControlName="condition">
                      @for (cond of conditions; track cond) {
                        <mat-option [value]="cond">{{ getConditionLabel(cond) }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Marque</mat-label>
                    <input matInput formControlName="brand" placeholder="Apple, Samsung...">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Modèle</mat-label>
                    <input matInput formControlName="model" placeholder="iPhone 13 Pro">
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Description</mat-label>
                  <textarea matInput formControlName="description" rows="4"
                    placeholder="Décrivez votre appareil en détail: accessoires inclus, défauts éventuels..."></textarea>
                </mat-form-field>
              </mat-card-content>
              <mat-card-actions align="end">
                <button mat-raised-button color="primary" matStepperNext [disabled]="deviceForm.invalid">
                  Suivant
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          </form>
        </mat-step>

        <!-- Step 2: Pricing & Delivery -->
        <mat-step [stepControl]="pricingForm">
          <ng-template matStepLabel>Prix & Livraison</ng-template>
          <form [formGroup]="pricingForm">
            <mat-card>
              <mat-card-content>
                <h3>Prix</h3>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Prix (€)</mat-label>
                    <input matInput type="number" formControlName="price" min="1">
                    <mat-icon matPrefix>euro</mat-icon>
                    <mat-error *ngIf="pricingForm.get('price')?.hasError('required')">
                      Le prix est requis
                    </mat-error>
                    <mat-error *ngIf="pricingForm.get('price')?.hasError('min')">
                      Le prix minimum est 1€
                    </mat-error>
                  </mat-form-field>

                  <mat-checkbox formControlName="negotiable">Prix négociable</mat-checkbox>
                </div>

                <h3>Options de livraison</h3>

                <div class="delivery-options">
                  <div class="delivery-option">
                    <mat-checkbox formControlName="shippingAvailable">
                      <mat-icon>local_shipping</mat-icon>
                      Livraison disponible
                    </mat-checkbox>

                    @if (pricingForm.get('shippingAvailable')?.value) {
                      <mat-form-field appearance="outline" class="shipping-cost">
                        <mat-label>Frais de port (€)</mat-label>
                        <input matInput type="number" formControlName="shippingCost" min="0">
                        <mat-hint>0 = Livraison gratuite</mat-hint>
                      </mat-form-field>
                    }
                  </div>

                  <div class="delivery-option">
                    <mat-checkbox formControlName="meetupAvailable">
                      <mat-icon>handshake</mat-icon>
                      Remise en main propre
                    </mat-checkbox>

                    @if (pricingForm.get('meetupAvailable')?.value) {
                      <mat-form-field appearance="outline" class="location">
                        <mat-label>Lieu de rencontre</mat-label>
                        <input matInput formControlName="location" placeholder="Ville ou quartier">
                      </mat-form-field>
                    }
                  </div>
                </div>
              </mat-card-content>
              <mat-card-actions align="end">
                <button mat-button matStepperPrevious>
                  <mat-icon>arrow_back</mat-icon>
                  Retour
                </button>
                <button mat-raised-button color="primary" matStepperNext [disabled]="pricingForm.invalid">
                  Suivant
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          </form>
        </mat-step>

        <!-- Step 3: Photos -->
        <mat-step>
          <ng-template matStepLabel>Photos</ng-template>
          <mat-card>
            <mat-card-content>
              <h3>Photos de l'appareil</h3>
              <p class="hint">Ajoutez jusqu'à 5 photos pour illustrer votre annonce</p>

              <div class="photos-grid">
                @for (image of images; track $index) {
                  <div class="photo-item">
                    <img [src]="image" alt="Photo">
                    <button mat-icon-button class="remove-btn" (click)="removeImage($index)">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                }

                @if (images.length < 5) {
                  <div class="photo-placeholder" (click)="addImage()">
                    <mat-icon>add_photo_alternate</mat-icon>
                    <span>Ajouter une photo</span>
                  </div>
                }
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-button matStepperPrevious>
                <mat-icon>arrow_back</mat-icon>
                Retour
              </button>
              <button mat-raised-button color="primary" matStepperNext>
                Suivant
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-step>

        <!-- Step 4: Review -->
        <mat-step>
          <ng-template matStepLabel>Vérification</ng-template>
          <mat-card>
            <mat-card-content>
              <h3>Récapitulatif de votre annonce</h3>

              <div class="review-section">
                <div class="review-item">
                  <strong>Titre:</strong>
                  <span>{{ deviceForm.get('title')?.value }}</span>
                </div>
                <div class="review-item">
                  <strong>Catégorie:</strong>
                  <span>{{ getCategoryLabel(deviceForm.get('category')?.value) }}</span>
                </div>
                <div class="review-item">
                  <strong>État:</strong>
                  <span>{{ getConditionLabel(deviceForm.get('condition')?.value) }}</span>
                </div>
                <div class="review-item">
                  <strong>Marque / Modèle:</strong>
                  <span>{{ deviceForm.get('brand')?.value }} {{ deviceForm.get('model')?.value }}</span>
                </div>
                <div class="review-item">
                  <strong>Prix:</strong>
                  <span>{{ pricingForm.get('price')?.value | currency:'EUR' }}
                    {{ pricingForm.get('negotiable')?.value ? '(négociable)' : '' }}
                  </span>
                </div>
                <div class="review-item">
                  <strong>Livraison:</strong>
                  <span>
                    @if (pricingForm.get('shippingAvailable')?.value) {
                      Oui ({{ pricingForm.get('shippingCost')?.value || 0 }}€)
                    } @else {
                      Non
                    }
                  </span>
                </div>
                <div class="review-item">
                  <strong>Remise en main propre:</strong>
                  <span>
                    @if (pricingForm.get('meetupAvailable')?.value) {
                      Oui - {{ pricingForm.get('location')?.value }}
                    } @else {
                      Non
                    }
                  </span>
                </div>
                <div class="review-item">
                  <strong>Photos:</strong>
                  <span>{{ images.length }} photo(s)</span>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-button matStepperPrevious>
                <mat-icon>arrow_back</mat-icon>
                Retour
              </button>
              <button mat-raised-button (click)="saveDraft()" [disabled]="submitting">
                <mat-icon>save</mat-icon>
                Enregistrer brouillon
              </button>
              <button mat-raised-button color="primary" (click)="publish()" [disabled]="submitting">
                @if (submitting) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  <mat-icon>publish</mat-icon>
                  Publier l'annonce
                }
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .create-listing-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 32px;
    }

    header h1 {
      margin-bottom: 8px;
    }

    header p {
      color: #666;
    }

    mat-card {
      margin-bottom: 16px;
    }

    h3 {
      margin: 0 0 16px 0;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .delivery-options {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .delivery-option {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .delivery-option mat-checkbox mat-icon {
      margin-right: 8px;
    }

    .shipping-cost, .location {
      margin-left: 32px;
      max-width: 200px;
    }

    .hint {
      color: #666;
      margin-bottom: 16px;
    }

    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
    }

    .photo-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
    }

    .photo-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-item .remove-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0,0,0,0.5);
      color: white;
    }

    .photo-placeholder {
      aspect-ratio: 1;
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
    }

    .photo-placeholder:hover {
      border-color: #1976d2;
      background: #e3f2fd;
    }

    .photo-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #666;
    }

    .photo-placeholder span {
      color: #666;
      margin-top: 8px;
    }

    .review-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .review-item {
      display: flex;
      gap: 16px;
    }

    .review-item strong {
      min-width: 150px;
      color: #666;
    }

    mat-card-actions button {
      margin-left: 8px;
    }

    mat-spinner {
      display: inline-block;
    }
  `]
})
export class CreateListingComponent {
  deviceForm: FormGroup;
  pricingForm: FormGroup;
  images: string[] = [];
  submitting = false;

  categories = Object.values(DeviceCategory);
  conditions = Object.values(ListingCondition);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private marketplaceService: MarketplaceService,
    private snackBar: MatSnackBar
  ) {
    this.deviceForm = this.fb.group({
      title: ['', Validators.required],
      category: [DeviceCategory.SMARTPHONE, Validators.required],
      condition: [ListingCondition.GOOD, Validators.required],
      brand: [''],
      model: [''],
      description: ['']
    });

    this.pricingForm = this.fb.group({
      price: [null, [Validators.required, Validators.min(1)]],
      negotiable: [false],
      shippingAvailable: [true],
      shippingCost: [0],
      meetupAvailable: [false],
      location: ['']
    });
  }

  addImage(): void {
    // Placeholder for image upload
    const mockImage = `https://picsum.photos/400/400?random=${Date.now()}`;
    this.images.push(mockImage);
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  private buildRequest(): CreateListingRequest {
    return {
      ...this.deviceForm.value,
      ...this.pricingForm.value,
      images: this.images
    };
  }

  saveDraft(): void {
    this.submitting = true;
    this.marketplaceService.createListing(this.buildRequest()).subscribe({
      next: () => {
        this.snackBar.open('Brouillon enregistré', 'OK', { duration: 2000 });
        this.router.navigate(['/marketplace/my-listings']);
      },
      error: () => {
        this.submitting = false;
        this.snackBar.open('Erreur lors de l\'enregistrement', 'OK', { duration: 3000 });
      }
    });
  }

  publish(): void {
    this.submitting = true;
    this.marketplaceService.createListing(this.buildRequest()).subscribe({
      next: (listing) => {
        this.marketplaceService.publishListing(listing.id).subscribe({
          next: () => {
            this.snackBar.open('Annonce publiée avec succès!', 'OK', { duration: 2000 });
            this.router.navigate(['/marketplace/listing', listing.id]);
          },
          error: () => {
            this.submitting = false;
            this.snackBar.open('Erreur lors de la publication', 'OK', { duration: 3000 });
          }
        });
      },
      error: () => {
        this.submitting = false;
        this.snackBar.open('Erreur lors de la création', 'OK', { duration: 3000 });
      }
    });
  }

  getCategoryLabel(category: DeviceCategory): string {
    const labels: Record<string, string> = {
      SMARTPHONE: 'Smartphone',
      TABLET: 'Tablette',
      LAPTOP: 'Ordinateur portable',
      DESKTOP: 'Ordinateur de bureau',
      SMARTWATCH: 'Montre connectée',
      HEADPHONES: 'Casque/Écouteurs',
      GAMING_CONSOLE: 'Console de jeux',
      CAMERA: 'Appareil photo',
      OTHER: 'Autre'
    };
    return labels[category] || category;
  }

  getConditionLabel(condition: ListingCondition): string {
    const labels: Record<string, string> = {
      NEW: 'Neuf',
      LIKE_NEW: 'Comme neuf',
      EXCELLENT: 'Excellent',
      GOOD: 'Bon',
      FAIR: 'Correct',
      FOR_PARTS: 'Pour pièces'
    };
    return labels[condition] || condition;
  }
}
