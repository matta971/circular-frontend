import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-privacy',
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
          <h1>Politique de Confidentialit&eacute;</h1>
        </div>
      </section>

      <!-- Content -->
      <section class="section">
        <div class="container">

          <div class="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Circular Electronics s'engage &agrave; prot&eacute;ger la vie priv&eacute;e de ses utilisateurs
              conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es (RGPD)
              et &agrave; la loi Informatique et Libert&eacute;s. La pr&eacute;sente politique d&eacute;crit
              comment nous collectons, utilisons et prot&eacute;geons vos donn&eacute;es personnelles.
            </p>
          </div>

          <div class="legal-section">
            <h2>2. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des donn&eacute;es est Circular Electronics,
              dont le si&egrave;ge social est situ&eacute; &agrave; Paris, France.
            </p>
            <p>
              <strong>Contact DPO :</strong> matta971&#64;gmail.com
            </p>
          </div>

          <div class="legal-section">
            <h2>3. Donn&eacute;es collect&eacute;es</h2>
            <p>Nous collectons les cat&eacute;gories de donn&eacute;es suivantes :</p>
            <ul>
              <li>
                <strong>Compte utilisateur :</strong> nom, pr&eacute;nom, adresse email, num&eacute;ro de t&eacute;l&eacute;phone
              </li>
              <li>
                <strong>Formulaire de contact :</strong> nom, email, objet et contenu du message
              </li>
              <li>
                <strong>Donn&eacute;es d'utilisation :</strong> cookies techniques, journaux de connexion (adresse IP, navigateur, pages visit&eacute;es)
              </li>
            </ul>
          </div>

          <div class="legal-section">
            <h2>4. Finalit&eacute;s</h2>
            <p>Vos donn&eacute;es sont trait&eacute;es pour les finalit&eacute;s suivantes :</p>
            <ul>
              <li><strong>Fourniture du service :</strong> cr&eacute;ation et gestion de votre compte, acc&egrave;s aux fonctionnalit&eacute;s de la plateforme</li>
              <li><strong>Communication :</strong> r&eacute;ponse &agrave; vos demandes, envoi d'informations relatives au service</li>
              <li><strong>Am&eacute;lioration :</strong> analyse de l'utilisation du site pour am&eacute;liorer nos services</li>
              <li><strong>Conformit&eacute; l&eacute;gale :</strong> respect de nos obligations r&eacute;glementaires</li>
            </ul>
          </div>

          <div class="legal-section">
            <h2>5. Base l&eacute;gale</h2>
            <p>Le traitement de vos donn&eacute;es repose sur les bases l&eacute;gales suivantes :</p>
            <ul>
              <li><strong>Consentement :</strong> pour l'envoi de communications marketing et le d&eacute;p&ocirc;t de cookies non essentiels</li>
              <li><strong>Ex&eacute;cution du contrat :</strong> pour la fourniture des services auxquels vous avez souscrit</li>
              <li><strong>Int&eacute;r&ecirc;t l&eacute;gitime :</strong> pour l'am&eacute;lioration de nos services et la s&eacute;curit&eacute; de la plateforme</li>
              <li><strong>Obligation l&eacute;gale :</strong> pour le respect de nos obligations comptables et fiscales</li>
            </ul>
          </div>

          <div class="legal-section">
            <h2>6. Dur&eacute;e de conservation</h2>
            <ul>
              <li><strong>Comptes actifs :</strong> dur&eacute;e du contrat + 3 ans apr&egrave;s la cl&ocirc;ture du compte</li>
              <li><strong>Leads et prospects :</strong> 12 mois &agrave; compter du dernier contact</li>
              <li><strong>Journaux de connexion :</strong> 6 mois</li>
            </ul>
          </div>

          <div class="legal-section">
            <h2>7. Vos droits</h2>
            <p>
              Conform&eacute;ment au RGPD, vous disposez des droits suivants sur vos donn&eacute;es personnelles :
            </p>
            <ul>
              <li><strong>Droit d'acc&egrave;s :</strong> obtenir la confirmation que vos donn&eacute;es sont trait&eacute;es et en obtenir une copie</li>
              <li><strong>Droit de rectification :</strong> faire corriger vos donn&eacute;es inexactes ou incompl&egrave;tes</li>
              <li><strong>Droit &agrave; l'effacement :</strong> demander la suppression de vos donn&eacute;es dans les conditions pr&eacute;vues par la loi</li>
              <li><strong>Droit &agrave; la portabilit&eacute; :</strong> recevoir vos donn&eacute;es dans un format structur&eacute; et lisible par machine</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos donn&eacute;es pour des motifs l&eacute;gitimes</li>
              <li><strong>Droit &agrave; la limitation :</strong> demander la limitation du traitement dans certains cas</li>
            </ul>
            <p>
              Pour exercer vos droits, contactez-nous &agrave; l'adresse : matta971&#64;gmail.com.
              Vous disposez &eacute;galement du droit d'introduire une r&eacute;clamation aupr&egrave;s de la CNIL.
            </p>
          </div>

          <div class="legal-section">
            <h2>8. Cookies</h2>
            <p>
              Notre site utilise des cookies techniques n&eacute;cessaires au fonctionnement du service
              (authentification, pr&eacute;f&eacute;rences de session) ainsi que des cookies analytiques
              pour mesurer l'audience du site.
            </p>
            <p>
              Vous pouvez g&eacute;rer vos pr&eacute;f&eacute;rences en mati&egrave;re de cookies &agrave; tout moment
              via les param&egrave;tres de votre navigateur. La d&eacute;sactivation de certains cookies
              peut affecter votre exp&eacute;rience de navigation.
            </p>
          </div>

          <div class="legal-section">
            <h2>9. Transferts de donn&eacute;es</h2>
            <p>
              Vos donn&eacute;es sont h&eacute;berg&eacute;es au sein de l'Union europ&eacute;enne,
              chez notre prestataire Hetzner Online GmbH (Allemagne).
              Aucun transfert de donn&eacute;es hors de l'Espace &eacute;conomique europ&eacute;en n'est r&eacute;alis&eacute;.
            </p>
          </div>

          <div class="legal-section">
            <h2>10. Modifications</h2>
            <p>
              Circular Electronics se r&eacute;serve le droit de modifier la pr&eacute;sente politique
              de confidentialit&eacute; &agrave; tout moment. Les utilisateurs seront inform&eacute;s
              de toute modification substantielle par notification sur le site.
            </p>
            <p>
              <strong>Derni&egrave;re mise &agrave; jour :</strong> F&eacute;vrier 2026
            </p>
          </div>

          <div class="legal-section">
            <h2>11. Contact</h2>
            <p>
              Pour toute question relative &agrave; la pr&eacute;sente politique de confidentialit&eacute;
              ou &agrave; la gestion de vos donn&eacute;es personnelles, vous pouvez nous contacter &agrave; l'adresse :
            </p>
            <p>
              <strong>Email :</strong> matta971&#64;gmail.com
            </p>
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

    .legal-section ul {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0 0;
    }

    .legal-section ul li {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.7;
      padding: 0.4rem 0 0.4rem 1.5rem;
      position: relative;
    }

    .legal-section ul li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.85rem;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #474bfe;
    }

    .legal-section ul li strong {
      color: #1e293b;
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
    }
  `]
})
export class PrivacyComponent {}
