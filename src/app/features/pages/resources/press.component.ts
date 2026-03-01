import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-press',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    PublicHeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="landing-page">
      <app-public-header [currentPage]="null"></app-public-header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Espace Presse</h1>
          <p class="hero-subtitle">
            Ressources et informations pour les m&eacute;dias
          </p>
        </div>
      </section>

      <!-- Kit presse -->
      <section class="section">
        <div class="container">
          <h2>Kit presse</h2>
          <p class="section-intro">
            T&eacute;l&eacute;chargez nos ressources graphiques et visuelles pour vos publications.
          </p>
          <div class="press-grid">
            <div class="press-card">
              <div class="press-card-icon">
                <mat-icon>branding_watermark</mat-icon>
              </div>
              <h3>Logo</h3>
              <p>Logotype Circular Electronics en haute r&eacute;solution (PNG, SVG)</p>
              <button mat-stroked-button color="primary" class="download-btn">
                <mat-icon>download</mat-icon>
                T&eacute;l&eacute;charger
              </button>
            </div>
            <div class="press-card">
              <div class="press-card-icon">
                <mat-icon>palette</mat-icon>
              </div>
              <h3>Charte graphique</h3>
              <p>Couleurs, typographies et r&egrave;gles d'utilisation de la marque</p>
              <button mat-stroked-button color="primary" class="download-btn">
                <mat-icon>download</mat-icon>
                T&eacute;l&eacute;charger
              </button>
            </div>
            <div class="press-card">
              <div class="press-card-icon">
                <mat-icon>photo_library</mat-icon>
              </div>
              <h3>Photos</h3>
              <p>Visuels de la plateforme et photos d'&eacute;quipe libres de droits</p>
              <button mat-stroked-button color="primary" class="download-btn">
                <mat-icon>download</mat-icon>
                T&eacute;l&eacute;charger
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact presse -->
      <section class="section section-alt">
        <div class="container">
          <h2>Contact presse</h2>
          <div class="contact-grid">
            <div class="contact-card">
              <mat-icon>email</mat-icon>
              <h4>Email</h4>
              <p>presse&#64;circular-electronics.fr</p>
            </div>
            <div class="contact-card">
              <mat-icon>phone</mat-icon>
              <h4>T&eacute;l&eacute;phone</h4>
              <p>+33 1 23 45 67 89</p>
            </div>
            <div class="contact-card">
              <mat-icon>schedule</mat-icon>
              <h4>D&eacute;lai de r&eacute;ponse</h4>
              <p>Sous 24 heures</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pour aller plus loin -->
      <section class="section section-crosslinks">
        <div class="container">
          <h2>Pour aller plus loin</h2>
          <div class="crosslinks-grid">
            @for (link of crossLinks; track link.route) {
              <a [routerLink]="link.route" class="crosslink-card">
                <mat-icon>{{ link.icon }}</mat-icon>
                <h3>{{ link.title }}</h3>
                <p>{{ link.description }}</p>
                <span class="crosslink-arrow"><mat-icon>arrow_forward</mat-icon></span>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="section section-cta">
        <div class="container cta-container">
          <h2>Intéressé par notre démarche ?</h2>
          <p>Rejoignez-nous ou contactez un expert pour en savoir plus.</p>
          <div class="dual-cta">
            <a mat-raised-button color="primary" routerLink="/auth/register" class="cta-button">
              <mat-icon>rocket_launch</mat-icon>
              Commencer maintenant
            </a>
            <a mat-stroked-button routerLink="/contact" class="cta-button-secondary">
              <mat-icon>support_agent</mat-icon>
              Contacter un expert
            </a>
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

    .hero {
      background: linear-gradient(135deg, #1a1fd8 0%, #474bfe 50%, #6366f1 100%);
      color: #fff;
      padding: 80px 2rem 3rem 2rem;
      min-height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-content {
      max-width: 800px;
      text-align: center;
    }

    .hero h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      opacity: 0.92;
      line-height: 1.7;
      margin: 0;
    }

    .section {
      padding: 4rem 2rem;
    }

    .section-alt {
      background: #f8f9fb;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
      text-align: center;
    }

    .section-intro {
      text-align: center;
      color: #475569;
      font-size: 1.05rem;
      line-height: 1.7;
      margin: 0 0 2.5rem 0;
    }

    /* Press Grid */
    .press-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .press-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
      transition: box-shadow 0.2s;
    }

    .press-card:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .press-card-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #eef2ff, #e0e7ff);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem auto;
    }

    .press-card-icon mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: #474bfe;
    }

    .press-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .press-card p {
      font-size: 0.9rem;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 1.25rem 0;
    }

    .download-btn {
      font-size: 0.9rem;
    }

    .download-btn mat-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
      margin-right: 0.4rem;
    }

    /* Contact Grid */
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .contact-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
    }

    .contact-card mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #474bfe;
      margin-bottom: 0.75rem;
    }

    .contact-card h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .contact-card p {
      font-size: 0.95rem;
      color: #475569;
      margin: 0;
    }

    /* Cross-links */
    .section-crosslinks {
      background: #f8f9fb;
    }

    .crosslinks-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .crosslink-card {
      display: flex;
      flex-direction: column;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.75rem 1.5rem;
      text-decoration: none;
      transition: box-shadow 0.2s, transform 0.2s;
    }

    .crosslink-card:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .crosslink-card mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #474bfe;
      margin-bottom: 0.75rem;
    }

    .crosslink-card h3 {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .crosslink-card p {
      font-size: 0.9rem;
      color: #475569;
      line-height: 1.5;
      margin: 0;
      flex: 1;
    }

    .crosslink-arrow {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .crosslink-arrow mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: #474bfe;
    }

    /* CTA */
    .section-cta {
      background: #f8f9fb;
    }

    .cta-container {
      text-align: center;
    }

    .cta-container h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }

    .cta-container p {
      color: #475569;
      font-size: 1.05rem;
      margin-bottom: 0;
    }

    /* Dual CTA */
    .dual-cta {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1.5rem;
    }

    .cta-button mat-icon,
    .cta-button-secondary mat-icon {
      margin-right: 0.5rem;
    }

    .cta-button-secondary {
      border: 1px solid #474bfe;
      color: #474bfe;
      padding: 0 2rem;
      height: 36px;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
    }

    .cta-button-secondary:hover {
      background: rgba(71, 75, 254, 0.04);
    }

    /* Responsive */
    @media (max-width: 992px) {
      .press-grid {
        grid-template-columns: 1fr 1fr;
      }

      .contact-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 576px) {
      .hero {
        padding: 60px 1.5rem 2rem 1.5rem;
        min-height: 180px;
      }

      .hero h1 {
        font-size: 1.75rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .section {
        padding: 2.5rem 1.25rem;
      }

      h2 {
        font-size: 1.4rem;
      }

      .press-grid {
        grid-template-columns: 1fr;
      }

      .contact-grid {
        grid-template-columns: 1fr;
      }

      .crosslinks-grid {
        grid-template-columns: 1fr;
      }

      .dual-cta {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class PressComponent {
  crossLinks = [
    { icon: 'flag', title: 'Notre Mission', description: 'Pourquoi nous existons et ce que nous faisons.', route: '/about/mission' },
    { icon: 'handshake', title: 'Partenaires', description: 'Notre écosystème de partenaires.', route: '/about/partners' },
    { icon: 'mail', title: 'Contact', description: 'Pour toute demande d\'interview ou d\'information.', route: '/contact' }
  ];
}
