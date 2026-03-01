import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicHeaderComponent } from '../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../shared/components/layout/footer.component';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    PublicHeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="landing-page">
      <app-public-header [currentPage]="null"></app-public-header>

      <!-- Hero -->
      <section class="hero">
        <div class="hero-content">
          <h1>Contactez-nous</h1>
          <p class="hero-subtitle">
            Une question, une demande de démo ou un projet de partenariat ?
            Nous vous répondons sous 48h.
          </p>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="section-contact">
        <div class="contact-container">

          <!-- Form -->
          <div class="contact-form-card">
            <h2>Envoyez-nous un message</h2>

            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Nom complet</mat-label>
                  <input matInput formControlName="name" placeholder="Jean Dupont">
                  <mat-icon matPrefix>person</mat-icon>
                  @if (form.controls.name.hasError('required') && form.controls.name.touched) {
                    <mat-error>Le nom est requis</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="jean@exemple.com">
                  <mat-icon matPrefix>email</mat-icon>
                  @if (form.controls.email.hasError('required') && form.controls.email.touched) {
                    <mat-error>L'email est requis</mat-error>
                  }
                  @if (form.controls.email.hasError('email') && form.controls.email.touched) {
                    <mat-error>Format d'email invalide</mat-error>
                  }
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Entreprise / Organisation</mat-label>
                  <input matInput formControlName="company" placeholder="Optionnel">
                  <mat-icon matPrefix>business</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Sujet</mat-label>
                  <mat-select formControlName="subject">
                    <mat-option value="demo">Demande de démo</mat-option>
                    <mat-option value="partenariat">Partenariat</mat-option>
                    <mat-option value="question">Question générale</mat-option>
                    <mat-option value="autre">Autre</mat-option>
                  </mat-select>
                  <mat-icon matPrefix>subject</mat-icon>
                  @if (form.controls.subject.hasError('required') && form.controls.subject.touched) {
                    <mat-error>Le sujet est requis</mat-error>
                  }
                </mat-form-field>
              </div>

              <div class="phone-row">
                <mat-form-field appearance="outline" class="phone-prefix">
                  <mat-label>Indicatif</mat-label>
                  <mat-select formControlName="phonePrefix">
                    <mat-select-trigger>
                      @if (selectedCountry) {
                        <span class="trigger-content">
                          <img [src]="flagUrl(selectedCountry.code)" [alt]="selectedCountry.name"
                            width="20" height="15" class="flag-img">
                          {{ selectedCountry.prefix }}
                        </span>
                      }
                    </mat-select-trigger>
                    @for (country of countries; track country.code) {
                      <mat-option [value]="country.code">
                        <span class="country-option">
                          <img [src]="flagUrl(country.code)" [alt]="country.name"
                            width="24" height="18" class="flag-img">
                          <span class="country-name">{{ country.name }}</span>
                          <span class="country-prefix">{{ country.prefix }}</span>
                        </span>
                      </mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="phone-number">
                  <mat-label>Téléphone</mat-label>
                  <input matInput type="tel" formControlName="phone" placeholder="6 12 34 56 78">
                  <mat-icon matPrefix>phone</mat-icon>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline">
                <mat-label>Message</mat-label>
                <textarea matInput formControlName="message" rows="5"
                  placeholder="Décrivez votre demande..."></textarea>
                <mat-icon matPrefix>chat</mat-icon>
                @if (form.controls.message.hasError('required') && form.controls.message.touched) {
                  <mat-error>Le message est requis</mat-error>
                }
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" class="submit-btn"
                [disabled]="form.invalid || loading">
                @if (loading) {
                  <mat-spinner diameter="20"></mat-spinner>
                  Envoi en cours...
                } @else {
                  <mat-icon>send</mat-icon>
                  Envoyer le message
                }
              </button>
            </form>
          </div>

          <!-- Sidebar -->
          <div class="contact-info">
            <div class="info-card">
              <div class="info-icon">
                <mat-icon>email</mat-icon>
              </div>
              <h3>Email</h3>
              <a href="mailto:matta971@gmail.com">matta971&#64;gmail.com</a>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <h3>Délai de réponse</h3>
              <p>Sous 48 heures ouvrées</p>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <mat-icon>location_on</mat-icon>
              </div>
              <h3>Localisation</h3>
              <p>Paris, France</p>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <mat-icon>groups</mat-icon>
              </div>
              <h3>Vous êtes ?</h3>
              <p>Entreprise, association, collectivité ou citoyen — nous avons une solution pour vous.</p>
            </div>
          </div>

        </div>
      </section>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Hero */
    .hero {
      background: linear-gradient(135deg, #1a1fd8 0%, #474bfe 50%, #6366f1 100%);
      padding: 80px 2rem 3rem 2rem;
      text-align: center;
      min-height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-content {
      max-width: 650px;
    }

    .hero h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 1rem 0;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
      margin: 0;
    }

    /* Contact Section */
    .section-contact {
      padding: 4rem 2rem 5rem;
      background: var(--ce-gray-50, #fafafa);
      flex: 1;
    }

    .contact-container {
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 3rem;
      align-items: start;
    }

    /* Form Card */
    .contact-form-card {
      background: white;
      border-radius: var(--ce-radius-xl, 16px);
      padding: 2.5rem;
      box-shadow: var(--ce-shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.1));
    }

    .contact-form-card h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--ce-gray-900, #212121);
      margin: 0 0 2rem 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    .phone-row {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 1rem;
    }

    .trigger-content {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .country-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .flag-img {
      border-radius: 2px;
      object-fit: cover;
      vertical-align: middle;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }

    .country-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .country-prefix {
      color: var(--ce-gray-500, #9e9e9e);
      font-size: 0.85rem;
      min-width: 40px;
      text-align: right;
    }

    .submit-btn {
      width: 100%;
      height: 52px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 12px;
      margin-top: 0.5rem;

      mat-icon {
        margin-right: 0.5rem;
      }

      mat-spinner {
        display: inline-block;
        margin-right: 0.5rem;
      }
    }

    /* Info Sidebar */
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .info-card {
      background: white;
      border-radius: var(--ce-radius-lg, 12px);
      padding: 1.5rem;
      box-shadow: var(--ce-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--ce-shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
      }
    }

    .info-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #1a1fd8 0%, #474bfe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;

      mat-icon {
        color: white;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .info-card h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--ce-gray-900, #212121);
      margin: 0 0 0.25rem 0;
    }

    .info-card p,
    .info-card a {
      font-size: 0.95rem;
      color: var(--ce-gray-600, #757575);
      line-height: 1.5;
      margin: 0;
      text-decoration: none;
    }

    .info-card a:hover {
      color: var(--ce-primary, #1a1fd8);
    }

    /* Responsive */
    @media (max-width: 992px) {
      .hero {
        padding: 80px 1.5rem 3rem 1.5rem;
      }

      .contact-container {
        grid-template-columns: 1fr;
      }

      .contact-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
    }

    @media (max-width: 576px) {
      .hero h1 {
        font-size: 1.75rem;
      }

      .section-contact {
        padding: 2rem 1rem 3rem;
      }

      .contact-form-card {
        padding: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .phone-row {
        grid-template-columns: 140px 1fr;
      }

      .contact-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {
  private fb = new FormBuilder();
  private contactService = inject(ContactService);
  private snackBar = inject(MatSnackBar);

  loading = false;

  countries = [
    { code: 'FR', name: 'France', prefix: '+33' },
    { code: 'BE', name: 'Belgique', prefix: '+32' },
    { code: 'CH', name: 'Suisse', prefix: '+41' },
    { code: 'LU', name: 'Luxembourg', prefix: '+352' },
    { code: 'MC', name: 'Monaco', prefix: '+377' },
    { code: 'GB', name: 'Royaume-Uni', prefix: '+44' },
    { code: 'DE', name: 'Allemagne', prefix: '+49' },
    { code: 'ES', name: 'Espagne', prefix: '+34' },
    { code: 'IT', name: 'Italie', prefix: '+39' },
    { code: 'PT', name: 'Portugal', prefix: '+351' },
    { code: 'NL', name: 'Pays-Bas', prefix: '+31' },
    { code: 'US', name: 'États-Unis', prefix: '+1' },
    { code: 'CA', name: 'Canada', prefix: '+1' },
    { code: 'MA', name: 'Maroc', prefix: '+212' },
    { code: 'TN', name: 'Tunisie', prefix: '+216' },
    { code: 'DZ', name: 'Algérie', prefix: '+213' },
    { code: 'SN', name: 'Sénégal', prefix: '+221' },
    { code: 'CI', name: 'Côte d\'Ivoire', prefix: '+225' },
  ];

  flagUrl(code: string): string {
    return `https://flagcdn.com/${code.toLowerCase()}.svg`;
  }

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    subject: ['', Validators.required],
    phonePrefix: ['FR'],
    phone: [''],
    message: ['', Validators.required]
  });

  get selectedCountry() {
    return this.countries.find(c => c.code === this.form.controls.phonePrefix.value);
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;

    const { name, email, company, subject, phonePrefix, phone, message } = this.form.getRawValue();
    const country = this.countries.find(c => c.code === phonePrefix);
    const prefix = country?.prefix ?? '+33';
    const fullPhone = phone ? `${prefix} ${phone}` : '';

    this.loading = true;

    this.contactService.submitContactForm({
      name,
      email,
      company: company || undefined,
      subject,
      phone: fullPhone || undefined,
      message
    }).subscribe({
      next: () => {
        this.snackBar.open('Message envoyé ! Vérifiez votre boîte mail.', 'OK', {
          duration: 6000,
          panelClass: 'snackbar-success'
        });
        this.form.reset({ phonePrefix: 'FR' });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'envoi. Veuillez réessayer.', 'Fermer', {
          duration: 6000,
          panelClass: 'snackbar-error'
        });
        this.loading = false;
      }
    });
  }
}
