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

      <!-- Newsletter Banner -->
      <section class="section section-alt">
        <div class="container banner-container">
          <mat-icon class="banner-icon">campaign</mat-icon>
          <h2>Bient&ocirc;t plus d'articles</h2>
          <p>
            Notre &eacute;quipe pr&eacute;pare de nouveaux contenus sur la r&eacute;glementation DEEE,
            les bonnes pratiques de recyclage et les innovations en &eacute;conomie circulaire.
            Inscrivez-vous pour &ecirc;tre inform&eacute; des prochaines publications.
          </p>
          <a mat-raised-button color="primary" routerLink="/contact" class="cta-button">
            <mat-icon>mail</mat-icon>
            S'inscrire &agrave; la newsletter
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

    /* Banner */
    .banner-container {
      text-align: center;
    }

    .banner-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #474bfe;
      margin-bottom: 0.5rem;
    }

    .banner-container p {
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
    }
  `]
})
export class BlogComponent {}
