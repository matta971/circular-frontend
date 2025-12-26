import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-citoyen-landing',
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
      <app-public-header currentPage="citoyen"></app-public-header>

      <!-- Hero Section -->
      <section class="hero" id="concept">
        <div class="hero-content">
          <h1>Donnez une seconde vie à vos appareils et soyez récompensé.</h1>
          <p class="hero-subtitle">
            Evaluez, réparez, revendez ou recyclez vos équipements électroniques.
            Gagnez des tokens à chaque geste eco-responsable, en toute transparence.
          </p>
          <div class="hero-cta">
            <a mat-raised-button color="primary" routerLink="/auth/register" class="cta-primary">
              Commencer simplement
            </a>
            <a mat-button class="cta-secondary" (click)="scrollTo('how-it-works')">
              Comprendre le concept
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-illustration">
            <mat-icon class="hero-icon">recycling</mat-icon>
          </div>
        </div>
      </section>

      <!-- Problem Section -->
      <section class="section section-problem" id="impact">
        <div class="container">
          <h2>Recycler est devenu complique. Nous l'avons simplifie.</h2>
          <p class="section-text">
            Aujourd'hui, beaucoup de citoyens veulent bien faire, mais ne savent pas :
          </p>
          <ul class="problem-list">
            <li>
              <mat-icon>help_outline</mat-icon>
              <span>Ou deposer leurs appareils</span>
            </li>
            <li>
              <mat-icon>visibility_off</mat-icon>
              <span>Ce qu'ils deviennent reellement</span>
            </li>
            <li>
              <mat-icon>trending_down</mat-icon>
              <span>Si leur geste a un veritable impact</span>
            </li>
          </ul>
          <p class="section-conclusion">
            Resultat : des equipements stockes, jetes ou mal recycles.
          </p>
        </div>
      </section>

      <!-- Solution Section -->
      <section class="section section-solution">
        <div class="container">
          <h2>Une plateforme pour coordonner, tracer et donner confiance.</h2>
          <div class="pillars">
            <div class="pillar">
              <div class="pillar-icon">
                <mat-icon>search</mat-icon>
              </div>
              <h3>Tracabilite</h3>
              <p>Chaque appareil est suivi. Vous savez s'il est repare, reemploye ou recycle.</p>
            </div>
            <div class="pillar">
              <div class="pillar-icon">
                <mat-icon>sync</mat-icon>
              </div>
              <h3>Coordination</h3>
              <p>Associations, reparateurs et recycleurs travaillent ensemble dans un meme cadre.</p>
            </div>
            <div class="pillar">
              <div class="pillar-icon">
                <mat-icon>eco</mat-icon>
              </div>
              <h3>Incitation</h3>
              <p>Votre geste a une valeur environnementale, sociale et collective.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="section section-benefits" id="benefits">
        <div class="container">
          <h2>Tout ce que vous pouvez faire avec Circular</h2>
          <p class="section-text">
            Des outils simples pour valoriser vos appareils et agir pour la planete
          </p>
          <div class="benefits-grid">
            <div class="benefit-card">
              <div class="benefit-icon">
                <mat-icon>calculate</mat-icon>
              </div>
              <h3>Evaluez la valeur</h3>
              <p>Obtenez instantanement une estimation de la valeur de votre appareil grace a notre IA. Simple, rapide et transparent.</p>
              <ul class="benefit-features">
                <li><mat-icon>check_circle</mat-icon> Estimation en quelques secondes</li>
                <li><mat-icon>check_circle</mat-icon> Prix du marche actualise</li>
                <li><mat-icon>check_circle</mat-icon> Comparaison avec les prix neufs</li>
              </ul>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <mat-icon>build</mat-icon>
              </div>
              <h3>Reparez facilement</h3>
              <p>Decouvrez si votre appareil est reparable, ou le faire reparer et a quel cout estime.</p>
              <ul class="benefit-features">
                <li><mat-icon>check_circle</mat-icon> Score de reparabilite</li>
                <li><mat-icon>check_circle</mat-icon> Reparateurs certifies pres de chez vous</li>
                <li><mat-icon>check_circle</mat-icon> Estimation du cout de reparation</li>
              </ul>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <mat-icon>storefront</mat-icon>
              </div>
              <h3>Revendez simplement</h3>
              <p>Mettez en vente vos appareils sur notre marketplace ou trouvez un acheteur solidaire.</p>
              <ul class="benefit-features">
                <li><mat-icon>check_circle</mat-icon> Annonces en quelques clics</li>
                <li><mat-icon>check_circle</mat-icon> Certificat de tracabilite inclus</li>
                <li><mat-icon>check_circle</mat-icon> Paiement securise</li>
              </ul>
            </div>
            <div class="benefit-card highlight">
              <div class="benefit-icon">
                <mat-icon>card_giftcard</mat-icon>
              </div>
              <h3>Gagnez des recompenses</h3>
              <p>Chaque geste eco-responsable vous rapporte des tokens echangeables contre des avantages.</p>
              <ul class="benefit-features">
                <li><mat-icon>check_circle</mat-icon> Tokens pour chaque appareil depose</li>
                <li><mat-icon>check_circle</mat-icon> Bonus si reparation ou reemploi</li>
                <li><mat-icon>check_circle</mat-icon> Echangez contre des bons d'achat</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- How it Works Section -->
      <section class="section section-steps" id="how-it-works">
        <div class="container">
          <h2>Comment ca marche</h2>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-icon">
                <mat-icon>smartphone</mat-icon>
              </div>
              <h3>Scannez ou decrivez</h3>
              <p>Photographiez ou decrivez votre appareil</p>
            </div>
            <div class="step-arrow">
              <mat-icon>arrow_forward</mat-icon>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-icon">
                <mat-icon>analytics</mat-icon>
              </div>
              <h3>Evaluation instantanee</h3>
              <p>Valeur, reparabilite, options de valorisation</p>
            </div>
            <div class="step-arrow">
              <mat-icon>arrow_forward</mat-icon>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-icon">
                <mat-icon>alt_route</mat-icon>
              </div>
              <h3>Choisissez votre option</h3>
              <p>Reparer, revendre, recycler ou donner</p>
            </div>
            <div class="step-arrow">
              <mat-icon>arrow_forward</mat-icon>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-icon">
                <mat-icon>emoji_events</mat-icon>
              </div>
              <h3>Recevez vos recompenses</h3>
              <p>Tokens et certificat d'impact</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Section -->
      <section class="section section-trust" id="partners">
        <div class="container">
          <h2>Pourquoi nous faire confiance</h2>
          <div class="trust-items">
            <div class="trust-item">
              <mat-icon>verified</mat-icon>
              <span>Acteurs partenaires certifies</span>
            </div>
            <div class="trust-item">
              <mat-icon>visibility</mat-icon>
              <span>Demarche transparente</span>
            </div>
            <div class="trust-item">
              <mat-icon>favorite</mat-icon>
              <span>Logique d'economie circulaire et solidaire</span>
            </div>
            <div class="trust-item">
              <mat-icon>fact_check</mat-icon>
              <span>Donnees claires, accessibles et verifiables</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="section section-final-cta">
        <div class="container">
          <h2>Rejoindre une demarche responsable</h2>
          <p>Participez a l'economie circulaire en toute simplicite.</p>
          <a mat-raised-button color="primary" routerLink="/auth/register" class="cta-final">
            Commencer maintenant
          </a>
          <p class="no-engagement">Sans engagement</p>
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
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
      padding: calc(80px + 2rem) 2rem 4rem 2rem; // 80px for fixed header + content padding
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4rem;
      min-height: calc(500px + 80px);
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
    }

    .cta-secondary {
      color: var(--ce-gray-700, #616161);
      font-weight: 500;
    }

    .hero-visual {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-illustration {
      width: 300px;
      height: 300px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    }

    .hero-icon {
      font-size: 150px;
      width: 150px;
      height: 150px;
      color: var(--ce-secondary, #19e166);
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

    /* Problem Section */
    .section-problem {
      background: var(--ce-gray-50, #fafafa);
    }

    .problem-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 500px;
      margin: 0 auto 2rem;
    }

    .problem-list li {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: white;
      border-radius: var(--ce-radius-md, 8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      mat-icon {
        color: var(--ce-gray-500, #9e9e9e);
      }

      span {
        color: var(--ce-gray-700, #616161);
        font-size: 1rem;
      }
    }

    .section-conclusion {
      text-align: center;
      color: var(--ce-gray-600, #757575);
      font-style: italic;
    }

    /* Solution Section */
    .section-solution {
      background: white;
    }

    /* Benefits Section */
    .section-benefits {
      background: linear-gradient(180deg, #f8fdf9 0%, #e8f5e9 100%);
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .benefit-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .benefit-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }

    .benefit-card.highlight {
      background: linear-gradient(135deg, #19e166 0%, #12b050 100%);
      color: white;

      h3, p {
        color: white;
      }

      .benefit-icon {
        background: rgba(255, 255, 255, 0.2);

        mat-icon {
          color: white;
        }
      }

      .benefit-features li {
        color: rgba(255, 255, 255, 0.95);

        mat-icon {
          color: white;
        }
      }
    }

    .benefit-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: var(--ce-secondary, #19e166);
      }
    }

    .benefit-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--ce-gray-900, #212121);
      margin: 0 0 0.75rem 0;
    }

    .benefit-card > p {
      color: var(--ce-gray-600, #757575);
      line-height: 1.6;
      margin: 0 0 1.25rem 0;
    }

    .benefit-features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--ce-gray-700, #616161);

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: var(--ce-secondary, #19e166);
        }
      }
    }

    .pillars {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 3rem;
    }

    .pillar {
      text-align: center;
      padding: 2rem;
    }

    .pillar-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--ce-secondary, #19e166) 0%, #12b050 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;

      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: white;
      }
    }

    .pillar h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--ce-gray-900, #212121);
      margin: 0 0 0.75rem 0;
    }

    .pillar p {
      color: var(--ce-gray-600, #757575);
      line-height: 1.6;
      margin: 0;
    }

    /* Steps Section */
    .section-steps {
      background: var(--ce-gray-50, #fafafa);
    }

    .steps {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 1rem;
      margin-top: 3rem;
    }

    .step {
      text-align: center;
      padding: 1.5rem;
      flex: 1;
      max-width: 250px;
    }

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--ce-primary, #1a1fd8);
      color: white;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    .step-icon {
      width: 100px;
      height: 100px;
      border-radius: 16px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--ce-secondary, #19e166);
      }
    }

    .step h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--ce-gray-900, #212121);
      margin: 0 0 0.5rem 0;
    }

    .step p {
      color: var(--ce-gray-600, #757575);
      font-size: 0.9rem;
      margin: 0;
    }

    .step-arrow {
      display: flex;
      align-items: center;
      padding-top: 80px;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: var(--ce-gray-400, #bdbdbd);
      }
    }

    /* Trust Section */
    .section-trust {
      background: white;
    }

    .trust-items {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      max-width: 800px;
      margin: 3rem auto 0;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--ce-gray-50, #fafafa);
      border-radius: var(--ce-radius-md, 8px);
      border-left: 4px solid var(--ce-secondary, #19e166);

      mat-icon {
        color: var(--ce-secondary, #19e166);
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      span {
        color: var(--ce-gray-700, #616161);
        font-weight: 500;
      }
    }

    /* Final CTA Section */
    .section-final-cta {
      background: linear-gradient(135deg, var(--ce-secondary, #19e166) 0%, #12b050 100%);
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
      color: var(--ce-secondary, #19e166);
      padding: 0.875rem 2.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 24px;

      &:hover {
        background: var(--ce-gray-100, #f5f5f5);
      }
    }

    .no-engagement {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      margin-top: 1rem;
      margin-bottom: 0;
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

      .pillars {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .benefits-grid {
        grid-template-columns: 1fr;
      }

      .steps {
        flex-direction: column;
        align-items: center;
      }

      .step-arrow {
        transform: rotate(90deg);
        padding: 0;
      }

      .trust-items {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 576px) {
      .hero h1 {
        font-size: 1.75rem;
      }

      .hero-illustration {
        width: 200px;
        height: 200px;
      }

      .hero-icon {
        font-size: 100px;
        width: 100px;
        height: 100px;
      }

      .section {
        padding: 3rem 1rem;
      }

      .section h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class CitoyenLandingComponent {
  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
