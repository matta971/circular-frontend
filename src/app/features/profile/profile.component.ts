import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';
import { ProfileUpdateRequest } from '../../core/models/user.model';

interface Country {
  code: string;
  name: string;
}

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-profile',
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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <div class="avatar-section">
            <div class="avatar">
              @if (authService.currentUser()?.avatarUrl) {
                <img [src]="authService.currentUser()?.avatarUrl" alt="Avatar" referrerpolicy="no-referrer">
              } @else {
                <mat-icon>person</mat-icon>
              }
            </div>
            <div class="user-info">
              <h1>{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</h1>
              <p class="email">{{ authService.currentUser()?.email }}</p>
              <mat-chip>{{ getRoleLabel(authService.currentUser()?.role) }}</mat-chip>
            </div>
          </div>
        </mat-card-header>

        <mat-divider></mat-divider>

        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <h2>Informations personnelles</h2>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Prenom</mat-label>
                <input matInput formControlName="firstName">
                @if (profileForm.get('firstName')?.hasError('required')) {
                  <mat-error>Le prenom est requis</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="lastName">
                @if (profileForm.get('lastName')?.hasError('required')) {
                  <mat-error>Le nom est requis</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Telephone</mat-label>
                <input matInput formControlName="phone" placeholder="+33612345678">
                <mat-icon matPrefix>phone</mat-icon>
                @if (profileForm.get('phone')?.hasError('pattern')) {
                  <mat-error>Format invalide</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput [value]="authService.currentUser()?.email" disabled>
                <mat-icon matPrefix>email</mat-icon>
                <mat-hint>L'email ne peut pas etre modifie</mat-hint>
              </mat-form-field>
            </div>

            <h2>Preferences</h2>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Pays</mat-label>
                <mat-select formControlName="country">
                  <mat-option value="">-- Selectionner --</mat-option>
                  @for (country of countries; track country.code) {
                    <mat-option [value]="country.code">{{ country.name }}</mat-option>
                  }
                </mat-select>
                <mat-icon matPrefix>flag</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Langue preferee</mat-label>
                <mat-select formControlName="preferredLanguage">
                  @for (lang of languages; track lang.code) {
                    <mat-option [value]="lang.code">{{ lang.name }}</mat-option>
                  }
                </mat-select>
                <mat-icon matPrefix>language</mat-icon>
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="!profileForm.valid || saving">
                @if (saving) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  <mat-icon>save</mat-icon>
                  Enregistrer
                }
              </button>
              <button mat-button type="button" (click)="resetForm()">
                Annuler
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="info-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>info</mat-icon>
          <mat-card-title>Informations du compte</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="info-item">
            <span class="label">Membre depuis</span>
            <span class="value">{{ authService.currentUser()?.createdAt | date:'dd MMMM yyyy' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email verifie</span>
            <span class="value">
              @if (authService.currentUser()?.emailVerified) {
                <mat-icon class="verified">check_circle</mat-icon> Oui
              } @else {
                <mat-icon class="not-verified">cancel</mat-icon> Non
              }
            </span>
          </div>
          <div class="info-item">
            <span class="label">Solde wallet</span>
            <span class="value">{{ authService.currentUser()?.walletBalance | currency:'EUR' }}</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1rem;
      display: grid;
      gap: 1.5rem;
    }

    .profile-card {
      .avatar-section {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1.5rem;
      }

      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: white;
        }
      }

      .user-info {
        h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .email {
          margin: 0.25rem 0 0.5rem;
          color: #666;
        }
      }
    }

    mat-card-content {
      padding: 1.5rem;

      h2 {
        margin: 1.5rem 0 1rem;
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;

        &:first-child {
          margin-top: 0;
        }
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    mat-form-field {
      width: 100%;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;

      button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      mat-spinner {
        margin-right: 0.5rem;
      }
    }

    .info-card {
      mat-card-content {
        padding-top: 0;
      }

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .label {
          color: #666;
        }

        .value {
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;

            &.verified {
              color: #4caf50;
            }

            &.not-verified {
              color: #f44336;
            }
          }
        }
      }
    }

    @media (max-width: 600px) {
      .profile-card .avatar-section {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  profileForm!: FormGroup;
  saving = false;

  countries: Country[] = [
    { code: 'FR', name: 'France' },
    { code: 'BE', name: 'Belgique' },
    { code: 'CH', name: 'Suisse' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MC', name: 'Monaco' },
    { code: 'DE', name: 'Allemagne' },
    { code: 'ES', name: 'Espagne' },
    { code: 'IT', name: 'Italie' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GB', name: 'Royaume-Uni' },
    { code: 'NL', name: 'Pays-Bas' },
    { code: 'CA', name: 'Canada' },
    { code: 'US', name: 'Etats-Unis' }
  ];

  languages: Language[] = [
    { code: 'fr', name: 'Francais' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Espanol' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Portugues' },
    { code: 'nl', name: 'Nederlands' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.authService.fetchCurrentUser().subscribe();
  }

  initForm(): void {
    const user = this.authService.currentUser();
    this.profileForm = this.fb.group({
      firstName: [user?.firstName || '', Validators.required],
      lastName: [user?.lastName || '', Validators.required],
      phone: [user?.phone || '', Validators.pattern(/^\+?[0-9]{8,15}$/)],
      country: [user?.country || ''],
      preferredLanguage: [user?.preferredLanguage || 'fr']
    });
  }

  resetForm(): void {
    this.initForm();
  }

  onSubmit(): void {
    if (!this.profileForm.valid) return;

    this.saving = true;
    const request: ProfileUpdateRequest = this.profileForm.value;

    this.authService.updateProfile(request).subscribe({
      next: () => {
        this.snackBar.open('Profil mis a jour avec succes', 'OK', { duration: 3000 });
        this.saving = false;
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.snackBar.open('Erreur lors de la mise a jour', 'OK', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  getRoleLabel(role?: string): string {
    const labels: Record<string, string> = {
      'CLIENT': 'Client',
      'ADMIN': 'Administrateur',
      'DRIVER': 'Collecteur',
      'TECHNICIAN': 'Technicien',
      'PARTNER': 'Partenaire'
    };
    return role ? labels[role] || role : '';
  }
}
