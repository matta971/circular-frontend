import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-association-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    PublicHeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="landing-page">
      <app-public-header currentPage="association"></app-public-header>

      <!-- Hero Section -->
      <section class="hero" id="concept">
        <div class="hero-content">
          <h1>Donnez plus de visibilite et de valeur a vos actions.</h1>
          <p class="hero-subtitle">
            Circular Electronics accompagne les associations dans la collecte,
            la tracabilite et la valorisation des equipements electroniques.
          </p>
          <div class="hero-cta">
            <a mat-raised-button color="primary" routerLink="/auth/register" class="cta-primary">
              Devenir association partenaire
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-illustration">
            <mat-icon class="hero-icon">groups</mat-icon>
          </div>
        </div>
      </section>

      <!-- Reality Section -->
      <section class="section section-reality" id="impact">
        <div class="container">
          <h2>Vous agissez, mais votre impact est peu visible.</h2>
          <p class="section-text">
            Les associations font un travail essentiel, souvent avec peu de moyens :
          </p>
          <div class="reality-items">
            <div class="reality-item">
              <mat-icon>devices</mat-icon>
              <span>Peu d'outils</span>
            </div>
            <div class="reality-item">
              <mat-icon>schedule</mat-icon>
              <span>Peu de temps</span>
            </div>
            <div class="reality-item">
              <mat-icon>thumb_down_off_alt</mat-icon>
              <span>Peu de reconnaissance</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Solution Section -->
      <section class="section section-solution" id="how-it-works">
        <div class="container">
          <h2>Une plateforme pensee pour les acteurs de l'ESS.</h2>
          <div class="features">
            <div class="feature">
              <div class="feature-icon feature-tracability">
                <mat-icon>receipt_long</mat-icon>
              </div>
              <h3>Tracabilite simplifiee</h3>
              <p>Declarez vos collectes sans complexite reglementaire.</p>
            </div>
            <div class="feature">
              <div class="feature-icon feature-visibility">
                <mat-icon>campaign</mat-icon>
              </div>
              <h3>Visibilite Publique</h3>
              <p>Vos actions sont valorisees aupres des citoyens et partenaires.</p>
            </div>
            <div class="feature">
              <div class="feature-icon feature-coordination">
                <mat-icon>hub</mat-icon>
              </div>
              <h3>Coordination Ecosysteme</h3>
              <p>Vous etes integres a un reseau structure et fiable.</p>
            </div>
            <div class="feature">
              <div class="feature-icon feature-support">
                <mat-icon>support</mat-icon>
              </div>
              <h3>Soutien & Avantages</h3>
              <p>Acces a des conditions adaptees et a des avantages partenaires.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Partnership Section -->
      <section class="section section-partnership" id="partners">
        <div class="container">
          <h2>Un partenariat respectueux des valeurs de l'ESS</h2>
          <div class="partnership-content">
            <div class="partnership-illustration">
              <mat-icon>handshake</mat-icon>
            </div>
            <div class="partnership-text">
              <p>
                Circular Electronics ne remplace pas les associations.<br>
                Elle leur donne un cadre, des outils et de la reconnaissance.
              </p>
              <ul>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  Respect de l'economie sociale et solidaire
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  Tarification adaptee a vos moyens
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  Gouvernance claire et transparente
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="section section-final-cta">
        <div class="container">
          <h2>Parlons de votre association</h2>
          <p>Decouvrez comment Circular Electronics peut vous accompagner.</p>
          <a mat-raised-button color="primary" routerLink="/contact" class="cta-final">
            Nous contacter
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
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%);
      padding: 4rem 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4rem;
      min-height: 450px;
    }

    .hero-content {
      max-width: 600px;
    }

    .hero h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--ce-gray-900, #212121);
      line-height: 1.2;
      margin: 0 0 1.5rem 0;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: var(--ce-gray-700, #616161);
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
      background: #0ea5e9;

      &:hover {
        background: #0284c7;
      }
    }

    .hero-visual {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-illustration {
      width: 250px;
      height: 250px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    }

    .hero-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: #0ea5e9;
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
      margin-bottom: 2rem;
    }

    /* Reality Section */
    .section-reality {
      background: var(--ce-gray-50, #fafafa);
    }

    .reality-items {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .reality-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 2rem;
      background: white;
      border-radius: var(--ce-radius-md, 8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      min-width: 150px;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: var(--ce-gray-400, #bdbdbd);
      }

      span {
        color: var(--ce-gray-600, #757575);
        font-weight: 500;
      }
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
      transition: transform 0.2s, box-shadow 0.2s;

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

    .feature-tracability {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }

    .feature-visibility {
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    }

    .feature-coordination {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .feature-support {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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

    /* Partnership Section */
    .section-partnership {
      background: var(--ce-gray-50, #fafafa);
    }

    .partnership-content {
      display: flex;
      align-items: center;
      gap: 4rem;
      max-width: 900px;
      margin: 3rem auto 0;
    }

    .partnership-illustration {
      flex-shrink: 0;
      width: 180px;
      height: 180px;
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 90px;
        width: 90px;
        height: 90px;
        color: white;
      }
    }

    .partnership-text {
      p {
        font-size: 1.1rem;
        color: var(--ce-gray-700, #616161);
        line-height: 1.6;
        margin: 0 0 1.5rem 0;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      li {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--ce-gray-700, #616161);

        mat-icon {
          color: #22c55e;
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }
    }

    /* Final CTA Section */
    .section-final-cta {
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
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
      color: #0ea5e9;
      padding: 0.875rem 2.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 24px;

      &:hover {
        background: var(--ce-gray-100, #f5f5f5);
      }
    }

    /* Responsive */
    @media (max-width: 992px) {
      .hero {
        flex-direction: column;
        text-align: center;
        padding: 3rem 1.5rem;
      }

      .hero-cta {
        justify-content: center;
      }

      .features {
        grid-template-columns: repeat(2, 1fr);
      }

      .partnership-content {
        flex-direction: column;
        text-align: center;
      }

      .partnership-text ul {
        align-items: center;
      }
    }

    @media (max-width: 576px) {
      .hero h1 {
        font-size: 1.75rem;
      }

      .hero-illustration {
        width: 180px;
        height: 180px;
      }

      .hero-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
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

      .reality-items {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class AssociationLandingComponent {
  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
