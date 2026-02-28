import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PublicHeaderComponent } from '../../../shared/components/layout/public-header.component';
import { FooterComponent } from '../../../shared/components/layout/footer.component';

@Component({
  selector: 'app-data-security',
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
          <h1>Sécurité des données</h1>
          <p class="hero-subtitle">
            La protection de vos données est notre priorité
          </p>
        </div>
      </section>

      <!-- Conformité RGPD -->
      <section class="section">
        <div class="container">
          <h2>Conformité RGPD</h2>
          <p class="section-intro">
            Circular Electronics respecte le Règlement Général sur la Protection des Données (RGPD)
            dans l'ensemble de ses traitements.
          </p>
          <div class="rgpd-grid">
            <div class="rgpd-card">
              <mat-icon>data_usage</mat-icon>
              <h3>Collecte minimale</h3>
              <p>
                Nous ne collectons que les données strictement nécessaires au fonctionnement
                du service. Aucune donnée superflue n'est demandée ni conservée.
              </p>
            </div>
            <div class="rgpd-card">
              <mat-icon>assignment</mat-icon>
              <h3>Finalités explicites</h3>
              <p>
                Chaque donnée collectée est associée à une finalité clairement définie
                et communiquée. Vos données ne sont jamais utilisées à d'autres fins.
              </p>
            </div>
            <div class="rgpd-card">
              <mat-icon>timer</mat-icon>
              <h3>Durée limitée</h3>
              <p>
                Les données sont conservées uniquement pendant la durée nécessaire
                à leur traitement. Elles sont ensuite supprimées ou anonymisées.
              </p>
            </div>
            <div class="rgpd-card">
              <mat-icon>how_to_reg</mat-icon>
              <h3>Droits exerçables</h3>
              <p>
                Vous pouvez exercer l'ensemble de vos droits RGPD à tout moment,
                directement depuis votre espace personnel ou par simple demande.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Mesures techniques -->
      <section class="section section-alt">
        <div class="container">
          <h2>Mesures techniques</h2>
          <p class="section-intro">
            Nous mettons en place des mesures de sécurité robustes
            pour protéger vos données à chaque instant.
          </p>
          <div class="measures-grid">
            <div class="measure-card">
              <mat-icon>lock</mat-icon>
              <h3>Chiffrement</h3>
              <p>
                Toutes les communications sont chiffrées en TLS 1.3.
                Les données sensibles sont chiffrées au repos avec AES-256.
                Vos mots de passe sont hashés avec des algorithmes de pointe.
              </p>
            </div>
            <div class="measure-card">
              <mat-icon>cloud</mat-icon>
              <h3>Hébergement UE</h3>
              <p>
                L'ensemble de nos serveurs et bases de données sont hébergés
                dans l'Union européenne, garantissant la conformité
                avec les exigences de localisation du RGPD.
              </p>
            </div>
            <div class="measure-card">
              <mat-icon>backup</mat-icon>
              <h3>Sauvegardes</h3>
              <p>
                Des sauvegardes automatiques sont réalisées quotidiennement,
                chiffrées et stockées sur des sites géographiquement distincts
                pour garantir la continuité du service.
              </p>
            </div>
            <div class="measure-card">
              <mat-icon>admin_panel_settings</mat-icon>
              <h3>Accès contrôlé</h3>
              <p>
                L'accès aux données est strictement limité au personnel autorisé.
                Authentification multi-facteurs, journaux d'audit
                et principe du moindre privilège sont appliqués.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Vos droits -->
      <section class="section">
        <div class="container">
          <h2>Vos droits</h2>
          <p class="section-intro">
            Conformément au RGPD, vous disposez de droits étendus sur vos données personnelles.
          </p>
          <div class="rights-list">
            <div class="right-item">
              <mat-icon>visibility</mat-icon>
              <div class="right-content">
                <h3>Droit d'accès</h3>
                <p>
                  Vous pouvez demander à tout moment une copie de l'ensemble
                  des données personnelles que nous détenons à votre sujet.
                </p>
              </div>
            </div>
            <div class="right-item">
              <mat-icon>edit</mat-icon>
              <div class="right-content">
                <h3>Droit de rectification</h3>
                <p>
                  Si vos données sont inexactes ou incomplètes,
                  vous pouvez demander leur correction à tout moment.
                </p>
              </div>
            </div>
            <div class="right-item">
              <mat-icon>delete_forever</mat-icon>
              <div class="right-content">
                <h3>Droit à l'effacement</h3>
                <p>
                  Vous pouvez demander la suppression de vos données personnelles.
                  Nous procédons à l'effacement dans un délai maximum de 30 jours.
                </p>
              </div>
            </div>
            <div class="right-item">
              <mat-icon>download</mat-icon>
              <div class="right-content">
                <h3>Droit à la portabilité</h3>
                <p>
                  Vous pouvez récupérer vos données dans un format structuré,
                  couramment utilisé et lisible par machine, pour les transférer à un autre service.
                </p>
              </div>
            </div>
            <div class="right-item">
              <mat-icon>block</mat-icon>
              <div class="right-content">
                <h3>Droit d'opposition</h3>
                <p>
                  Vous pouvez vous opposer à tout moment au traitement de vos données
                  à des fins de prospection ou pour des motifs légitimes.
                </p>
              </div>
            </div>
          </div>

          <div class="dpo-contact">
            <mat-icon>contact_mail</mat-icon>
            <div>
              <h3>Contacter notre DPO</h3>
              <p>
                Pour exercer vos droits ou pour toute question relative à la protection
                de vos données, contactez notre Délégué à la Protection des Données :
              </p>
              <p class="dpo-email">
                <mat-icon>email</mat-icon>
                <a href="mailto:dpo&#64;circular-electronics.fr">dpo&#64;circular-electronics.fr</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="section section-cta">
        <div class="container" style="text-align: center;">
          <h2>Vos données sont en sécurité</h2>
          <p>Rejoignez une plateforme qui place la protection de vos données au coeur de ses engagements.</p>
          <a mat-raised-button color="primary" routerLink="/auth/register" class="cta-button">
            Créer un compte sécurisé
          </a>
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

    /* RGPD Grid */
    .rgpd-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .rgpd-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .rgpd-card mat-icon {
      font-size: 2.5rem;
      width: 40px;
      height: 40px;
      color: #474bfe;
      margin-bottom: 1rem;
    }

    .rgpd-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.75rem 0;
      color: #1e293b;
    }

    .rgpd-card p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* Measures Grid */
    .measures-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .measure-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .measure-card mat-icon {
      font-size: 2.5rem;
      width: 40px;
      height: 40px;
      color: #474bfe;
      margin-bottom: 1rem;
    }

    .measure-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.75rem 0;
      color: #1e293b;
    }

    .measure-card p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* Rights List */
    .rights-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .right-item {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      background: #ffffff;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .right-item > mat-icon {
      font-size: 1.8rem;
      width: 28px;
      height: 28px;
      color: #474bfe;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .right-content h3 {
      font-size: 1.05rem;
      font-weight: 600;
      margin: 0 0 0.4rem 0;
      color: #1e293b;
    }

    .right-content p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* DPO Contact */
    .dpo-contact {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      margin-top: 2.5rem;
      background: #eef2ff;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #c7d2fe;
    }

    .dpo-contact > mat-icon {
      font-size: 2rem;
      width: 32px;
      height: 32px;
      color: #474bfe;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .dpo-contact h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #1e293b;
    }

    .dpo-contact > div > p {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 0.75rem 0;
    }

    .dpo-email {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dpo-email mat-icon {
      font-size: 1.2rem;
      width: 20px;
      height: 20px;
      color: #474bfe;
    }

    .dpo-email a {
      color: #474bfe;
      text-decoration: none;
      font-weight: 500;
    }

    .dpo-email a:hover {
      text-decoration: underline;
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

    /* Responsive */
    @media (max-width: 900px) {
      .rgpd-grid {
        grid-template-columns: 1fr;
      }
      .measures-grid {
        grid-template-columns: 1fr;
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
      .right-item {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .dpo-contact {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .dpo-email {
        justify-content: center;
      }
    }
  `]
})
export class DataSecurityComponent {}
