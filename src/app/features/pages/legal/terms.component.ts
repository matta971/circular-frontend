import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-terms',
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
          <h1>Mentions L&eacute;gales</h1>
        </div>
      </section>

      <!-- Content -->
      <section class="section">
        <div class="container">

          <div class="legal-section">
            <h2>1. &Eacute;diteur du site</h2>
            <p>
              Le site Circular Electronics est &eacute;dit&eacute; par la soci&eacute;t&eacute; Circular Electronics,
              dont le si&egrave;ge social est situ&eacute; &agrave; Paris, France.
            </p>
            <p>
              <strong>Contact :</strong> matta971&#64;gmail.com
            </p>
          </div>

          <div class="legal-section">
            <h2>2. Directeur de la publication</h2>
            <p>
              Le directeur de la publication du site est Matthieu A.
            </p>
          </div>

          <div class="legal-section">
            <h2>3. H&eacute;bergement</h2>
            <p>
              Le site est h&eacute;berg&eacute; par Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Allemagne.
            </p>
          </div>

          <div class="legal-section">
            <h2>4. Propri&eacute;t&eacute; intellectuelle</h2>
            <p>
              L'ensemble des contenus pr&eacute;sents sur le site Circular Electronics (textes, images, logos,
              graphismes, ic&ocirc;nes, logiciels, base de donn&eacute;es) est prot&eacute;g&eacute; par les lois fran&ccedil;aises
              et internationales relatives &agrave; la propri&eacute;t&eacute; intellectuelle.
            </p>
            <p>
              Toute reproduction, repr&eacute;sentation, modification, publication, transmission ou d&eacute;naturation,
              totale ou partielle, du site ou de son contenu, par quelque proc&eacute;d&eacute; que ce soit,
              et sur quelque support que ce soit, est interdite sans l'autorisation &eacute;crite pr&eacute;alable
              de Circular Electronics. Tous droits r&eacute;serv&eacute;s.
            </p>
          </div>

          <div class="legal-section">
            <h2>5. Limitation de responsabilit&eacute;</h2>
            <p>
              Circular Electronics s'efforce d'assurer l'exactitude et la mise &agrave; jour des informations
              diffus&eacute;es sur ce site. Toutefois, Circular Electronics ne peut garantir l'exactitude,
              la pr&eacute;cision ou l'exhaustivit&eacute; des informations mises &agrave; disposition sur ce site.
            </p>
            <p>
              En cons&eacute;quence, Circular Electronics d&eacute;cline toute responsabilit&eacute; pour toute impr&eacute;cision,
              inexactitude ou omission portant sur des informations disponibles sur ce site.
              Circular Electronics ne saurait &ecirc;tre tenue responsable des dommages directs ou indirects
              r&eacute;sultant de l'acc&egrave;s ou de l'utilisation du site.
            </p>
          </div>

          <div class="legal-section">
            <h2>6. Droit applicable</h2>
            <p>
              Les pr&eacute;sentes mentions l&eacute;gales sont r&eacute;gies par le droit fran&ccedil;ais.
              En cas de litige, et apr&egrave;s tentative de recherche d'une solution amiable,
              comp&eacute;tence est attribu&eacute;e aux tribunaux comp&eacute;tents de Paris, France.
            </p>
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
          <a mat-stroked-button routerLink="/" class="cta-button-home">
            <mat-icon>home</mat-icon>
            Retour à l'accueil
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
      margin: 0;
    }

    .section {
      padding: 4rem 2rem;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    .legal-section {
      margin-bottom: 2.5rem;
    }

    .legal-section:last-child {
      margin-bottom: 0;
    }

    .legal-section h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1rem 0;
      text-align: left;
    }

    .legal-section p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.7;
      margin: 0 0 0.75rem 0;
    }

    .legal-section p:last-child {
      margin-bottom: 0;
    }

    .legal-section strong {
      color: #1e293b;
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

    /* Home CTA */
    .section-cta {
      background: white;
      padding: 3rem 2rem;
    }

    .cta-button-home {
      border: 1px solid #474bfe;
      color: #474bfe;
      padding: 0 2rem;
      height: 44px;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
    }

    .cta-button-home:hover {
      background: rgba(71, 75, 254, 0.04);
    }

    .cta-button-home mat-icon {
      margin-right: 0.5rem;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .legal-section h2 {
        font-size: 1.2rem;
      }
    }

    @media (max-width: 576px) {
      .hero {
        padding: 60px 1.5rem 2rem 1.5rem;
        min-height: 180px;
      }

      .hero h1 {
        font-size: 1.75rem;
      }

      .section {
        padding: 2.5rem 1.25rem;
      }

      .legal-section h2 {
        font-size: 1.1rem;
      }

      .crosslinks-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TermsComponent {
  crossLinks = [
    { icon: 'policy', title: 'Politique de confidentialité', description: 'Comment nous protégeons vos données.', route: '/legal/privacy' },
    { icon: 'shield', title: 'Sécurité des données', description: 'Nos mesures de protection des données.', route: '/trust/data-security' },
    { icon: 'mail', title: 'Contact', description: 'Une question ? Nous sommes là.', route: '/contact' }
  ];
}
