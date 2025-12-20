import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard">
      <h1>Tableau de bord</h1>

      <!-- KPIs -->
      <div class="kpi-grid">
        <mat-card class="kpi-card">
          <mat-icon class="collections">local_shipping</mat-icon>
          <div class="kpi-content">
            <span class="value">{{ kpis().collectionsToday }}</span>
            <span class="label">Collectes aujourd'hui</span>
          </div>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-icon class="devices">devices</mat-icon>
          <div class="kpi-content">
            <span class="value">{{ kpis().devicesThisMonth }}</span>
            <span class="label">Appareils ce mois</span>
          </div>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-icon class="users">people</mat-icon>
          <div class="kpi-content">
            <span class="value">{{ kpis().newUsers }}</span>
            <span class="label">Nouveaux utilisateurs</span>
          </div>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-icon class="revenue">euro</mat-icon>
          <div class="kpi-content">
            <span class="value">{{ kpis().revenueThisMonth | currency:'EUR':'symbol':'1.0-0' }}</span>
            <span class="label">Valeur recyclée</span>
          </div>
        </mat-card>
      </div>

      <div class="content-grid">
        <!-- Collectes récentes -->
        <mat-card class="table-card">
          <mat-card-header>
            <mat-card-title>Collectes récentes</mat-card-title>
            <button mat-button color="primary" routerLink="collections">Voir tout</button>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="recentCollections()">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let c">#{{ c.id.slice(0, 8) }}</td>
              </ng-container>

              <ng-container matColumnDef="client">
                <th mat-header-cell *matHeaderCellDef>Client</th>
                <td mat-cell *matCellDef="let c">{{ c.client }}</td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let c">{{ c.date | date:'shortDate' }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let c">
                  <mat-chip [class]="c.statusClass">{{ c.statusLabel }}</mat-chip>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="['id', 'client', 'date', 'status']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id', 'client', 'date', 'status'];"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Alertes -->
        <mat-card class="alerts-card">
          <mat-card-header>
            <mat-card-title>Alertes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @for (alert of alerts(); track alert.id) {
              <div class="alert-item" [class]="alert.type">
                <mat-icon>{{ getAlertIcon(alert.type) }}</mat-icon>
                <div class="alert-content">
                  <span class="alert-message">{{ alert.message }}</span>
                  <span class="alert-time">{{ alert.time }}</span>
                </div>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Graphique / Activité -->
      <mat-card class="activity-card">
        <mat-card-header>
          <mat-card-title>Activité des 7 derniers jours</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="activity-chart">
            @for (day of weekActivity(); track day.date) {
              <div class="day-bar">
                <div class="bar" [style.height.%]="day.value / maxActivity() * 100"></div>
                <span class="day-label">{{ day.label }}</span>
                <span class="day-value">{{ day.value }}</span>
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard {
      h1 {
        margin: 0 0 1.5rem;
      }
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .kpi-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;

        &.collections { color: #2196f3; }
        &.devices { color: #4caf50; }
        &.users { color: #ff9800; }
        &.revenue { color: #9c27b0; }
      }

      .kpi-content {
        display: flex;
        flex-direction: column;

        .value {
          font-size: 1.75rem;
          font-weight: 600;
        }

        .label {
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .table-card {
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      table {
        width: 100%;
      }

      mat-chip {
        font-size: 0.75rem;

        &.pending { background: #fff3e0; color: #e65100; }
        &.confirmed { background: #e3f2fd; color: #1976d2; }
        &.in-progress { background: #e8f5e9; color: #388e3c; }
        &.completed { background: #e8f5e9; color: #2e7d32; }
      }
    }

    .alerts-card {
      .alert-item {
        display: flex;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 8px;
        margin-bottom: 0.5rem;

        &.warning {
          background: #fff3e0;
          mat-icon { color: #ff9800; }
        }

        &.error {
          background: #ffebee;
          mat-icon { color: #f44336; }
        }

        &.info {
          background: #e3f2fd;
          mat-icon { color: #2196f3; }
        }

        .alert-content {
          display: flex;
          flex-direction: column;

          .alert-message {
            font-weight: 500;
          }

          .alert-time {
            font-size: 0.875rem;
            color: rgba(0, 0, 0, 0.5);
          }
        }
      }
    }

    .activity-card {
      .activity-chart {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        height: 200px;
        padding: 1rem 0;
      }

      .day-bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;

        .bar {
          width: 40px;
          background: linear-gradient(to top, #4caf50, #81c784);
          border-radius: 4px 4px 0 0;
          min-height: 10px;
          transition: height 0.3s;
        }

        .day-label {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: rgba(0, 0, 0, 0.6);
        }

        .day-value {
          font-weight: 600;
          margin-top: 0.25rem;
        }
      }
    }

    @media (max-width: 900px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent {
  kpis = signal({
    collectionsToday: 24,
    devicesThisMonth: 487,
    newUsers: 156,
    revenueThisMonth: 45320
  });

  recentCollections = signal([
    { id: 'abc12345def', client: 'Jean Dupont', date: new Date(), status: 'PENDING', statusClass: 'pending', statusLabel: 'En attente' },
    { id: 'xyz98765uvw', client: 'Marie Martin', date: new Date(), status: 'CONFIRMED', statusClass: 'confirmed', statusLabel: 'Confirmée' },
    { id: 'mno45678pqr', client: 'Pierre Durand', date: new Date(), status: 'IN_PROGRESS', statusClass: 'in-progress', statusLabel: 'En cours' },
    { id: 'ghi12345jkl', client: 'Sophie Leroy', date: new Date(), status: 'COMPLETED', statusClass: 'completed', statusLabel: 'Terminée' }
  ]);

  alerts = signal([
    { id: '1', type: 'warning', message: '5 collectes en attente de validation', time: 'Il y a 10 min' },
    { id: '2', type: 'error', message: 'Échec de paiement - Client #4521', time: 'Il y a 30 min' },
    { id: '3', type: 'info', message: 'Nouveau point de dépôt ajouté', time: 'Il y a 1h' }
  ]);

  weekActivity = signal([
    { date: new Date(), label: 'Lun', value: 45 },
    { date: new Date(), label: 'Mar', value: 62 },
    { date: new Date(), label: 'Mer', value: 38 },
    { date: new Date(), label: 'Jeu', value: 71 },
    { date: new Date(), label: 'Ven', value: 55 },
    { date: new Date(), label: 'Sam', value: 28 },
    { date: new Date(), label: 'Dim', value: 15 }
  ]);

  maxActivity = signal(80);

  getAlertIcon(type: string): string {
    const icons: Record<string, string> = {
      warning: 'warning',
      error: 'error',
      info: 'info'
    };
    return icons[type] || 'info';
  }
}
