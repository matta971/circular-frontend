import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-studies',
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
          <h1>&Eacute;tudes &amp; Chiffres</h1>
          <p class="hero-subtitle">
            Les donn&eacute;es cl&eacute;s de l'&eacute;conomie circulaire &eacute;lectronique
          </p>
        </div>
      </section>

      <!-- Chiffres mondiaux -->
      <section class="section">
        <div class="container">
          <h2>Chiffres mondiaux</h2>
          <div class="stats-row">
            <div class="stat-card">
              <mat-icon>public</mat-icon>
              <span class="stat-number">53,6M</span>
              <span class="stat-unit">tonnes de DEEE / an</span>
              <span class="stat-label">
                Volume mondial de d&eacute;chets d'&eacute;quipements &eacute;lectriques et &eacute;lectroniques
                g&eacute;n&eacute;r&eacute;s chaque ann&eacute;e
              </span>
            </div>
            <div class="stat-card">
              <mat-icon>pie_chart</mat-icon>
              <span class="stat-number">22,3%</span>
              <span class="stat-unit">taux de collecte</span>
              <span class="stat-label">
                Seule une fraction des DEEE produits dans le monde est
                officiellement collect&eacute;e et trait&eacute;e de mani&egrave;re responsable
              </span>
            </div>
            <div class="stat-card">
              <mat-icon>money_off</mat-icon>
              <span class="stat-number">62,5 Mds &euro;</span>
              <span class="stat-unit">de valeur perdue</span>
              <span class="stat-label">
                Valeur des mati&egrave;res premi&egrave;res (or, cuivre, terres rares) non r&eacute;cup&eacute;r&eacute;es
                dans les DEEE chaque ann&eacute;e
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- En France -->
      <section class="section section-alt">
        <div class="container">
          <h2>En France</h2>
          <div class="stats-row stats-row-4">
            <div class="stat-card">
              <mat-icon>flag</mat-icon>
              <span class="stat-number">849K</span>
              <span class="stat-unit">tonnes DEEE / an</span>
              <span class="stat-label">
                Volume annuel de d&eacute;chets &eacute;lectroniques g&eacute;n&eacute;r&eacute;s en France
              </span>
            </div>
            <div class="stat-card">
              <mat-icon>person</mat-icon>
              <span class="stat-number">10,4 kg</span>
              <span class="stat-unit">/ habitant collect&eacute;s</span>
              <span class="stat-label">
                Quantit&eacute; moyenne de DEEE collect&eacute;s par habitant et par an
              </span>
            </div>
            <div class="stat-card">
              <mat-icon>recycling</mat-icon>
              <span class="stat-number">78%</span>
              <span class="stat-unit">taux de recyclage</span>
              <span class="stat-label">
                Part des DEEE collect&eacute;s qui sont effectivement recycl&eacute;s ou valoris&eacute;s
              </span>
            </div>
            <div class="stat-card">
              <mat-icon>eco</mat-icon>
              <span class="stat-number">4,5M</span>
              <span class="stat-unit">tonnes CO&#8322; &eacute;vit&eacute;es</span>
              <span class="stat-label">
                &Eacute;missions de gaz &agrave; effet de serre &eacute;vit&eacute;es gr&acirc;ce au recyclage des DEEE en France
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Sources -->
      <section class="section">
        <div class="container">
          <h2>Sources</h2>
          <div class="sources-list">
            <div class="source-item">
              <mat-icon>menu_book</mat-icon>
              <div>
                <h4>ADEME</h4>
                <p>
                  Agence de la transition &eacute;cologique &mdash; Rapports annuels sur la gestion des DEEE
                  en France, statistiques de collecte et de recyclage.
                </p>
              </div>
            </div>
            <div class="source-item">
              <mat-icon>menu_book</mat-icon>
              <div>
                <h4>UNITAR &mdash; Global E-waste Monitor</h4>
                <p>
                  Institut des Nations Unies pour la formation et la recherche &mdash; Rapport mondial
                  sur les d&eacute;chets &eacute;lectroniques, donn&eacute;es de production et de traitement par r&eacute;gion.
                </p>
              </div>
            </div>
            <div class="source-item">
              <mat-icon>menu_book</mat-icon>
              <div>
                <h4>Eurostat</h4>
                <p>
                  Office statistique de l'Union europ&eacute;enne &mdash; Donn&eacute;es harmonis&eacute;es sur
                  la collecte, le traitement et la valorisation des DEEE dans les &Eacute;tats membres.
                </p>
              </div>
            </div>
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

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .stats-row-4 {
      grid-template-columns: repeat(4, 1fr);
    }

    .stat-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem 1.25rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
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
      line-height: 1.2;
    }

    .stat-unit {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #64748b;
      line-height: 1.5;
      margin-top: 0.25rem;
    }

    /* Sources */
    .sources-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .source-item {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
    }

    .source-item mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: #474bfe;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .source-item h4 {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .source-item p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }

      .stats-row-4 {
        grid-template-columns: repeat(2, 1fr);
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

      .stats-row,
      .stats-row-4 {
        grid-template-columns: 1fr;
      }

      .source-item {
        flex-direction: column;
        gap: 0.75rem;
      }
    }
  `]
})
export class StudiesComponent {}
