import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-faq',
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
          <h1>FAQ R&eacute;glementaire</h1>
          <p class="hero-subtitle">
            Tout comprendre sur la r&eacute;glementation DEEE et l'&eacute;conomie circulaire
          </p>
        </div>
      </section>

      <!-- FAQ -->
      <section class="section">
        <div class="container">

          <!-- Question 1 -->
          <div class="faq-item" [class.open]="toggledQuestions.has(0)">
            <div class="faq-question" (click)="toggle(0)">
              <span>Qu'est-ce qu'un DEEE ?</span>
              <mat-icon>{{ toggledQuestions.has(0) ? 'expand_less' : 'expand_more' }}</mat-icon>
            </div>
            <div class="faq-answer" *ngIf="toggledQuestions.has(0)">
              <p>
                Un DEEE (D&eacute;chet d'&Eacute;quipement &Eacute;lectrique et &Eacute;lectronique) d&eacute;signe tout appareil
                &eacute;lectrique ou &eacute;lectronique dont le d&eacute;tenteur se d&eacute;fait ou a l'intention de se d&eacute;faire.
                Cela inclut les ordinateurs, t&eacute;l&eacute;phones, &eacute;lectrom&eacute;nager, &eacute;quipements m&eacute;dicaux et industriels.
                La r&eacute;glementation europ&eacute;enne classe les DEEE en six cat&eacute;gories selon leur taille et leur nature.
              </p>
            </div>
          </div>

          <!-- Question 2 -->
          <div class="faq-item" [class.open]="toggledQuestions.has(1)">
            <div class="faq-question" (click)="toggle(1)">
              <span>Qu'est-ce que la REP ?</span>
              <mat-icon>{{ toggledQuestions.has(1) ? 'expand_less' : 'expand_more' }}</mat-icon>
            </div>
            <div class="faq-answer" *ngIf="toggledQuestions.has(1)">
              <p>
                La REP (Responsabilit&eacute; &Eacute;largie du Producteur) est un principe selon lequel les fabricants
                et importateurs sont responsables de la fin de vie des produits qu'ils mettent sur le march&eacute;.
                En France, les producteurs doivent adh&eacute;rer &agrave; un &eacute;co-organisme agr&eacute;&eacute; (comme Ecosystem ou Ecologic)
                et financer la collecte et le traitement des DEEE via une &eacute;co-contribution.
              </p>
            </div>
          </div>

          <!-- Question 3 -->
          <div class="faq-item" [class.open]="toggledQuestions.has(2)">
            <div class="faq-question" (click)="toggle(2)">
              <span>Quelles sont les obligations des entreprises ?</span>
              <mat-icon>{{ toggledQuestions.has(2) ? 'expand_less' : 'expand_more' }}</mat-icon>
            </div>
            <div class="faq-answer" *ngIf="toggledQuestions.has(2)">
              <p>
                Les entreprises qui mettent des &eacute;quipements &eacute;lectriques sur le march&eacute; fran&ccedil;ais doivent
                s'enregistrer aupr&egrave;s du registre national des producteurs, adh&eacute;rer &agrave; un &eacute;co-organisme agr&eacute;&eacute;
                et d&eacute;clarer les quantit&eacute;s mises en march&eacute;. Elles doivent &eacute;galement informer les utilisateurs
                sur les modalit&eacute;s de collecte et apposer le symbole de la poubelle barr&eacute;e sur leurs produits.
              </p>
            </div>
          </div>

          <!-- Question 4 -->
          <div class="faq-item" [class.open]="toggledQuestions.has(3)">
            <div class="faq-question" (click)="toggle(3)">
              <span>Comment fonctionne l'&eacute;co-contribution ?</span>
              <mat-icon>{{ toggledQuestions.has(3) ? 'expand_less' : 'expand_more' }}</mat-icon>
            </div>
            <div class="faq-answer" *ngIf="toggledQuestions.has(3)">
              <p>
                L'&eacute;co-contribution est une somme vers&eacute;e par les producteurs aux &eacute;co-organismes pour financer
                la collecte, le tri et le recyclage des DEEE. Son montant varie selon le type de produit,
                son poids et sa facilit&eacute; de recyclage. Elle est g&eacute;n&eacute;ralement r&eacute;percut&eacute;e sur le prix de vente
                et affich&eacute;e de mani&egrave;re visible pour le consommateur.
              </p>
            </div>
          </div>

          <!-- Question 5 -->
          <div class="faq-item" [class.open]="toggledQuestions.has(4)">
            <div class="faq-question" (click)="toggle(4)">
              <span>Qu'est-ce que la loi AGEC ?</span>
              <mat-icon>{{ toggledQuestions.has(4) ? 'expand_less' : 'expand_more' }}</mat-icon>
            </div>
            <div class="faq-answer" *ngIf="toggledQuestions.has(4)">
              <p>
                La loi AGEC (Anti-Gaspillage pour une &Eacute;conomie Circulaire), promulgu&eacute;e en f&eacute;vrier 2020,
                vise &agrave; transformer notre mod&egrave;le de production et de consommation. Elle introduit l'indice
                de r&eacute;parabilit&eacute;, renforce les fili&egrave;res REP et impose de nouvelles obligations en mati&egrave;re
                de disponibilit&eacute; des pi&egrave;ces d&eacute;tach&eacute;es et de lutte contre l'obsolescence programm&eacute;e.
              </p>
            </div>
          </div>

          <!-- Question 6 -->
          <div class="faq-item" [class.open]="toggledQuestions.has(5)">
            <div class="faq-question" (click)="toggle(5)">
              <span>Comment prouver la conformit&eacute; ?</span>
              <mat-icon>{{ toggledQuestions.has(5) ? 'expand_less' : 'expand_more' }}</mat-icon>
            </div>
            <div class="faq-answer" *ngIf="toggledQuestions.has(5)">
              <p>
                La conformit&eacute; se prouve par la tenue &agrave; jour d'un registre des &eacute;quipements mis sur le march&eacute;,
                l'adh&eacute;sion &agrave; un &eacute;co-organisme agr&eacute;&eacute; et la conservation des bordereaux de suivi des d&eacute;chets.
                Les entreprises doivent &eacute;galement pouvoir pr&eacute;senter leurs d&eacute;clarations annuelles aupr&egrave;s
                de l'ADEME en cas de contr&ocirc;le.
              </p>
            </div>
          </div>

          <!-- Question 7 -->
          <div class="faq-item" [class.open]="toggledQuestions.has(6)">
            <div class="faq-question" (click)="toggle(6)">
              <span>Qu'est-ce qu'un certificat de tra&ccedil;abilit&eacute; ?</span>
              <mat-icon>{{ toggledQuestions.has(6) ? 'expand_less' : 'expand_more' }}</mat-icon>
            </div>
            <div class="faq-answer" *ngIf="toggledQuestions.has(6)">
              <p>
                Un certificat de tra&ccedil;abilit&eacute; est un document num&eacute;rique qui atteste de l'ensemble du parcours
                d'un &eacute;quipement &eacute;lectronique : fabrication, mises &agrave; jour, r&eacute;parations, changements de propri&eacute;taire
                et fin de vie. Il garantit la transparence et permet de v&eacute;rifier que chaque &eacute;tape
                a &eacute;t&eacute; r&eacute;alis&eacute;e dans le respect des normes environnementales.
              </p>
            </div>
          </div>

          <!-- Question 8 -->
          <div class="faq-item" [class.open]="toggledQuestions.has(7)">
            <div class="faq-question" (click)="toggle(7)">
              <span>Comment Circular Electronics aide &agrave; la conformit&eacute; ?</span>
              <mat-icon>{{ toggledQuestions.has(7) ? 'expand_less' : 'expand_more' }}</mat-icon>
            </div>
            <div class="faq-answer" *ngIf="toggledQuestions.has(7)">
              <p>
                Circular Electronics fournit une plateforme centralis&eacute;e de tra&ccedil;abilit&eacute; qui automatise
                le suivi du cycle de vie des &eacute;quipements &eacute;lectroniques. Gr&acirc;ce aux passeports num&eacute;riques,
                aux certificats infalsifiables et aux tableaux de bord de conformit&eacute;, les entreprises
                peuvent d&eacute;montrer facilement le respect de leurs obligations REP et AGEC.
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
          <h2>Prêt à passer à l'action ?</h2>
          <p>Simplifiez votre conformité avec Circular Electronics.</p>
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

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    /* FAQ Items */
    .faq-item {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      margin-bottom: 1rem;
      overflow: hidden;
      background: #fff;
      transition: box-shadow 0.2s;
    }

    .faq-item:hover {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }

    .faq-item.open {
      border-color: #c7d2fe;
    }

    .faq-question {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      cursor: pointer;
      user-select: none;
    }

    .faq-question span {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      flex: 1;
      padding-right: 1rem;
    }

    .faq-question mat-icon {
      color: #474bfe;
      flex-shrink: 0;
    }

    .faq-answer {
      padding: 0 1.5rem 1.25rem 1.5rem;
    }

    .faq-answer p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.7;
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
      padding: 4rem 2rem;
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
      .faq-question span {
        font-size: 1rem;
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

      .faq-question {
        padding: 1rem 1.25rem;
      }

      .faq-question span {
        font-size: 0.95rem;
      }

      .faq-answer {
        padding: 0 1.25rem 1rem 1.25rem;
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
export class FaqComponent {
  toggledQuestions = new Set<number>();
  crossLinks = [
    { icon: 'gavel', title: 'Conformité REP', description: 'Détails sur la réglementation REP et DEEE.', route: '/trust/rep-compliance' },
    { icon: 'business', title: 'Entreprises', description: 'Pilotez votre conformité environnementale.', route: '/entreprise' },
    { icon: 'mail', title: 'Contact', description: 'Une question ? Contactez un expert.', route: '/contact' }
  ];

  toggle(index: number): void {
    if (this.toggledQuestions.has(index)) {
      this.toggledQuestions.delete(index);
    } else {
      this.toggledQuestions.add(index);
    }
  }
}
