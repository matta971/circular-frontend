import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ScoringAdminService, ScoringRuleSet } from '../../services/scoring-admin.service';
import { CloneDialogComponent } from '../clone-dialog/clone-dialog.component';

@Component({
  selector: 'app-ruleset-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="ruleset-list-container">
      <div class="page-header">
        <div>
          <h1>Scoring & Règles</h1>
          <p class="subtitle">Gérez les versions des règles d'évaluation</p>
        </div>
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon>
          Nouvelle version
        </button>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else {
        <!-- Active RuleSet Card -->
        @if (activeRuleSet()) {
          <mat-card class="active-card">
            <mat-card-header>
              <mat-icon mat-card-avatar class="active-icon">check_circle</mat-icon>
              <mat-card-title>Version Active: {{ activeRuleSet()!.name }}</mat-card-title>
              <mat-card-subtitle>Version {{ activeRuleSet()!.version }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ activeRuleSet()!.description || 'Aucune description' }}</p>
              <div class="weights-preview">
                <span class="weight-label">Poids:</span>
                @for (weight of activeRuleSet()!.weights; track weight.componentType) {
                  <mat-chip>{{ weight.componentType }}: {{ (weight.weight * 100).toFixed(0) }}%</mat-chip>
                }
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-button [routerLink]="[activeRuleSet()!.id]">
                <mat-icon>edit</mat-icon>
                Modifier
              </button>
            </mat-card-actions>
          </mat-card>
        }

        <!-- All Versions Table -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Toutes les versions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="ruleSets()" class="full-width">
              <ng-container matColumnDef="version">
                <th mat-header-cell *matHeaderCellDef>Version</th>
                <td mat-cell *matCellDef="let row">
                  <strong>{{ row.version }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nom</th>
                <td mat-cell *matCellDef="let row">{{ row.name }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let row">
                  @if (row.isActive) {
                    <mat-chip class="chip-active">Actif</mat-chip>
                  } @else if (row.isDefault) {
                    <mat-chip class="chip-default">Par défaut</mat-chip>
                  } @else {
                    <mat-chip>Inactif</mat-chip>
                  }
                </td>
              </ng-container>

              <ng-container matColumnDef="weights">
                <th mat-header-cell *matHeaderCellDef>Poids configurés</th>
                <td mat-cell *matCellDef="let row">
                  {{ row.weights?.length || 0 }} composants
                </td>
              </ng-container>

              <ng-container matColumnDef="updatedAt">
                <th mat-header-cell *matHeaderCellDef>Dernière modification</th>
                <td mat-cell *matCellDef="let row">
                  {{ row.updatedAt | date:'dd/MM/yyyy HH:mm' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let row">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item [routerLink]="[row.id]">
                      <mat-icon>edit</mat-icon>
                      <span>Modifier</span>
                    </button>
                    <button mat-menu-item (click)="cloneRuleSet(row)">
                      <mat-icon>content_copy</mat-icon>
                      <span>Cloner</span>
                    </button>
                    @if (!row.isActive) {
                      <button mat-menu-item (click)="activateRuleSet(row)">
                        <mat-icon>check_circle</mat-icon>
                        <span>Activer</span>
                      </button>
                    } @else {
                      <button mat-menu-item (click)="deactivateRuleSet(row)">
                        <mat-icon>cancel</mat-icon>
                        <span>Désactiver</span>
                      </button>
                    }
                    @if (!row.isActive && !row.isDefault) {
                      <button mat-menu-item (click)="deleteRuleSet(row)" class="delete-action">
                        <mat-icon>delete</mat-icon>
                        <span>Supprimer</span>
                      </button>
                    }
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                  [class.active-row]="row.isActive"></tr>
            </table>

            @if (ruleSets().length === 0) {
              <div class="empty-state">
                <mat-icon>rule</mat-icon>
                <p>Aucune règle de scoring configurée</p>
                <button mat-raised-button color="primary" routerLink="new">
                  Créer la première version
                </button>
              </div>
            }
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .ruleset-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 500;
      }

      .subtitle {
        margin: 0.25rem 0 0;
        color: #666;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .active-card {
      margin-bottom: 2rem;
      border-left: 4px solid #4caf50;

      .active-icon {
        color: #4caf50;
        font-size: 40px;
        width: 40px;
        height: 40px;
      }

      .weights-preview {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;

        .weight-label {
          font-weight: 500;
          color: #666;
        }
      }
    }

    .full-width {
      width: 100%;
    }

    .chip-active {
      background: #e8f5e9 !important;
      color: #2e7d32 !important;
    }

    .chip-default {
      background: #e3f2fd !important;
      color: #1565c0 !important;
    }

    .active-row {
      background: #f1f8e9;
    }

    .delete-action {
      color: #f44336;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem;
      color: #666;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      p {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class RulesetListComponent implements OnInit {
  private scoringService = inject(ScoringAdminService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  loading = signal(true);
  ruleSets = signal<ScoringRuleSet[]>([]);
  activeRuleSet = signal<ScoringRuleSet | null>(null);

  displayedColumns = ['version', 'name', 'status', 'weights', 'updatedAt', 'actions'];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.scoringService.getAll().subscribe(data => {
      this.ruleSets.set(data);
      this.activeRuleSet.set(data.find(r => r.isActive) || null);
      this.loading.set(false);
    });
  }

  activateRuleSet(ruleSet: ScoringRuleSet): void {
    this.scoringService.activate(ruleSet.id).subscribe(result => {
      if (result) {
        this.snackBar.open(`Version ${ruleSet.version} activée`, 'Fermer', { duration: 3000 });
        this.loadData();
      } else {
        this.snackBar.open('Erreur lors de l\'activation', 'Fermer', { duration: 3000 });
      }
    });
  }

  deactivateRuleSet(ruleSet: ScoringRuleSet): void {
    this.scoringService.deactivate(ruleSet.id).subscribe(result => {
      if (result) {
        this.snackBar.open(`Version ${ruleSet.version} désactivée`, 'Fermer', { duration: 3000 });
        this.loadData();
      } else {
        this.snackBar.open('Erreur lors de la désactivation', 'Fermer', { duration: 3000 });
      }
    });
  }

  cloneRuleSet(ruleSet: ScoringRuleSet): void {
    const dialogRef = this.dialog.open(CloneDialogComponent, {
      width: '400px',
      data: { currentVersion: ruleSet.version }
    });

    dialogRef.afterClosed().subscribe(newVersion => {
      if (newVersion) {
        this.scoringService.clone(ruleSet.id, newVersion).subscribe(result => {
          if (result) {
            this.snackBar.open(`Version ${newVersion} créée`, 'Fermer', { duration: 3000 });
            this.loadData();
          } else {
            this.snackBar.open('Erreur lors du clonage', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteRuleSet(ruleSet: ScoringRuleSet): void {
    if (confirm(`Supprimer la version ${ruleSet.version} ?`)) {
      this.scoringService.delete(ruleSet.id).subscribe(success => {
        if (success) {
          this.snackBar.open('Version supprimée', 'Fermer', { duration: 3000 });
          this.loadData();
        } else {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
