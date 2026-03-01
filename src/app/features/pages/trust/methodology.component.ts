import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-methodology',
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
          <h1>Méthodologie</h1>
          <p class="hero-subtitle">
            Une évaluation transparente et reproductible
          </p>
        </div>
      </section>

      <!-- Notre approche -->
      <section class="section">
        <div class="container">
          <h2>Notre approche</h2>
          <p class="section-intro">
            Circular Electronics s'appuie sur une méthodologie rigoureuse pour évaluer
            chaque équipement de manière objective et cohérente.
          </p>
          <div class="approach-grid">
            <div class="approach-card">
              <mat-icon>psychology</mat-icon>
              <h3>Évaluation multicritère par IA</h3>
              <p>
                Notre intelligence artificielle analyse simultanément plusieurs dimensions
                de l'appareil : état physique, performances, compatibilité logicielle
                et valeur de marché, pour produire une évaluation complète.
              </p>
            </div>
            <div class="approach-card">
              <mat-icon>score</mat-icon>
              <h3>Scoring objectif</h3>
              <p>
                Chaque critère est noté selon une échelle standardisée.
                Le score final est calculé de manière algorithmique, éliminant
                tout biais humain dans le processus d'évaluation.
              </p>
            </div>
            <div class="approach-card">
              <mat-icon>menu_book</mat-icon>
              <h3>Barèmes publics</h3>
              <p>
                Tous nos barèmes de notation sont publiés et accessibles.
                Vous pouvez comprendre exactement comment le score de votre
                appareil a été calculé.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Critères d'évaluation -->
      <section class="section section-alt">
        <div class="container">
          <h2>Critères d'évaluation</h2>
          <p class="section-intro">
            Chaque appareil est évalué selon cinq critères fondamentaux
            qui déterminent sa valeur résiduelle et son potentiel de seconde vie.
          </p>
          <div class="criteria-list">
            <div class="criteria-item">
              <div class="criteria-number">1</div>
              <mat-icon>devices</mat-icon>
              <div class="criteria-content">
                <h3>État physique</h3>
                <p>
                  Inspection de l'état extérieur (rayures, chocs, oxydation),
                  de l'écran (pixels morts, fissures) et des connecteurs.
                  Chaque défaut est catégorisé et pondéré.
                </p>
              </div>
            </div>
            <div class="criteria-item">
              <div class="criteria-number">2</div>
              <mat-icon>speed</mat-icon>
              <div class="criteria-content">
                <h3>Performance technique</h3>
                <p>
                  Analyse du processeur, de la mémoire, du stockage et de la batterie.
                  Tests de benchmark pour mesurer les performances réelles
                  par rapport aux spécifications d'origine.
                </p>
              </div>
            </div>
            <div class="criteria-item">
              <div class="criteria-number">3</div>
              <mat-icon>system_update</mat-icon>
              <div class="criteria-content">
                <h3>Obsolescence logicielle</h3>
                <p>
                  Vérification de la compatibilité avec les dernières mises à jour
                  de sécurité et du système d'exploitation. Évaluation de la durée
                  de support restante du fabricant.
                </p>
              </div>
            </div>
            <div class="criteria-item">
              <div class="criteria-number">4</div>
              <mat-icon>trending_up</mat-icon>
              <div class="criteria-content">
                <h3>Valeur marché secondaire</h3>
                <p>
                  Analyse des prix de revente actuels sur le marché de l'occasion.
                  Prise en compte de la demande, de la rareté et de la cote
                  du modèle pour estimer une valeur juste.
                </p>
              </div>
            </div>
            <div class="criteria-item">
              <div class="criteria-number">5</div>
              <mat-icon>eco</mat-icon>
              <div class="criteria-content">
                <h3>Impact environnemental</h3>
                <p>
                  Calcul de l'empreinte carbone évitée par le réemploi ou le reconditionnement.
                  Estimation des matières premières économisées
                  et des déchets évités grâce à l'allongement de la durée de vie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Transparence algorithmique -->
      <section class="section">
        <div class="container">
          <h2>Transparence algorithmique</h2>
          <p class="section-intro">
            Nous croyons que la confiance naît de la transparence.
            Voici nos engagements.
          </p>
          <div class="transparency-grid">
            <div class="transparency-card">
              <mat-icon>code</mat-icon>
              <h3>Code auditable</h3>
              <p>
                Notre algorithme d'évaluation peut être audité par des tiers indépendants.
                Nous publions régulièrement des rapports d'audit
                pour garantir l'intégrité du processus.
              </p>
            </div>
            <div class="transparency-card">
              <mat-icon>description</mat-icon>
              <h3>Barèmes documentés</h3>
              <p>
                Chaque critère de notation est documenté en détail : poids dans le score final,
                seuils de classification, méthode de calcul.
                Tout est accessible publiquement.
              </p>
            </div>
            <div class="transparency-card">
              <mat-icon>rate_review</mat-icon>
              <h3>Contestation possible</h3>
              <p>
                Vous n'êtes pas d'accord avec une évaluation ? Vous pouvez demander
                une réévaluation avec justificatifs. Chaque contestation
                est traitée dans un délai de 48 heures.
              </p>
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
        <div class="container" style="text-align: center;">
          <h2>Une évaluation fiable et transparente</h2>
          <p>Faites évaluer vos équipements selon notre méthodologie rigoureuse.</p>
          <div class="dual-cta">
            <a mat-raised-button color="primary" routerLink="/contact" class="cta-button">
              <mat-icon>calendar_today</mat-icon>
              Demander une démo
            </a>
            <a mat-stroked-button routerLink="/auth/register" class="cta-button-secondary">
              <mat-icon>person_add</mat-icon>
              Créer un compte
            </a>
          </div>
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

    /* Approach Grid */
    .approach-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .approach-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .approach-card mat-icon {
      font-size: 2.5rem;
      width: 40px;
      height: 40px;
      color: #474bfe;
      margin-bottom: 1rem;
    }

    .approach-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.75rem 0;
      color: #1e293b;
    }

    .approach-card p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* Criteria List */
    .criteria-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .criteria-item {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      position: relative;
    }

    .criteria-number {
      position: absolute;
      top: -10px;
      left: -10px;
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

    .criteria-item mat-icon {
      font-size: 2rem;
      width: 32px;
      height: 32px;
      color: #474bfe;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .criteria-content h3 {
      font-size: 1.05rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #1e293b;
    }

    .criteria-content p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* Transparency Grid */
    .transparency-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .transparency-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .transparency-card mat-icon {
      font-size: 2.5rem;
      width: 40px;
      height: 40px;
      color: #474bfe;
      margin-bottom: 1rem;
    }

    .transparency-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.75rem 0;
      color: #1e293b;
    }

    .transparency-card p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
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

    /* Cross-links */
    .section-crosslinks {
      background: #f8fafc;
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
      color: #64748b;
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
    @media (max-width: 900px) {
      .approach-grid {
        grid-template-columns: 1fr;
      }
      .transparency-grid {
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
      .criteria-item {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class MethodologyComponent {
  crossLinks = [
    { icon: 'verified_user', title: 'Tra\u00e7abilit\u00e9', description: 'Comment nous tra\u00e7ons chaque \u00e9quipement de bout en bout.', route: '/trust/traceability' },
    { icon: 'shield', title: 'S\u00e9curit\u00e9 des donn\u00e9es', description: 'La protection de vos donn\u00e9es est notre priorit\u00e9.', route: '/trust/data-security' },
    { icon: 'bar_chart', title: '\u00c9tudes & Chiffres', description: 'Les donn\u00e9es cl\u00e9s de l\'\u00e9conomie circulaire.', route: '/resources/studies' }
  ];
}
