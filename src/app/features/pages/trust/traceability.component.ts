import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-traceability',
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
          <h1>Traçabilité</h1>
          <p class="hero-subtitle">
            Chaque appareil a une histoire. Nous la rendons visible.
          </p>
        </div>
      </section>

      <!-- Comment ça marche -->
      <section class="section">
        <div class="container">
          <h2>Comment ça marche</h2>
          <p class="section-intro">
            En quatre étapes simples, chaque équipement électronique est suivi de bout en bout,
            de sa mise en circulation jusqu'à sa fin de vie.
          </p>
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-number">1</div>
              <mat-icon class="step-icon">qr_code_scanner</mat-icon>
              <h3>Identification</h3>
              <p>
                Chaque appareil reçoit un identifiant unique lié à un QR code.
                Scannez-le pour accéder instantanément à son historique complet.
              </p>
            </div>
            <div class="step-card">
              <div class="step-number">2</div>
              <mat-icon class="step-icon">psychology</mat-icon>
              <h3>Évaluation IA</h3>
              <p>
                Notre intelligence artificielle analyse l'état de l'appareil,
                ses performances et sa valeur résiduelle de manière objective.
              </p>
            </div>
            <div class="step-card">
              <div class="step-number">3</div>
              <mat-icon class="step-icon">timeline</mat-icon>
              <h3>Suivi du cycle de vie</h3>
              <p>
                Chaque étape est enregistrée : production, utilisation, réparation,
                reconditionnement, revente ou recyclage.
              </p>
            </div>
            <div class="step-card">
              <div class="step-number">4</div>
              <mat-icon class="step-icon">verified</mat-icon>
              <h3>Certificat numérique</h3>
              <p>
                Un certificat infalsifiable atteste de l'historique complet
                et de l'état actuel de l'équipement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Technologie blockchain -->
      <section class="section section-alt">
        <div class="container">
          <h2>Technologie blockchain</h2>
          <p class="section-intro">
            La blockchain garantit l'intégrité et la transparence de chaque information enregistrée.
          </p>
          <div class="features-grid">
            <div class="feature-card">
              <mat-icon>menu_book</mat-icon>
              <h3>Registre immuable</h3>
              <p>
                Une fois inscrite, aucune donnée ne peut être modifiée ou supprimée.
                L'historique de chaque appareil est gravé de manière permanente.
              </p>
            </div>
            <div class="feature-card">
              <mat-icon>schedule</mat-icon>
              <h3>Preuve horodatée</h3>
              <p>
                Chaque événement est daté avec précision, créant une chronologie
                fiable et vérifiable par toutes les parties prenantes.
              </p>
            </div>
            <div class="feature-card">
              <mat-icon>fact_check</mat-icon>
              <h3>Certificats vérifiables par tous</h3>
              <p>
                N'importe qui peut vérifier l'authenticité d'un certificat
                directement sur la blockchain, sans intermédiaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bénéfices -->
      <section class="section">
        <div class="container">
          <h2>Bénéfices</h2>
          <div class="benefits-grid">
            <div class="benefit-card">
              <mat-icon class="benefit-icon">business</mat-icon>
              <h3>Pour les entreprises</h3>
              <ul>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Conformité réglementaire simplifiée (REP, loi AGEC)</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Reporting RSE automatisé et données vérifiables</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Valorisation de la démarche d'économie circulaire</span>
                </li>
              </ul>
            </div>
            <div class="benefit-card">
              <mat-icon class="benefit-icon">person</mat-icon>
              <h3>Pour les citoyens</h3>
              <ul>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Transparence totale sur le devenir de vos appareils</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Récompenses pour chaque geste éco-responsable</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Historique complet lors de l'achat d'occasion</span>
                </li>
              </ul>
            </div>
            <div class="benefit-card">
              <mat-icon class="benefit-icon">public</mat-icon>
              <h3>Pour la planète</h3>
              <ul>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Réduction des déchets électroniques (DEEE)</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Allongement de la durée de vie des équipements</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Mesure concrète de l'impact environnemental</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="section section-cta">
        <div class="container" style="text-align: center;">
          <h2>Prêt à tracer vos équipements ?</h2>
          <p>Rejoignez Circular Electronics et donnez une seconde vie à vos appareils.</p>
          <a mat-raised-button color="primary" routerLink="/auth/register" class="cta-button">
            Créer un compte gratuitement
          </a>
        </div>
      </section>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .landing-page {
      font-family: 'Inter', 'Segoe UI', sans-serif;
      color: #1e293b;
      overflow-x: hidden;
    }

    /* Hero */
    .hero {
      background: linear-gradient(135deg, #1a1fd8 0%, #474bfe 50%, #6366f1 100%);
      padding: 80px 2rem 3rem 2rem;
      min-height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .hero-content h1 {
      color: #ffffff;
      font-size: 2.8rem;
      font-weight: 800;
      margin: 0 0 1rem 0;
    }

    .hero-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Sections */
    .section {
      padding: 4rem 2rem;
    }

    .section-alt {
      background: #f8fafc;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    .container h2 {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 1rem;
      color: #1e293b;
    }

    .section-intro {
      text-align: center;
      color: #64748b;
      font-size: 1.1rem;
      max-width: 700px;
      margin: 0 auto 2.5rem auto;
      line-height: 1.6;
    }

    /* Steps Grid */
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    .step-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      position: relative;
    }

    .step-number {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #474bfe;
      color: #ffffff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .step-icon {
      font-size: 2.5rem;
      width: 40px;
      height: 40px;
      color: #474bfe;
      margin: 0.5rem 0;
    }

    .step-card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0.5rem 0;
      color: #1e293b;
    }

    .step-card p {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.5;
      margin: 0;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .feature-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .feature-card mat-icon {
      font-size: 2.5rem;
      width: 40px;
      height: 40px;
      color: #474bfe;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.75rem 0;
      color: #1e293b;
    }

    .feature-card p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* Benefits Grid */
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .benefit-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .benefit-icon {
      font-size: 2.5rem;
      width: 40px;
      height: 40px;
      color: #474bfe;
      margin-bottom: 0.5rem;
    }

    .benefit-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: #1e293b;
    }

    .benefit-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .benefit-card li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
      color: #475569;
      line-height: 1.4;
    }

    .benefit-card li mat-icon {
      font-size: 1.1rem;
      width: 18px;
      height: 18px;
      color: #22c55e;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* CTA Section */
    .section-cta {
      background: #f8fafc;
    }

    .section-cta h2 {
      margin-bottom: 0.75rem;
    }

    .section-cta p {
      color: #64748b;
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }

    .cta-button {
      font-size: 1rem;
      padding: 0.6rem 2rem;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .steps-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .features-grid {
        grid-template-columns: 1fr;
      }
      .benefits-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .hero {
        padding: 70px 1.5rem 2rem 1.5rem;
        min-height: 180px;
      }
      .hero-content h1 {
        font-size: 2rem;
      }
      .hero-subtitle {
        font-size: 1.05rem;
      }
      .section {
        padding: 2.5rem 1.25rem;
      }
      .container h2 {
        font-size: 1.6rem;
      }
      .steps-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TraceabilityComponent {}
