import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="home-container">
      <section class="hero">
        <h1>Recyclez vos appareils électroniques</h1>
        <p>Évaluez, faites collecter ou déposez vos équipements et recevez une récompense</p>
      </section>

      <section class="services">
        <mat-card class="service-card" routerLink="/evaluation">
          <mat-icon class="service-icon evaluate">devices</mat-icon>
          <mat-card-header>
            <mat-card-title>Évaluer mes appareils</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Obtenez une estimation de la valeur de vos appareils électroniques en quelques clics</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">Commencer l'évaluation</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="service-card" routerLink="/collection/new">
          <mat-icon class="service-icon collect">local_shipping</mat-icon>
          <mat-card-header>
            <mat-card-title>Demander une collecte</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Planifiez le passage d'un chauffeur pour récupérer vos appareils à domicile</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="accent">Planifier une collecte</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="service-card" routerLink="/deposit">
          <mat-icon class="service-icon deposit">place</mat-icon>
          <mat-card-header>
            <mat-card-title>Déposer en point de collecte</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Trouvez un point de dépôt proche de chez vous et générez votre QR code</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="warn">Trouver un point</button>
          </mat-card-actions>
        </mat-card>
      </section>

      <section class="how-it-works">
        <h2>Comment ça marche ?</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Évaluez</h3>
            <p>Prenez en photo ou décrivez vos appareils pour obtenir une estimation</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Collectez ou Déposez</h3>
            <p>Choisissez entre une collecte à domicile ou un dépôt en point relais</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Recyclage</h3>
            <p>Vos appareils sont analysés et recyclés de manière responsable</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>Récompense</h3>
            <p>Recevez votre récompense dans votre wallet Circular</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      text-align: center;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #4caf50 0%, #2196f3 100%);
      color: white;
      border-radius: 16px;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.2rem;
        opacity: 0.9;
      }
    }

    .services {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .service-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      text-align: center;
      padding: 1rem;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      mat-card-header {
        justify-content: center;
      }

      mat-card-content {
        padding: 1rem 0;
      }

      mat-card-actions {
        justify-content: center;
      }
    }

    .service-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin: 1rem auto;

      &.evaluate { color: #4caf50; }
      &.collect { color: #2196f3; }
      &.deposit { color: #ff9800; }
    }

    .how-it-works {
      text-align: center;

      h2 {
        margin-bottom: 3rem;
        font-size: 2rem;
      }
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .step {
      .step-number {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #4caf50;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0 auto 1rem;
      }

      h3 {
        margin-bottom: 0.5rem;
      }

      p {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  `]
})
export class HomeComponent {}
