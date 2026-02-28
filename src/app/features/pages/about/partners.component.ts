import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-partners',
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
          <h1>Nos Partenaires</h1>
          <p class="hero-subtitle">
            Un écosystème collaboratif réunissant tous les acteurs de la chaîne de valeur
            des équipements électroniques pour construire ensemble une économie circulaire efficace.
          </p>
        </div>
      </section>

      <!-- Un écosystème collaboratif -->
      <section class="section">
        <div class="container">
          <h2>Un écosystème collaboratif</h2>
          <p class="section-intro">
            La transition vers une économie circulaire des équipements électroniques ne peut pas
            se faire seul. Circular Electronics fédère un réseau de partenaires complémentaires :
            réparateurs, reconditionneurs, recycleurs, collectivités, associations et entreprises.
          </p>
          <div class="ecosystem-highlights">
            <div class="highlight-item">
              <mat-icon>handshake</mat-icon>
              <div>
                <h4>Collaboration</h4>
                <p>Chaque partenaire apporte son expertise unique pour couvrir l'ensemble du cycle de vie des appareils.</p>
              </div>
            </div>
            <div class="highlight-item">
              <mat-icon>sync</mat-icon>
              <div>
                <h4>Interopérabilité</h4>
                <p>Notre plateforme connecte les systèmes existants pour fluidifier les échanges et la traçabilité.</p>
              </div>
            </div>
            <div class="highlight-item">
              <mat-icon>emoji_objects</mat-icon>
              <div>
                <h4>Innovation partagée</h4>
                <p>Les bonnes pratiques et innovations sont mutualisées au bénéfice de tout l'écosystème.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Types de partenaires -->
      <section class="section section-alt">
        <div class="container">
          <h2>Types de partenaires</h2>
          <p class="section-intro">
            Notre réseau s'articule autour de quatre grandes familles d'acteurs,
            chacune jouant un rôle essentiel dans la boucle circulaire.
          </p>
          <div class="partners-grid">
            <div class="partner-card">
              <div class="partner-icon">
                <mat-icon>build</mat-icon>
              </div>
              <h3>Réparateurs & Reconditionneurs</h3>
              <p>
                Artisans, ateliers de réparation et entreprises de reconditionnement qui redonnent
                vie aux appareils. Ils enregistrent chaque intervention sur la plateforme,
                contribuant à la traçabilité et à la valorisation des équipements.
              </p>
              <ul class="partner-benefits">
                <li>Visibilité accrue auprès des citoyens</li>
                <li>Certification de qualité des interventions</li>
                <li>Flux d'appareils à reconditionner</li>
              </ul>
            </div>
            <div class="partner-card">
              <div class="partner-icon">
                <mat-icon>recycling</mat-icon>
              </div>
              <h3>Recycleurs</h3>
              <p>
                Opérateurs agréés de collecte et de traitement des DEEE. Ils assurent
                le recyclage responsable des appareils en fin de vie et la récupération
                des matières premières précieuses.
              </p>
              <ul class="partner-benefits">
                <li>Traçabilité complète des flux de DEEE</li>
                <li>Optimisation de la collecte</li>
                <li>Conformité réglementaire facilitée</li>
              </ul>
            </div>
            <div class="partner-card">
              <div class="partner-icon">
                <mat-icon>account_balance</mat-icon>
              </div>
              <h3>Collectivités & ESS</h3>
              <p>
                Collectivités territoriales, associations et structures de l'économie sociale
                et solidaire engagées dans la réduction des déchets et l'inclusion numérique.
                Elles organisent des collectes et sensibilisent les citoyens.
              </p>
              <ul class="partner-benefits">
                <li>Tableaux de bord d'impact territorial</li>
                <li>Outils de sensibilisation des citoyens</li>
                <li>Coordination des acteurs locaux</li>
              </ul>
            </div>
            <div class="partner-card">
              <div class="partner-icon">
                <mat-icon>business</mat-icon>
              </div>
              <h3>Entreprises & Grands Comptes</h3>
              <p>
                Entreprises souhaitant gérer de manière responsable leur parc informatique
                et leurs équipements électroniques. Elles tracent leurs appareils et optimisent
                leur politique RSE grâce à des données d'impact vérifiables.
              </p>
              <ul class="partner-benefits">
                <li>Gestion du cycle de vie du parc IT</li>
                <li>Reporting RSE et conformité</li>
                <li>Réduction des coûts par le reconditionnement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Devenir partenaire -->
      <section class="section">
        <div class="container">
          <h2>Devenir partenaire</h2>
          <div class="become-partner">
            <div class="become-partner-content">
              <p>
                Vous êtes un acteur de la réparation, du reconditionnement, du recyclage
                ou de la gestion des équipements électroniques ? Rejoignez notre écosystème
                et participez à la construction d'une économie circulaire transparente et efficace.
              </p>
              <div class="benefits-list">
                <div class="benefit">
                  <mat-icon>check_circle</mat-icon>
                  <span>Accès à la plateforme de traçabilité</span>
                </div>
                <div class="benefit">
                  <mat-icon>check_circle</mat-icon>
                  <span>Visibilité auprès de notre réseau d'utilisateurs</span>
                </div>
                <div class="benefit">
                  <mat-icon>check_circle</mat-icon>
                  <span>Outils de reporting et de suivi d'impact</span>
                </div>
                <div class="benefit">
                  <mat-icon>check_circle</mat-icon>
                  <span>Accompagnement personnalisé à l'intégration</span>
                </div>
              </div>
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
          <h2>Rejoignez l'écosystème</h2>
          <p>Trouvez le parcours adapté à votre organisation</p>
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

    /* Ecosystem Highlights */
    .ecosystem-highlights {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .highlight-item {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
    }

    .highlight-item mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: #474bfe;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .highlight-item h4 {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.35rem 0;
    }

    .highlight-item p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }

    /* Partners Grid */
    .partners-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .partner-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      transition: box-shadow 0.2s;
    }

    .partner-card:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .partner-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #eef2ff, #e0e7ff);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0 1rem 0;
    }

    .partner-icon mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: #474bfe;
    }

    .partner-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.75rem 0;
    }

    .partner-card p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }

    .partner-benefits {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .partner-benefits li {
      font-size: 0.9rem;
      color: #334155;
      padding-left: 1.25rem;
      position: relative;
      line-height: 1.5;
    }

    .partner-benefits li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 7px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #474bfe;
    }

    /* Become Partner */
    .become-partner {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2.5rem;
      margin-top: 1rem;
    }

    .become-partner-content p {
      font-size: 1rem;
      color: #475569;
      line-height: 1.7;
      margin: 0 0 1.5rem 0;
      text-align: center;
    }

    .benefits-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .benefit {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .benefit mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: #22c55e;
      flex-shrink: 0;
    }

    .benefit span {
      font-size: 0.95rem;
      color: #334155;
      line-height: 1.5;
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

      .partners-grid {
        grid-template-columns: 1fr;
      }

      .benefits-list {
        grid-template-columns: 1fr;
      }

      .highlight-item {
        flex-direction: column;
        gap: 0.75rem;
      }

      .become-partner {
        padding: 1.5rem;
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
export class PartnersComponent {
  crossLinks = [
    { icon: 'groups', title: 'Associations', description: 'Découvrez notre offre dédiée aux acteurs de l\'ESS.', route: '/association' },
    { icon: 'business', title: 'Entreprises', description: 'Pilotez la conformité environnementale de vos équipements.', route: '/entreprise' },
    { icon: 'mail', title: 'Contact', description: 'Discutons de votre projet de partenariat.', route: '/contact' }
  ];
}
