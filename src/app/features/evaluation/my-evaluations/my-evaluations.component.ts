import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EvaluationService } from '../../../core/services/evaluation.service';
import {
  EvaluationWithDevice,
  DecisionType,
  OfferStatus,
  ScoreComponentType
} from '../../../core/models/evaluation.model';

@Component({
  selector: 'app-my-evaluations',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <header class="page-header">
        <div>
          <h1>Mes évaluations</h1>
          <p class="subtitle">Historique de toutes vos évaluations d'appareils</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/evaluation">
          <mat-icon>add</mat-icon>
          Nouvelle évaluation
        </a>
      </header>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Chargement de vos évaluations...</p>
        </div>
      } @else if (evaluations().length === 0) {
        <mat-card class="empty-state">
          <mat-icon>assessment</mat-icon>
          <h2>Aucune évaluation</h2>
          <p>Vous n'avez pas encore fait évaluer d'appareils.</p>
          <a mat-raised-button color="primary" routerLink="/evaluation">
            Évaluer un appareil
          </a>
        </mat-card>
      } @else {
        <div class="evaluations-grid">
          @for (eval of evaluations(); track eval.id) {
            <mat-card class="evaluation-card" (click)="viewDetails(eval)">
              <div class="card-header">
                <div class="device-info">
                  <mat-icon class="device-icon">{{ getDeviceIcon(eval.device?.type) }}</mat-icon>
                  <div>
                    <h3>{{ getDeviceTitle(eval) }}</h3>
                    <span class="device-type">{{ eval.createdAt | date:'dd/MM/yyyy à HH:mm' }}</span>
                  </div>
                </div>
                <button mat-icon-button [matMenuTriggerFor]="actionMenu" (click)="$event.stopPropagation()">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #actionMenu="matMenu">
                  <a mat-menu-item [routerLink]="['/repairability', eval.id]">
                    <mat-icon>build</mat-icon>
                    Voir le diagnostic complet
                  </a>
                  @if (eval.offer && eval.offer.status === 'FIRM') {
                    <button mat-menu-item (click)="acceptOffer(eval)">
                      <mat-icon>check_circle</mat-icon>
                      Accepter l'offre
                    </button>
                  }
                  <button mat-menu-item routerLink="/collection/new">
                    <mat-icon>local_shipping</mat-icon>
                    Demander collecte
                  </button>
                  <button mat-menu-item routerLink="/marketplace/create">
                    <mat-icon>storefront</mat-icon>
                    Vendre sur marketplace
                  </button>
                </mat-menu>
              </div>

              <mat-divider></mat-divider>

              <div class="card-body">
                <!-- Score global -->
                <div class="score-section">
                  <div class="global-score" [class]="getScoreClass(getScore(eval))">
                    <span class="score-value">{{ getScore(eval) | number:'1.0-0' }}</span>
                    <span class="score-max">/100</span>
                  </div>
                  <div class="score-details">
                    <span class="score-label">Score global</span>
                    <span class="score-version">v{{ eval.ruleSetVersion }}</span>
                  </div>
                </div>

                <!-- Valeur estimee -->
                <div class="value-section">
                  <div class="value-range">
                    <mat-icon>euro</mat-icon>
                    <span class="value">{{ getEstimatedValue(eval) | currency:'EUR':'symbol':'1.0-0' }}</span>
                  </div>
                  <span class="value-label">Valeur estimée de rachat</span>
                </div>

                <!-- Decision -->
                @if (getDecision(eval)) {
                  <div class="decision-section">
                    <mat-chip [class]="'decision-' + getDecision(eval)!.toLowerCase()">
                      <mat-icon>{{ getDecisionIcon(getDecision(eval)!) }}</mat-icon>
                      {{ getDecisionLabel(getDecision(eval)!) }}
                    </mat-chip>
                  </div>
                }

                <!-- Offre -->
                @if (eval.offer) {
                  <div class="offer-section" [class]="'offer-' + eval.offer.status.toLowerCase()">
                    <div class="offer-header">
                      <mat-icon>local_offer</mat-icon>
                      <span>Offre {{ getOfferStatusLabel(eval.offer.status) }}</span>
                    </div>
                    <div class="offer-amount">
                      {{ (eval.offer.firmAmountEur || eval.offer.indicativeAmountEur) | currency:'EUR' }}
                    </div>
                    @if (eval.offer.validUntil && eval.offer.status === 'FIRM') {
                      <span class="offer-expiry">
                        Valide jusqu'au {{ eval.offer.validUntil | date:'short' }}
                      </span>
                    }
                  </div>
                }
              </div>

              <mat-divider></mat-divider>

              <div class="card-footer">
                <span class="evaluation-id">Évaluation #{{ eval.id }}</span>
                <div class="actions">
                  <button mat-stroked-button color="primary" (click)="$event.stopPropagation(); viewDetails(eval)">
                    <mat-icon>visibility</mat-icon>
                    Voir diagnostic
                  </button>
                </div>
              </div>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
      }

      .subtitle {
        color: rgba(0, 0, 0, 0.6);
        margin: 0.25rem 0 0;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem;
      gap: 1rem;
      color: rgba(0, 0, 0, 0.6);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: rgba(0, 0, 0, 0.3);
      }

      h2 {
        margin: 1rem 0 0.5rem;
      }

      p {
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 1.5rem;
      }
    }

    .evaluations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.5rem;
    }

    .evaluation-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 1rem;

        .device-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .device-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
            color: #1976d2;
          }

          h3 {
            margin: 0;
            font-size: 1rem;
          }

          .device-type {
            font-size: 0.875rem;
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }

      .card-body {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .score-section {
        display: flex;
        align-items: center;
        gap: 1rem;

        .global-score {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;

          &.score-excellent { background: #4caf50; }
          &.score-good { background: #8bc34a; }
          &.score-fair { background: #ff9800; }
          &.score-poor { background: #f44336; }

          .score-value {
            font-size: 1.25rem;
            font-weight: bold;
            line-height: 1;
          }

          .score-max {
            font-size: 0.625rem;
            opacity: 0.8;
          }
        }

        .score-details {
          display: flex;
          flex-direction: column;

          .score-label {
            font-weight: 500;
          }

          .score-version {
            font-size: 0.75rem;
            color: rgba(0, 0, 0, 0.5);
          }
        }
      }

      .value-section {
        background: #f5f5f5;
        padding: 0.75rem 1rem;
        border-radius: 8px;

        .value-range {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
            color: #4caf50;
          }

          .value {
            font-size: 1.1rem;
            font-weight: 500;
            color: #4caf50;
          }

          .separator {
            color: rgba(0, 0, 0, 0.4);
          }
        }

        .value-label {
          font-size: 0.75rem;
          color: rgba(0, 0, 0, 0.6);
        }
      }

      .decision-section {
        mat-chip {
          &.decision-reparer { background: #e8f5e9; color: #2e7d32; }
          &.decision-reconditionner { background: #e3f2fd; color: #1565c0; }
          &.decision-revente_p2p { background: #fff3e0; color: #ef6c00; }
          &.decision-recycler { background: #fce4ec; color: #c2185b; }
          &.decision-refuser { background: #ffebee; color: #c62828; }

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }
        }
      }

      .offer-section {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border-left: 4px solid;

        &.offer-indicative {
          background: #fff8e1;
          border-color: #ffc107;
        }

        &.offer-firm {
          background: #e8f5e9;
          border-color: #4caf50;
        }

        &.offer-accepted {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        &.offer-expired, &.offer-refused {
          background: #f5f5f5;
          border-color: #9e9e9e;
        }

        .offer-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }

        .offer-amount {
          font-size: 1.25rem;
          font-weight: bold;
          color: #2e7d32;
        }

        .offer-expiry {
          font-size: 0.75rem;
          color: rgba(0, 0, 0, 0.6);
        }
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;

        .date, .evaluation-id {
          font-size: 0.75rem;
          color: rgba(0, 0, 0, 0.5);
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          padding: 0.25rem 0.75rem;
          border-radius: 16px;

          &.accepted {
            background: #e8f5e9;
            color: #2e7d32;
          }

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  `]
})
export class MyEvaluationsComponent implements OnInit {
  private evaluationService = inject(EvaluationService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  loading = signal(true);
  evaluations = signal<EvaluationWithDevice[]>([]);

  ngOnInit(): void {
    this.loadEvaluations();
  }

  loadEvaluations(): void {
    this.loading.set(true);
    this.evaluationService.getMyEvaluations().subscribe({
      next: (data) => {
        this.evaluations.set(data);
        this.loading.set(false);
      },
      error: () => {
        // Fallback avec donnees mockees pour demo
        this.evaluations.set(this.getMockEvaluations());
        this.loading.set(false);
      }
    });
  }

  getDeviceIcon(type?: string): string {
    const icons: Record<string, string> = {
      'SMARTPHONE': 'smartphone',
      'LAPTOP': 'laptop',
      'TABLET': 'tablet',
      'DESKTOP': 'desktop_windows',
      'TV': 'tv',
      'CONSOLE': 'videogame_asset',
      'PERIPHERAL': 'keyboard'
    };
    return icons[type || ''] || 'devices_other';
  }

  getDeviceTypeLabel(type?: string): string {
    const labels: Record<string, string> = {
      'SMARTPHONE': 'Smartphone',
      'LAPTOP': 'Ordinateur portable',
      'TABLET': 'Tablette',
      'DESKTOP': 'PC Bureau',
      'TV': 'Television',
      'CONSOLE': 'Console',
      'PERIPHERAL': 'Peripherique'
    };
    return labels[type || ''] || 'Autre';
  }

  getDeviceTitle(eval_: EvaluationWithDevice): string {
    if (eval_.device?.brand && eval_.device?.model) {
      return `${eval_.device.brand} ${eval_.device.model}`;
    }
    return `Appareil #${eval_.deviceId}`;
  }

  getScore(eval_: EvaluationWithDevice): number {
    return eval_.globalScore ?? eval_.result?.totalScore ?? 0;
  }

  getEstimatedValue(eval_: EvaluationWithDevice): number {
    return eval_.estimatedValueEur ?? eval_.result?.indicativeBuybackEur ?? 0;
  }

  getDecision(eval_: EvaluationWithDevice): string | null {
    // Check different possible locations for decision
    if (eval_.decision?.decisionType) {
      return eval_.decision.decisionType;
    }
    // API returns decision.decision instead of decision.decisionType
    const decision = eval_.decision as any;
    if (decision?.decision) {
      return decision.decision;
    }
    return null;
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  }

  getDecisionIcon(decision: string): string {
    const icons: Record<string, string> = {
      'REPARER': 'build',
      'RECONDITIONNER': 'auto_fix_high',
      'REVENTE_P2P': 'storefront',
      'RECYCLER': 'recycling',
      'REFUSER': 'cancel'
    };
    return icons[decision] || 'help';
  }

  getDecisionLabel(decision: string): string {
    const labels: Record<string, string> = {
      'REPARER': 'Reparation',
      'RECONDITIONNER': 'Reconditionnement',
      'REVENTE_P2P': 'Revente P2P',
      'RECYCLER': 'Recyclage',
      'REFUSER': 'Refuse'
    };
    return labels[decision] || decision;
  }

  getOfferStatusLabel(status: OfferStatus): string {
    const labels: Record<string, string> = {
      'INDICATIVE': 'indicative',
      'FIRM': 'ferme',
      'EXPIRED': 'expiree',
      'CANCELLED': 'annulee',
      'ACCEPTED': 'acceptee',
      'REFUSED': 'refusee'
    };
    return labels[status] || status;
  }

  viewDetails(evaluation: EvaluationWithDevice): void {
    // Naviguer vers la page de diagnostic/reparabilite
    this.router.navigate(['/repairability', evaluation.id]);
  }

  requestFirmOffer(evaluation: EvaluationWithDevice): void {
    this.evaluationService.generateFirmOffer(evaluation.id).subscribe({
      next: (offer) => {
        this.snackBar.open('Offre ferme generee avec succes!', 'OK', { duration: 3000 });
        this.loadEvaluations();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la generation de l\'offre', 'OK', { duration: 3000 });
      }
    });
  }

  acceptOffer(evaluation: EvaluationWithDevice): void {
    if (!evaluation.offer) return;

    this.evaluationService.acceptOffer(evaluation.offer.offerRef).subscribe({
      next: () => {
        this.snackBar.open('Offre acceptee! Vous serez contacte pour la suite.', 'OK', { duration: 5000 });
        this.loadEvaluations();
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'acceptation de l\'offre', 'OK', { duration: 3000 });
      }
    });
  }

  private getMockEvaluations(): EvaluationWithDevice[] {
    return [
      {
        id: 1,
        deviceId: 1,
        ruleSetId: 1,
        ruleSetVersion: '1.0.0',
        source: 'USER_DECLARATION' as any,
        globalScore: 72,
        estimatedValueEur: 180,
        minValueEur: 150,
        maxValueEur: 210,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        device: {
          id: 1,
          type: 'SMARTPHONE',
          brand: 'Apple',
          model: 'iPhone 12',
          condition: 'GOOD'
        },
        decision: {
          id: 1,
          evaluationId: 1,
          decisionType: 'RECONDITIONNER' as DecisionType,
          confidence: 85,
          decidedAt: new Date().toISOString()
        },
        offer: {
          id: 1,
          offerRef: 'OFF-2024-001',
          deviceId: 1,
          evaluationId: 1,
          userId: 1,
          indicativeAmountEur: 175,
          firmAmountEur: 170,
          status: 'FIRM' as OfferStatus,
          validUntil: new Date(Date.now() + 86400000 * 7).toISOString(),
          createdAt: new Date().toISOString()
        }
      },
      {
        id: 2,
        deviceId: 2,
        ruleSetId: 1,
        ruleSetVersion: '1.0.0',
        source: 'USER_DECLARATION' as any,
        globalScore: 45,
        estimatedValueEur: 80,
        minValueEur: 60,
        maxValueEur: 100,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        device: {
          id: 2,
          type: 'LAPTOP',
          brand: 'Dell',
          model: 'XPS 13',
          condition: 'FAIR'
        },
        decision: {
          id: 2,
          evaluationId: 2,
          decisionType: 'RECYCLER' as DecisionType,
          confidence: 70,
          decidedAt: new Date().toISOString()
        }
      },
      {
        id: 3,
        deviceId: 3,
        ruleSetId: 1,
        ruleSetVersion: '1.0.0',
        source: 'USER_DECLARATION' as any,
        globalScore: 88,
        estimatedValueEur: 350,
        minValueEur: 300,
        maxValueEur: 400,
        createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        device: {
          id: 3,
          type: 'SMARTPHONE',
          brand: 'Samsung',
          model: 'Galaxy S23',
          condition: 'GOOD'
        },
        decision: {
          id: 3,
          evaluationId: 3,
          decisionType: 'REVENTE_P2P' as DecisionType,
          confidence: 92,
          decidedAt: new Date().toISOString()
        },
        offer: {
          id: 2,
          offerRef: 'OFF-2024-002',
          deviceId: 3,
          evaluationId: 3,
          userId: 1,
          indicativeAmountEur: 340,
          status: 'ACCEPTED' as OfferStatus,
          acceptedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
        }
      }
    ];
  }
}
