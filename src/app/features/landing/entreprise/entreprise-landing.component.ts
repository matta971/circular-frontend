import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-entreprise-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    PublicHeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="landing-page">
      <app-public-header currentPage="entreprise"></app-public-header>

      <!-- Hero Section -->
      <section class="hero" id="concept">
        <div class="hero-background"></div>
        <div class="hero-content">
          <h1><span class="highlight">La conformité environnementale,</span> en toute confiance.</h1>
          <p class="hero-subtitle">
            Pilotez, tracez et valorisez la gestion de vos équipements électroniques.
          </p>
          <div class="hero-cta">
            <a mat-raised-button color="primary" routerLink="/auth/register" class="cta-primary">
              Découvrir la solution
            </a>
            <a mat-stroked-button class="cta-secondary" routerLink="/contact">
              Demander une démo
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-card">
            <div class="card-header">
              <img src="logo.svg" alt="Circular Electronics" class="card-logo" />
            </div>
            <div class="card-content">
              <div class="metric">
                <span class="metric-value">98%</span>
                <span class="metric-label">Traçabilité</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Regulations Section -->
      <section class="section section-regulations" id="impact">
        <div class="container">
          <div class="regulation-badges">
            <span class="badge">REP</span>
            <span class="separator">·</span>
            <span class="badge">DEEE</span>
            <span class="separator">·</span>
            <span class="badge">RSE</span>
            <span class="separator">·</span>
            <span class="badge">Audits</span>
          </div>
          <h2>Des obligations croissantes, des preuves indispensables.</h2>
          <p class="section-text">
            REP, DEEE, RSE, audits : les entreprises doivent aujourd'hui démontrer
            leurs engagements environnementaux de manière claire et vérifiable.
          </p>
        </div>
      </section>

      <!-- Solution Section -->
      <section class="section section-solution" id="how-it-works">
        <div class="container">
          <h2>Une plateforme de pilotage et de preuve.</h2>
          <div class="features">
            <div class="feature">
              <div class="feature-icon feature-pilotage">
                <mat-icon>dashboard</mat-icon>
              </div>
              <h3>Pilotage Centralisé</h3>
              <p>Suivez vos flux d'équipements en temps réel.</p>
            </div>
            <div class="feature">
              <div class="feature-icon feature-tracability">
                <mat-icon>verified</mat-icon>
              </div>
              <h3>Traçabilité Opposable</h3>
              <p>Chaque lot est documenté et horodaté.</p>
            </div>
            <div class="feature">
              <div class="feature-icon feature-coordination">
                <mat-icon>account_tree</mat-icon>
              </div>
              <h3>Coordination des Acteurs</h3>
              <p>Tous les acteurs intégrés dans un cadre commun.</p>
            </div>
            <div class="feature">
              <div class="feature-icon feature-rse">
                <mat-icon>eco</mat-icon>
              </div>
              <h3>Valorisation RSE</h3>
              <p>Transformez vos obligations en actif RSE.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Target Section -->
      <section class="section section-target" id="partners">
        <div class="container">
          <h2>Pour qui ?</h2>
          <div class="targets">
            <div class="target">
              <mat-icon>business</mat-icon>
              <span>PME et ETI</span>
            </div>
            <div class="target">
              <mat-icon>corporate_fare</mat-icon>
              <span>Grands groupes</span>
            </div>
            <div class="target">
              <mat-icon>account_balance</mat-icon>
              <span>Acteurs publics</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Us Section -->
      <section class="section section-why">
        <div class="container">
          <h2>Pourquoi Circular Electronics</h2>
          <div class="why-items">
            <div class="why-item">
              <div class="why-icon">
                <mat-icon>balance</mat-icon>
              </div>
              <div class="why-content">
                <h3>Neutralité</h3>
                <p>Une plateforme indépendante au service de tous les acteurs.</p>
              </div>
            </div>
            <div class="why-item">
              <div class="why-icon">
                <mat-icon>visibility</mat-icon>
              </div>
              <div class="why-content">
                <h3>Transparence</h3>
                <p>Des données claires, accessibles et auditables.</p>
              </div>
            </div>
            <div class="why-item">
              <div class="why-icon">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="why-content">
                <h3>Vision long terme</h3>
                <p>Une solution évolutive qui accompagne vos objectifs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="section section-final-cta">
        <div class="container">
          <h2>Échanger avec un expert Circular Electronics</h2>
          <p>Découvrez comment optimiser la gestion de vos équipements électroniques.</p>
          <a mat-raised-button color="primary" class="cta-final" routerLink="/contact">
            Demander une démo
          </a>
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

    /* Hero Section */
    .hero {
      position: relative;
      background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%);
      padding: 80px 2rem 4rem 2rem; // 80px for fixed header
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4rem;
      min-height: 450px;
      overflow: hidden;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 50px 50px;
    }

    .hero-content {
      max-width: 550px;
      position: relative;
      z-index: 1;
    }

    .hero h1 {
      font-size: 2.25rem;
      font-weight: 700;
      color: white;
      line-height: 1.3;
      margin: 0 0 1.5rem 0;
    }

    .highlight {
      color: #93c5fd;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.6;
      margin: 0 0 2rem 0;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .cta-primary {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 24px;
      background: white;
      color: #1d4ed8;

      &:hover {
        background: #f0f9ff;
      }
    }

    .cta-secondary {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 24px;
      border-color: rgba(255, 255, 255, 0.5);
      color: white;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: white;
      }
    }

    .hero-visual {
      position: relative;
      z-index: 1;
    }

    .hero-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      min-width: 280px;
    }

    .card-header {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .card-logo {
      height: 240px; // 60px * 4
    }

    .card-content {
      text-align: center;
    }

    .metric {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .metric-value {
      font-size: 3rem;
      font-weight: 700;
      color: #1d4ed8;
    }

    .metric-label {
      color: var(--ce-gray-600, #757575);
      font-weight: 500;
    }

    /* Sections */
    .section {
      padding: 5rem 2rem;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .section h2 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--ce-gray-900, #212121);
      text-align: center;
      margin: 0 0 2rem 0;
    }

    .section-text {
      text-align: center;
      color: var(--ce-gray-600, #757575);
      font-size: 1.1rem;
      max-width: 700px;
      margin: 0 auto;
    }

    /* Regulations Section */
    .section-regulations {
      background: var(--ce-gray-50, #fafafa);
    }

    .regulation-badges {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .badge {
      background: #1d4ed8;
      color: white;
      padding: 0.5rem 1.25rem;
      border-radius: 24px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .separator {
      color: var(--ce-gray-400, #bdbdbd);
      font-size: 1.5rem;
    }

    /* Solution Section */
    .section-solution {
      background: white;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-top: 3rem;
    }

    .feature {
      text-align: center;
      padding: 2rem 1rem;
      background: var(--ce-gray-50, #fafafa);
      border-radius: var(--ce-radius-lg, 12px);
      border-top: 4px solid transparent;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }
    }

    .feature-icon {
      width: 70px;
      height: 70px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;

      mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        color: white;
      }
    }

    .feature-pilotage {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    }

    .feature-tracability {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }

    .feature-coordination {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .feature-rse {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    }

    .feature h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--ce-gray-900, #212121);
      margin: 0 0 0.5rem 0;
    }

    .feature p {
      color: var(--ce-gray-600, #757575);
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }

    /* Target Section */
    .section-target {
      background: var(--ce-gray-50, #fafafa);
    }

    .targets {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-top: 2rem;
    }

    .target {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: white;
      border-radius: var(--ce-radius-md, 8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #1d4ed8;
      }

      span {
        font-weight: 500;
        color: var(--ce-gray-700, #616161);
      }
    }

    /* Why Section */
    .section-why {
      background: white;
    }

    .why-items {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 3rem;
    }

    .why-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
    }

    .why-icon {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: white;
      }
    }

    .why-content h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--ce-gray-900, #212121);
      margin: 0 0 0.5rem 0;
    }

    .why-content p {
      color: var(--ce-gray-600, #757575);
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0;
    }

    /* Final CTA Section */
    .section-final-cta {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      text-align: center;
      padding: 4rem 2rem;
    }

    .section-final-cta h2 {
      color: white;
      margin-bottom: 1rem;
    }

    .section-final-cta p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .cta-final {
      background: white;
      color: #1d4ed8;
      padding: 0.875rem 2.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 24px;

      &:hover {
        background: #f0f9ff;
      }
    }

    /* Responsive */
    @media (max-width: 992px) {
      .hero {
        flex-direction: column;
        text-align: center;
        padding: 80px 1.5rem 3rem 1.5rem;
      }

      .hero-cta {
        justify-content: center;
      }

      .features {
        grid-template-columns: repeat(2, 1fr);
      }

      .targets {
        flex-wrap: wrap;
        gap: 1rem;
      }

      .why-items {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 576px) {
      .hero h1 {
        font-size: 1.75rem;
      }

      .hero-card {
        min-width: 220px;
      }

      .metric-value {
        font-size: 2.5rem;
      }

      .section {
        padding: 3rem 1rem;
      }

      .section h2 {
        font-size: 1.5rem;
      }

      .features {
        grid-template-columns: 1fr;
      }

      .regulation-badges {
        flex-wrap: wrap;
      }
    }
  `]
})
export class EntrepriseLandingComponent {
  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
