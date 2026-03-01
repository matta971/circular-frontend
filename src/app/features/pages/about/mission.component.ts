import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-mission',
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
          <h1>Notre Mission</h1>
          <p class="hero-subtitle">
            Accélérer la transition vers une économie circulaire des équipements électroniques
            en rendant la traçabilité accessible à tous les acteurs de la chaîne de valeur.
          </p>
        </div>
      </section>

      <!-- Pourquoi nous existons -->
      <section class="section">
        <div class="container">
          <h2>Pourquoi nous existons</h2>
          <p class="section-intro">
            Le secteur des équipements électroniques fait face à une crise environnementale majeure.
            Les chiffres parlent d'eux-mêmes.
          </p>
          <div class="stats-row">
            <div class="stat-card">
              <mat-icon>delete_outline</mat-icon>
              <span class="stat-number">50M</span>
              <span class="stat-label">de tonnes de déchets électroniques produits chaque année dans le monde</span>
            </div>
            <div class="stat-card">
              <mat-icon>pie_chart</mat-icon>
              <span class="stat-number">&lt; 20%</span>
              <span class="stat-label">des équipements électroniques sont correctement recyclés</span>
            </div>
            <div class="stat-card">
              <mat-icon>timer_off</mat-icon>
              <span class="stat-number">2-3 ans</span>
              <span class="stat-label">durée de vie moyenne d'un smartphone avant remplacement</span>
            </div>
          </div>
          <p class="section-text">
            L'obsolescence programmée, le manque de traçabilité et l'absence de coordination entre les acteurs
            aggravent ce phénomène. Des millions d'appareils encore fonctionnels finissent dans des tiroirs
            ou sont jetés sans être valorisés.
          </p>
        </div>
      </section>

      <!-- Ce que nous faisons -->
      <section class="section section-alt">
        <div class="container">
          <h2>Ce que nous faisons</h2>
          <p class="section-intro">
            Circular Electronics repose sur trois piliers fondamentaux pour transformer
            la gestion des équipements électroniques.
          </p>
          <div class="pillars-grid">
            <div class="pillar-card">
              <div class="pillar-icon">
                <mat-icon>verified_user</mat-icon>
              </div>
              <h3>Traçabilité</h3>
              <p>
                Chaque appareil dispose d'un passeport numérique unique qui enregistre l'ensemble
                de son cycle de vie : fabrication, utilisation, réparations, reconditionnement et recyclage.
                Une transparence totale pour tous les acteurs.
              </p>
            </div>
            <div class="pillar-card">
              <div class="pillar-icon">
                <mat-icon>recycling</mat-icon>
              </div>
              <h3>Valorisation</h3>
              <p>
                Nous favorisons la réparation, le reconditionnement et le recyclage responsable
                en connectant les propriétaires d'appareils aux professionnels qualifiés.
                Chaque geste éco-responsable est récompensé par des tokens.
              </p>
            </div>
            <div class="pillar-card">
              <div class="pillar-icon">
                <mat-icon>hub</mat-icon>
              </div>
              <h3>Coordination</h3>
              <p>
                Nous créons un écosystème collaboratif qui met en relation citoyens, réparateurs,
                reconditionneurs, recycleurs, collectivités et entreprises autour d'objectifs communs
                de durabilité et de circularité.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Notre engagement -->
      <section class="section">
        <div class="container">
          <h2>Notre engagement</h2>
          <div class="engagement-list">
            <div class="engagement-item">
              <mat-icon>lock_open</mat-icon>
              <div>
                <h4>Démocratiser la traçabilité</h4>
                <p>
                  Rendre la traçabilité des équipements électroniques accessible à tous,
                  sans barrière technique ni financière. Chaque citoyen, chaque entreprise,
                  chaque collectivité doit pouvoir suivre le cycle de vie de ses appareils.
                </p>
              </div>
            </div>
            <div class="engagement-item">
              <mat-icon>visibility</mat-icon>
              <div>
                <h4>Rendre visible le cycle de vie</h4>
                <p>
                  Offrir une vision claire et complète du parcours de chaque appareil,
                  de sa fabrication à sa fin de vie. Transparence et confiance sont au coeur
                  de notre démarche.
                </p>
              </div>
            </div>
            <div class="engagement-item">
              <mat-icon>emoji_events</mat-icon>
              <div>
                <h4>Récompenser les gestes responsables</h4>
                <p>
                  Valoriser concrètement chaque action en faveur de l'économie circulaire
                  grâce à un système de tokens. Réparer, recycler, reconditionner :
                  chaque geste compte et est reconnu.
                </p>
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
          <h2>Rejoignez le mouvement</h2>
          <p>Découvrez Circular Electronics selon votre profil</p>
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

    .section-text {
      color: #475569;
      font-size: 1rem;
      line-height: 1.7;
      text-align: center;
      margin: 2rem 0 0 0;
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 1rem;
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
      gap: 0.5rem;
    }

    .stat-card mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #474bfe;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: #1a1fd8;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.5;
    }

    /* Pillars Grid */
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
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

    /* Engagement List */
    .engagement-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-top: 2rem;
    }

    .engagement-item {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
    }

    .engagement-item mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: #474bfe;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .engagement-item h4 {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .engagement-item p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
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

      .stats-row {
        grid-template-columns: 1fr;
      }

      .pillars-grid {
        grid-template-columns: 1fr;
      }

      .engagement-item {
        flex-direction: column;
        gap: 0.75rem;
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
export class MissionComponent {
  crossLinks = [
    { icon: 'lightbulb', title: 'Notre Vision', description: 'Un monde où chaque appareil est tracé et valorisé.', route: '/about/vision' },
    { icon: 'verified_user', title: 'Traçabilité', description: 'Comment nous traçons chaque équipement de bout en bout.', route: '/trust/traceability' },
    { icon: 'bar_chart', title: 'Études & Chiffres', description: 'Les données clés de l\'économie circulaire électronique.', route: '/resources/studies' }
  ];
}
