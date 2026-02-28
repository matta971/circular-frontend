import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-blog',
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
          <h1>Blog</h1>
          <p class="hero-subtitle">
            Actualit&eacute;s et analyses sur l'&eacute;conomie circulaire &eacute;lectronique
          </p>
        </div>
      </section>

      <!-- Articles -->
      <section class="section">
        <div class="container">
          <h2>Derniers articles</h2>
          <div class="articles-grid">
            <div class="article-card">
              <div class="article-image" style="background: linear-gradient(135deg, #1a1fd8 0%, #474bfe 100%);">
                <mat-icon>delete_outline</mat-icon>
              </div>
              <div class="article-body">
                <span class="article-date">15 f&eacute;vrier 2026</span>
                <h3>Les enjeux du DEEE en 2026</h3>
                <p>
                  Avec 53,6 millions de tonnes de d&eacute;chets &eacute;lectroniques g&eacute;n&eacute;r&eacute;s chaque ann&eacute;e,
                  la gestion des DEEE devient un d&eacute;fi majeur. D&eacute;couvrez les tendances cl&eacute;s
                  et les solutions &eacute;mergentes pour 2026.
                </p>
              </div>
            </div>
            <div class="article-card">
              <div class="article-image" style="background: linear-gradient(135deg, #474bfe 0%, #6366f1 100%);">
                <mat-icon>link</mat-icon>
              </div>
              <div class="article-body">
                <span class="article-date">2 f&eacute;vrier 2026</span>
                <h3>Tra&ccedil;abilit&eacute; blockchain : guide complet</h3>
                <p>
                  Comment la technologie blockchain r&eacute;volutionne la tra&ccedil;abilit&eacute; des &eacute;quipements
                  &eacute;lectroniques ? Notre guide d&eacute;taille les m&eacute;canismes, les avantages
                  et les cas d'usage concrets.
                </p>
              </div>
            </div>
            <div class="article-card">
              <div class="article-image" style="background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);">
                <mat-icon>gavel</mat-icon>
              </div>
              <div class="article-body">
                <span class="article-date">18 janvier 2026</span>
                <h3>REP et loi AGEC : ce qui change</h3>
                <p>
                  La loi AGEC renforce les obligations de responsabilit&eacute; &eacute;largie des producteurs.
                  Quelles sont les nouvelles exigences pour les entreprises et comment s'y conformer
                  efficacement ?
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
          <h2>Passez à l'action</h2>
          <p>Rejoignez Circular Electronics et contribuez à l'économie circulaire.</p>
          <div class="dual-cta">
            <a mat-raised-button color="primary" routerLink="/auth/register" class="cta-button">
              <mat-icon>rocket_launch</mat-icon>
              Commencer maintenant
            </a>
            <a mat-stroked-button routerLink="/contact" class="cta-button-secondary">
              <mat-icon>support_agent</mat-icon>
              Contacter un expert
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
      margin: 0 0 1.5rem 0;
      text-align: center;
    }

    /* Articles Grid */
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .article-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }

    .article-card:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .article-image {
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .article-image mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .article-body {
      padding: 1.25rem;
    }

    .article-date {
      font-size: 0.8rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .article-body h3 {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0.5rem 0 0.75rem 0;
      line-height: 1.4;
    }

    .article-body p {
      font-size: 0.9rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
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

    /* CTA */
    .section-cta {
      background: #f8f9fb;
    }

    .cta-container {
      text-align: center;
    }

    .cta-container h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }

    .cta-container p {
      color: #475569;
      font-size: 1.05rem;
      margin-bottom: 0;
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
    @media (max-width: 992px) {
      .articles-grid {
        grid-template-columns: 1fr 1fr;
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

      .hero-subtitle {
        font-size: 1rem;
      }

      .section {
        padding: 2.5rem 1.25rem;
      }

      h2 {
        font-size: 1.4rem;
      }

      .articles-grid {
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
  `]
})
export class BlogComponent {
  crossLinks = [
    { icon: 'bar_chart', title: 'Études & Chiffres', description: 'Les données clés de l\'économie circulaire électronique.', route: '/resources/studies' },
    { icon: 'help_outline', title: 'FAQ', description: 'Questions fréquentes sur la réglementation DEEE.', route: '/resources/faq' },
    { icon: 'newspaper', title: 'Presse', description: 'Ressources et informations pour les médias.', route: '/resources/press' }
  ];
}
