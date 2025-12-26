import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <footer class="footer">
      <div class="footer-main">
        <div class="footer-container">
          <!-- Colonne 1 - Circular Electronics -->
          <div class="footer-column">
            <h3 class="column-title">Circular Electronics</h3>
            <ul class="footer-links">
              <li><a routerLink="/about/mission">Mission</a></li>
              <li><a routerLink="/about/vision">Vision</a></li>
              <li><a routerLink="/about/governance">Gouvernance</a></li>
              <li><a routerLink="/about/partners">Partenaires</a></li>
            </ul>
          </div>

          <!-- Colonne 2 - Acteurs -->
          <div class="footer-column">
            <h3 class="column-title">Acteurs</h3>
            <ul class="footer-links">
              <li><a routerLink="/actors/individuals">Particuliers</a></li>
              <li><a routerLink="/actors/associations">Associations</a></li>
              <li><a routerLink="/actors/companies">Entreprises</a></li>
              <li><a routerLink="/actors/communities">Collectivites</a></li>
            </ul>
          </div>

          <!-- Colonne 3 - Confiance & Régulation -->
          <div class="footer-column">
            <h3 class="column-title">Confiance & Regulation</h3>
            <ul class="footer-links">
              <li><a routerLink="/trust/traceability">Tracabilite</a></li>
              <li><a routerLink="/trust/rep-compliance">Conformite REP</a></li>
              <li><a routerLink="/trust/methodology">Methodologie</a></li>
              <li><a routerLink="/trust/data-security">Securite des donnees</a></li>
            </ul>
          </div>

          <!-- Colonne 4 - Ressources -->
          <div class="footer-column">
            <h3 class="column-title">Ressources</h3>
            <ul class="footer-links">
              <li><a routerLink="/resources/blog">Blog</a></li>
              <li><a routerLink="/resources/studies">Etudes & chiffres</a></li>
              <li><a routerLink="/resources/press">Presse</a></li>
              <li><a routerLink="/resources/faq">FAQ reglementaire</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bas de footer -->
      <div class="footer-bottom">
        <div class="footer-container bottom-container">
          <div class="copyright">
            &copy; {{ currentYear }} Circular Electronics - Tous droits reserves
          </div>

          <div class="legal-links">
            <a routerLink="/legal/terms">Mentions legales</a>
            <span class="separator">|</span>
            <a routerLink="/legal/privacy">Politique de confidentialite</a>
            <span class="separator">|</span>
            <a routerLink="/contact/institutional">Contact institutionnel</a>
          </div>

          <div class="signature">
            <mat-icon>eco</mat-icon>
            <span>"La technologie au service d'une economie circulaire de confiance."</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--ce-gray-900, #212121);
      color: var(--ce-gray-300, #e0e0e0);
      margin-top: auto;
      font-family: var(--ce-font-family, 'Poppins', sans-serif);
    }

    .footer-main {
      padding: 3rem 1.5rem 2rem;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .footer-column {
      display: flex;
      flex-direction: column;
    }

    .column-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--ce-white, #ffffff);
      margin: 0 0 1.25rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--ce-primary, #1a1fd8);
    }

    .footer-links {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-links a {
      color: var(--ce-gray-400, #bdbdbd);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 400;
      transition: color 0.2s ease, padding-left 0.2s ease;

      &:hover {
        color: var(--ce-white, #ffffff);
        padding-left: 4px;
      }
    }

    .footer-bottom {
      background: rgba(0, 0, 0, 0.3);
      padding: 1.5rem;
      border-top: 1px solid var(--ce-gray-700, #616161);
    }

    .bottom-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }

    .copyright {
      font-size: 0.85rem;
      color: var(--ce-gray-400, #bdbdbd);
    }

    .legal-links {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: center;

      a {
        color: var(--ce-gray-400, #bdbdbd);
        text-decoration: none;
        font-size: 0.85rem;
        transition: color 0.2s ease;

        &:hover {
          color: var(--ce-white, #ffffff);
        }
      }

      .separator {
        color: var(--ce-gray-600, #757575);
      }
    }

    .signature {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(26, 31, 216, 0.15);
      border-radius: 24px;
      border: 1px solid rgba(26, 31, 216, 0.4);

      mat-icon {
        color: var(--ce-secondary, #19e166);
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }

      span {
        font-style: italic;
        font-size: 0.9rem;
        font-weight: 300;
        color: var(--ce-gray-300, #e0e0e0);
      }
    }

    /* Responsive */
    @media (max-width: 992px) {
      .footer-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 576px) {
      .footer-container {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .column-title {
        border-bottom: none;
        padding-bottom: 0;
      }

      .footer-links {
        gap: 0.5rem;
      }

      .footer-links a:hover {
        padding-left: 0;
      }

      .legal-links {
        flex-direction: column;
        gap: 0.5rem;

        .separator {
          display: none;
        }
      }

      .signature {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
