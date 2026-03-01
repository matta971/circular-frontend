import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-vision',
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
          <h1>Notre Vision</h1>
          <p class="hero-subtitle">
            Un monde où chaque appareil électronique est tracé, valorisé et réintégré
            dans un cycle vertueux, au service d'une économie durable et responsable.
          </p>
        </div>
      </section>

      <!-- Horizon 2030 -->
      <section class="section">
        <div class="container">
          <h2>Horizon 2030</h2>
          <p class="section-intro">
            Nous travaillons à construire un avenir où la traçabilité des équipements électroniques
            est la norme, pas l'exception.
          </p>
          <div class="horizon-grid">
            <div class="horizon-card">
              <mat-icon>devices</mat-icon>
              <h4>Chaque appareil tracé de bout en bout</h4>
              <p>
                De la fabrication au recyclage, chaque équipement dispose d'un passeport numérique
                complet. Fabricants, distributeurs, utilisateurs et recycleurs partagent une vision
                commune du cycle de vie de chaque appareil.
              </p>
            </div>
            <div class="horizon-card">
              <mat-icon>delete_forever</mat-icon>
              <h4>Zéro déchet électronique non tracé</h4>
              <p>
                Aucun appareil ne doit disparaître sans que l'on sache ce qu'il est devenu.
                La traçabilité universelle permet d'éliminer les filières illégales et de garantir
                un traitement responsable de chaque équipement en fin de vie.
              </p>
            </div>
            <div class="horizon-card">
              <mat-icon>autorenew</mat-icon>
              <h4>Allongement de la durée de vie</h4>
              <p>
                En facilitant la réparation et le reconditionnement, nous visons à doubler
                la durée de vie moyenne des appareils électroniques, réduisant ainsi
                la pression sur les ressources naturelles.
              </p>
            </div>
            <div class="horizon-card">
              <mat-icon>groups</mat-icon>
              <h4>Un écosystème unifié</h4>
              <p>
                Tous les acteurs de la chaîne de valeur collaborent sur une plateforme
                commune, partageant données et bonnes pratiques pour maximiser l'impact
                collectif en faveur de la circularité.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Piliers de notre vision -->
      <section class="section section-alt">
        <div class="container">
          <h2>Les piliers de notre vision</h2>
          <p class="section-intro">
            Quatre convictions fondamentales guident notre stratégie et nos choix technologiques.
          </p>
          <div class="pillars-grid">
            <div class="pillar-card">
              <div class="pillar-icon">
                <mat-icon>search</mat-icon>
              </div>
              <h3>Transparence totale</h3>
              <p>
                Chaque étape du cycle de vie d'un appareil doit être visible et vérifiable.
                La confiance naît de la transparence. Nous rendons chaque information
                accessible et auditable par tous les acteurs concernés.
              </p>
            </div>
            <div class="pillar-card">
              <div class="pillar-icon">
                <mat-icon>sync_alt</mat-icon>
              </div>
              <h3>Économie de la fonctionnalité</h3>
              <p>
                Passer de la possession à l'usage. Encourager la location, le partage
                et le reconditionnement plutôt que l'achat neuf systématique.
                L'appareil le plus durable est celui qui sert le plus longtemps.
              </p>
            </div>
            <div class="pillar-card">
              <div class="pillar-icon">
                <mat-icon>accessibility_new</mat-icon>
              </div>
              <h3>Inclusion numérique</h3>
              <p>
                Le reconditionnement permet de rendre les équipements de qualité accessibles
                à tous. Nous contribuons à réduire la fracture numérique en prolongeant
                la vie des appareils et en les redistribuant équitablement.
              </p>
            </div>
            <div class="pillar-card">
              <div class="pillar-icon">
                <mat-icon>assessment</mat-icon>
              </div>
              <h3>Impact mesurable</h3>
              <p>
                Chaque action sur la plateforme génère des données d'impact : CO2 évité,
                matières premières préservées, appareils sauvés. Des indicateurs concrets
                pour guider les décisions et démontrer les résultats.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Chiffres clés -->
      <section class="section">
        <div class="container">
          <h2>Chiffres clés</h2>
          <p class="section-intro">
            Les déchets d'équipements électriques et électroniques (DEEE) représentent
            un enjeu mondial majeur. Voici la réalité en chiffres.
          </p>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-number">53M</span>
              <span class="stat-unit">tonnes / an</span>
              <span class="stat-label">de DEEE produits dans le monde chaque année, un volume en croissance constante</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">22%</span>
              <span class="stat-unit">taux de collecte</span>
              <span class="stat-label">seulement des DEEE sont correctement collectés et recyclés à l'échelle mondiale</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">7 kg</span>
              <span class="stat-unit">par habitant / an</span>
              <span class="stat-label">de déchets électroniques générés en France, soit environ 800 000 tonnes par an</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">57 Mds</span>
              <span class="stat-unit">euros</span>
              <span class="stat-label">de matières premières perdues chaque année dans les DEEE non recyclés</span>
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
          <h2>Partagez notre vision</h2>
          <p>Choisissez votre parcours pour agir avec nous</p>
          <div class="persona-buttons">
            <a routerLink="/citoyen" class="persona-btn persona-citoyen">
              <mat-icon>person</mat-icon>
              <span>Je suis un citoyen</span>
            </a>
            <a routerLink="/association" class="persona-btn persona-association">
              <mat-icon>groups</mat-icon>
              <span>Je suis une association</span>
            </a>
            <a routerLink="/entreprise" class="persona-btn persona-entreprise">
              <mat-icon>business</mat-icon>
              <span>Je suis une entreprise</span>
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
      margin: 0 0 1rem 0;
      text-align: center;
    }

    .section-intro {
      text-align: center;
      color: #475569;
      font-size: 1.05rem;
      line-height: 1.7;
      margin: 0 0 2.5rem 0;
    }

    /* Horizon Grid */
    .horizon-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .horizon-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.75rem;
    }

    .horizon-card mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #474bfe;
      margin-bottom: 0.75rem;
    }

    .horizon-card h4 {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .horizon-card p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }

    /* Pillars Grid */
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .pillar-card {
      background: #fff;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
      border: 1px solid #e2e8f0;
      transition: box-shadow 0.2s;
    }

    .pillar-card:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .pillar-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #eef2ff, #e0e7ff);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem auto;
    }

    .pillar-icon mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: #474bfe;
    }

    .pillar-card h3 {
      font-size: 1.15rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.75rem 0;
    }

    .pillar-card p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .stat-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .stat-number {
      font-size: 2.25rem;
      font-weight: 800;
      color: #1a1fd8;
    }

    .stat-unit {
      font-size: 0.85rem;
      font-weight: 600;
      color: #474bfe;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.5;
      margin-top: 0.5rem;
    }

    /* CTA Section */
    .section-cta {
      background: #f8f9fb;
    }

    .cta-container {
      text-align: center;
    }

    .cta-container p {
      color: #475569;
      font-size: 1.05rem;
      line-height: 1.7;
      margin: 0 0 1.5rem 0;
    }

    .cta-button {
      font-size: 1rem;
      padding: 0 2rem;
      height: 44px;
    }

    .cta-button mat-icon {
      margin-right: 0.5rem;
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

    /* Persona CTA */
    .persona-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .persona-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid transparent;
    }

    .persona-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .persona-btn mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .persona-citoyen {
      background: #e8f5e9;
      color: #2e7d32;
      border-color: #c8e6c9;
    }

    .persona-association {
      background: #e0f2fe;
      color: #0277bd;
      border-color: #b3e5fc;
    }

    .persona-entreprise {
      background: #e3f2fd;
      color: #1565c0;
      border-color: #bbdefb;
    }

    /* Responsive */
    @media (max-width: 768px) {
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

      .horizon-grid {
        grid-template-columns: 1fr;
      }

      .pillars-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .crosslinks-grid {
        grid-template-columns: 1fr;
      }

      .persona-buttons {
        flex-direction: column;
        align-items: center;
      }

      .persona-btn {
        width: 100%;
        max-width: 280px;
        justify-content: center;
      }
    }
  `]
})
export class VisionComponent {
  crossLinks = [
    { icon: 'flag', title: 'Notre Mission', description: 'Accélérer la transition vers une économie circulaire des équipements.', route: '/about/mission' },
    { icon: 'science', title: 'Méthodologie', description: 'Une évaluation transparente et reproductible de chaque appareil.', route: '/trust/methodology' },
    { icon: 'handshake', title: 'Partenaires', description: 'Un écosystème collaboratif réunissant tous les acteurs.', route: '/about/partners' }
  ];
}
