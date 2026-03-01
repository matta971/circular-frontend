import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-rep-compliance',
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
          <h1>Conformité REP</h1>
          <p class="hero-subtitle">
            Comprendre et respecter la réglementation DEEE
          </p>
        </div>
      </section>

      <!-- Qu'est-ce que la REP ? -->
      <section class="section">
        <div class="container">
          <h2>Qu'est-ce que la REP ?</h2>
          <div class="intro-block">
            <p>
              La <strong>Responsabilité Élargie du Producteur</strong> (REP) est un principe
              selon lequel les fabricants, importateurs et distributeurs d'équipements électriques
              et électroniques sont responsables de la gestion de leurs produits en fin de vie.
            </p>
            <div class="key-points">
              <div class="key-point">
                <mat-icon>gavel</mat-icon>
                <div>
                  <h4>Directive européenne DEEE</h4>
                  <p>
                    La directive 2012/19/UE impose aux États membres de l'Union européenne
                    d'organiser la collecte et le traitement des déchets d'équipements
                    électriques et électroniques (DEEE).
                  </p>
                </div>
              </div>
              <div class="key-point">
                <mat-icon>account_balance</mat-icon>
                <div>
                  <h4>Loi AGEC</h4>
                  <p>
                    En France, la loi Anti-Gaspillage pour une Économie Circulaire (2020)
                    renforce les obligations des producteurs : indice de réparabilité,
                    disponibilité des pièces détachées, information du consommateur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Obligations -->
      <section class="section section-alt">
        <div class="container">
          <h2>Obligations</h2>
          <p class="section-intro">
            Les producteurs et distributeurs d'équipements électroniques doivent
            respecter plusieurs obligations réglementaires.
          </p>
          <div class="obligations-grid">
            <div class="obligation-card">
              <mat-icon>app_registration</mat-icon>
              <h3>Enregistrement</h3>
              <p>
                S'enregistrer auprès d'un éco-organisme agréé (ex. ecosystem, Ecologic)
                et déclarer les quantités d'équipements mis sur le marché chaque année.
              </p>
            </div>
            <div class="obligation-card">
              <mat-icon>recycling</mat-icon>
              <h3>Collecte &amp; traitement</h3>
              <p>
                Financer et organiser la collecte, le tri et le traitement des DEEE
                conformément aux normes environnementales en vigueur.
              </p>
            </div>
            <div class="obligation-card">
              <mat-icon>assessment</mat-icon>
              <h3>Reporting</h3>
              <p>
                Produire des rapports annuels détaillés sur les volumes collectés,
                les taux de recyclage atteints et les filières de traitement utilisées.
              </p>
            </div>
            <div class="obligation-card">
              <mat-icon>euro</mat-icon>
              <h3>Éco-contribution</h3>
              <p>
                Verser une éco-contribution proportionnelle aux quantités mises sur le marché,
                destinée à financer la filière de collecte et de recyclage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Comment Circular Electronics vous aide -->
      <section class="section">
        <div class="container">
          <h2>Comment Circular Electronics vous aide</h2>
          <p class="section-intro">
            Notre plateforme simplifie votre mise en conformité REP
            grâce à des outils numériques intégrés.
          </p>
          <div class="help-grid">
            <div class="help-card">
              <mat-icon>track_changes</mat-icon>
              <h3>Traçabilité automatisée</h3>
              <p>
                Chaque équipement est suivi de sa mise en circulation à sa fin de vie.
                Les données sont collectées automatiquement, sans saisie manuelle.
              </p>
            </div>
            <div class="help-card">
              <mat-icon>verified</mat-icon>
              <h3>Certificats de conformité</h3>
              <p>
                Générez des certificats de traitement et de recyclage vérifiables,
                enregistrés sur la blockchain pour une preuve incontestable.
              </p>
            </div>
            <div class="help-card">
              <mat-icon>dashboard</mat-icon>
              <h3>Tableaux de bord</h3>
              <p>
                Visualisez en temps réel vos indicateurs REP : volumes collectés,
                taux de recyclage, éco-contributions, avec export pour vos rapports.
              </p>
            </div>
            <div class="help-card">
              <mat-icon>support_agent</mat-icon>
              <h3>Accompagnement</h3>
              <p>
                Notre équipe vous guide dans vos démarches réglementaires
                et vous alerte en cas de changement de la législation.
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
          <h2>Simplifiez votre conformité REP</h2>
          <p>Découvrez comment Circular Electronics peut automatiser votre mise en conformité.</p>
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

    /* Intro Block */
    .intro-block > p {
      font-size: 1.05rem;
      line-height: 1.7;
      color: #475569;
      text-align: center;
      max-width: 750px;
      margin: 0 auto 2.5rem auto;
    }

    .key-points {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .key-point {
      display: flex;
      gap: 1.25rem;
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .key-point mat-icon {
      font-size: 2rem;
      width: 32px;
      height: 32px;
      color: #474bfe;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .key-point h4 {
      font-size: 1.05rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #1e293b;
    }

    .key-point p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* Obligations Grid */
    .obligations-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .obligation-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .obligation-card mat-icon {
      font-size: 2.5rem;
      width: 40px;
      height: 40px;
      color: #474bfe;
      margin-bottom: 1rem;
    }

    .obligation-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.75rem 0;
      color: #1e293b;
    }

    .obligation-card p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* Help Grid */
    .help-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .help-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      text-align: center;
    }

    .help-card mat-icon {
      font-size: 2.5rem;
      width: 40px;
      height: 40px;
      color: #474bfe;
      margin-bottom: 1rem;
    }

    .help-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.75rem 0;
      color: #1e293b;
    }

    .help-card p {
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
      .obligations-grid {
        grid-template-columns: 1fr;
      }
      .help-grid {
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
      .key-point {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class RepComplianceComponent {
  crossLinks = [
    { icon: 'verified_user', title: 'Tra\u00e7abilit\u00e9', description: 'Chaque appareil a une histoire. Nous la rendons visible.', route: '/trust/traceability' },
    { icon: 'help_outline', title: 'FAQ r\u00e9glementaire', description: 'Tout comprendre sur la r\u00e9glementation DEEE.', route: '/resources/faq' },
    { icon: 'business', title: 'Entreprises', description: 'Pilotez votre conformit\u00e9 environnementale.', route: '/entreprise' }
  ];
}
