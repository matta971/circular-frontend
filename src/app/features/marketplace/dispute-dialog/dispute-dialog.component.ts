import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarketplaceService } from '../../../core/services';
import { DisputeReason, P2POrder } from '../../../core/models';

export interface DisputeDialogData {
  order: P2POrder;
}

@Component({
  selector: 'app-dispute-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="warn">report_problem</mat-icon>
      Signaler un problème
    </h2>

    <mat-dialog-content>
      <div class="order-summary">
        <strong>Commande #{{ data.order.orderNumber }}</strong>
        <span>{{ data.order.totalAmount | currency:'EUR' }}</span>
      </div>

      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Raison du litige</mat-label>
          <mat-select formControlName="reason" required>
            @for (reason of reasons; track reason.value) {
              <mat-option [value]="reason.value">{{ reason.label }}</mat-option>
            }
          </mat-select>
          @if (form.get('reason')?.hasError('required')) {
            <mat-error>Veuillez sélectionner une raison</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description du problème</mat-label>
          <textarea
            matInput
            formControlName="description"
            rows="4"
            placeholder="Décrivez le problème rencontré en détail..."
            required
          ></textarea>
          @if (form.get('description')?.hasError('required')) {
            <mat-error>La description est requise</mat-error>
          }
          @if (form.get('description')?.hasError('minlength')) {
            <mat-error>Minimum 20 caractères requis</mat-error>
          }
          <mat-hint align="end">{{ form.get('description')?.value?.length || 0 }}/500</mat-hint>
        </mat-form-field>

        <div class="evidence-section">
          <label>Preuves (optionnel)</label>
          <p class="hint">Ajoutez des photos ou documents pour appuyer votre demande</p>

          <div class="evidence-upload">
            <button type="button" mat-stroked-button (click)="fileInput.click()">
              <mat-icon>add_photo_alternate</mat-icon>
              Ajouter des photos
            </button>
            <input
              #fileInput
              type="file"
              accept="image/*"
              multiple
              hidden
              (change)="onFilesSelected($event)"
            >
          </div>

          @if (selectedFiles.length) {
            <div class="evidence-preview">
              @for (file of selectedFiles; track file.name; let i = $index) {
                <div class="evidence-item">
                  <img [src]="filePreviews[i]" alt="">
                  <button mat-icon-button (click)="removeFile(i)">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </form>

      <div class="info-box">
        <mat-icon>info</mat-icon>
        <div>
          <strong>Que se passe-t-il ensuite ?</strong>
          <p>Le vendeur aura 48h pour répondre. Si aucun accord n'est trouvé, notre équipe interviendra pour résoudre le litige.</p>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [disabled]="submitting">Annuler</button>
      <button
        mat-raised-button
        color="warn"
        (click)="submit()"
        [disabled]="form.invalid || submitting"
      >
        @if (submitting) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          <mat-icon>send</mat-icon>
          Soumettre le litige
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }
    mat-dialog-content {
      padding: 24px !important;
      min-width: 400px;
    }
    .order-summary {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .evidence-section {
      margin-bottom: 24px;
    }
    .evidence-section label {
      font-weight: 500;
      display: block;
      margin-bottom: 4px;
    }
    .evidence-section .hint {
      color: #666;
      font-size: 12px;
      margin: 0 0 12px 0;
    }
    .evidence-upload {
      margin-bottom: 12px;
    }
    .evidence-preview {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .evidence-item {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
    }
    .evidence-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .evidence-item button {
      position: absolute;
      top: 2px;
      right: 2px;
      background: rgba(0,0,0,0.5);
      color: white;
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
    .evidence-item button mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .info-box {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 8px;
      margin-top: 16px;
    }
    .info-box mat-icon {
      color: #1976d2;
    }
    .info-box p {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: #666;
    }
    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }
    mat-dialog-actions button mat-spinner {
      display: inline-block;
    }
  `]
})
export class DisputeDialogComponent {
  form: FormGroup;
  submitting = false;
  selectedFiles: File[] = [];
  filePreviews: string[] = [];

  reasons = [
    { value: DisputeReason.ITEM_NOT_RECEIVED, label: "Article non reçu" },
    { value: DisputeReason.ITEM_NOT_AS_DESCRIBED, label: "Article non conforme à la description" },
    { value: DisputeReason.ITEM_DAMAGED, label: "Article endommagé" },
    { value: DisputeReason.WRONG_ITEM, label: "Mauvais article reçu" },
    { value: DisputeReason.SELLER_UNRESPONSIVE, label: "Vendeur ne répond pas" },
    { value: DisputeReason.OTHER, label: "Autre raison" }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DisputeDialogComponent>,
    private marketplaceService: MarketplaceService,
    @Inject(MAT_DIALOG_DATA) public data: DisputeDialogData
  ) {
    this.form = this.fb.group({
      reason: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files).slice(0, 5 - this.selectedFiles.length);
      newFiles.forEach(file => {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.filePreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.filePreviews.splice(index, 1);
  }

  submit(): void {
    if (this.form.invalid) return;

    this.submitting = true;

    // Pour l'instant, on envoie sans les URLs d'images (upload à implémenter)
    const request = {
      orderId: this.data.order.id,
      reason: this.form.value.reason,
      description: this.form.value.description,
      evidenceUrls: [] // TODO: Upload files and get URLs
    };

    this.marketplaceService.createDispute(request).subscribe({
      next: (dispute) => {
        this.submitting = false;
        this.dialogRef.close(dispute);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Failed to create dispute:', err);
      }
    });
  }
}
