import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-governance',
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
          <h1>Gouvernance</h1>
          <p class="hero-subtitle">
            Une organisation transparente, guidée par des valeurs fortes et un engagement
            constant envers l'éthique, l'innovation et l'impact environnemental.
          </p>
        </div>
      </section>

      <!-- Nos valeurs -->
      <section class="section">
        <div class="container">
          <h2>Nos valeurs</h2>
          <p class="section-intro">
            Quatre valeurs fondamentales structurent notre gouvernance et orientent chacune
            de nos décisions stratégiques et opérationnelles.
          </p>
          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon">
                <mat-icon>visibility</mat-icon>
              </div>
              <h3>Transparence</h3>
              <p>
                Nous partageons ouvertement nos méthodes, nos données et nos résultats.
                La confiance de nos partenaires et utilisateurs repose sur une transparence
                totale dans notre fonctionnement et nos processus.
              </p>
            </div>
            <div class="value-card">
              <div class="value-icon">
                <mat-icon>eco</mat-icon>
              </div>
              <h3>Impact</h3>
              <p>
                Chaque décision est évaluée à l'aune de son impact environnemental et social.
                Nous mesurons concrètement les résultats de nos actions et publions
                régulièrement nos indicateurs de performance.
              </p>
            </div>
            <div class="value-card">
              <div class="value-icon">
                <mat-icon>lightbulb</mat-icon>
              </div>
              <h3>Innovation</h3>
              <p>
                Nous explorons continuellement de nouvelles technologies et approches
                pour améliorer la traçabilité et la circularité des équipements électroniques.
                L'innovation est au service de la durabilité.
              </p>
            </div>
            <div class="value-card">
              <div class="value-icon">
                <mat-icon>diversity_3</mat-icon>
              </div>
              <h3>Inclusion</h3>
              <p>
                Notre plateforme est conçue pour être accessible à tous les acteurs,
                quelle que soit leur taille ou leurs moyens. Nous croyons qu'une économie
                circulaire efficace doit être inclusive et collaborative.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Organisation -->
      <section class="section section-alt">
        <div class="container">
          <h2>Organisation</h2>
          <p class="section-intro">
            Notre structure de gouvernance assure un équilibre entre expertise technique,
            vision stratégique et responsabilité éthique.
          </p>
          <div class="org-list">
            <div class="org-item">
              <div class="org-icon">
                <mat-icon>rocket_launch</mat-icon>
              </div>
              <div class="org-content">
                <h3>Équipe fondatrice</h3>
                <p>
                  Une équipe pluridisciplinaire réunissant des compétences en développement logiciel,
                  économie circulaire, gestion des déchets électroniques et entrepreneuriat social.
                  L'équipe fondatrice définit la vision stratégique et pilote le développement
                  de la plateforme.
                </p>
              </div>
            </div>
            <div class="org-item">
              <div class="org-icon">
                <mat-icon>science</mat-icon>
              </div>
              <div class="org-content">
                <h3>Comité scientifique</h3>
                <p>
                  Composé d'experts en environnement, en gestion des DEEE et en technologies
                  numériques, le comité scientifique conseille l'équipe sur les meilleures pratiques,
                  valide les méthodologies de calcul d'impact et garantit la rigueur
                  de notre approche.
                </p>
              </div>
            </div>
            <div class="org-item">
              <div class="org-icon">
                <mat-icon>balance</mat-icon>
              </div>
              <div class="org-content">
                <h3>Comité éthique</h3>
                <p>
                  Garant de l'intégrité de notre démarche, le comité éthique veille au respect
                  de nos valeurs, supervise la protection des données personnelles et s'assure
                  que notre activité reste alignée avec notre mission d'intérêt général.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Engagements -->
      <section class="section">
        <div class="container">
          <h2>Engagements</h2>
          <p class="section-intro">
            Nos engagements concrets en matière de gouvernance, de transparence technique
            et de protection des données.
          </p>
          <div class="engagements-grid">
            <div class="engagement-card">
              <mat-icon>code</mat-icon>
              <h4>Open Source</h4>
              <p>
                Nous nous engageons à publier en open source les composants clés de notre plateforme.
                La transparence du code renforce la confiance et permet à la communauté
                de contribuer à l'amélioration continue de nos outils.
              </p>
            </div>
            <div class="engagement-card">
              <mat-icon>shield</mat-icon>
              <h4>Conformité RGPD</h4>
              <p>
                La protection des données personnelles est au coeur de notre conception.
                Nous appliquons les principes de privacy by design et garantissons
                à chaque utilisateur un contrôle total sur ses données.
              </p>
            </div>
            <div class="engagement-card">
              <mat-icon>fact_check</mat-icon>
              <h4>Audits indépendants</h4>
              <p>
                Nous soumettons régulièrement notre plateforme et nos processus à des audits
                indépendants. Sécurité informatique, conformité réglementaire et impact
                environnemental sont évalués par des tiers de confiance.
              </p>
            </div>
            <div class="engagement-card">
              <mat-icon>trending_up</mat-icon>
              <h4>Reporting d'impact</h4>
              <p>
                Nous publions des rapports d'impact réguliers détaillant nos résultats
                en matière environnementale et sociale. Ces rapports sont accessibles
                à tous nos partenaires et au grand public.
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
        <div class="container cta-container">
          <h2>Agissez avec nous</h2>
          <p>Découvrez comment participer selon votre profil</p>
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

    /* Values Grid */
    .values-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .value-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
      transition: box-shadow 0.2s;
    }

    .value-card:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .value-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #eef2ff, #e0e7ff);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem auto;
    }

    .value-icon mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: #474bfe;
    }

    .value-card h3 {
      font-size: 1.15rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.75rem 0;
    }

    .value-card p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }

    /* Organisation List */
    .org-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .org-item {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem;
    }

    .org-icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #eef2ff, #e0e7ff);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .org-icon mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: #474bfe;
    }

    .org-content h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .org-content p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }

    /* Engagements Grid */
    .engagements-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .engagement-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.75rem;
    }

    .engagement-card mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #474bfe;
      margin-bottom: 0.75rem;
    }

    .engagement-card h4 {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .engagement-card p {
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

      .values-grid {
        grid-template-columns: 1fr;
      }

      .engagements-grid {
        grid-template-columns: 1fr;
      }

      .org-item {
        flex-direction: column;
        gap: 1rem;
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
export class GovernanceComponent {
  crossLinks = [
    { icon: 'flag', title: 'Notre Mission', description: 'Pourquoi nous existons et ce que nous faisons.', route: '/about/mission' },
    { icon: 'shield', title: 'Sécurité des données', description: 'La protection de vos données est notre priorité.', route: '/trust/data-security' },
    { icon: 'mail', title: 'Contact', description: 'Une question ? Échangeons ensemble.', route: '/contact' }
  ];
}
