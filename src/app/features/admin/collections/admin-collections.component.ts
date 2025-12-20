import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

interface CollectionRow {
  id: string;
  clientName: string;
  clientEmail: string;
  address: string;
  scheduledDate: Date;
  timeSlot: string;
  devicesCount: number;
  status: string;
  statusClass: string;
  statusLabel: string;
  driverName?: string;
}

@Component({
  selector: 'app-admin-collections',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule
  ],
  template: `
    <div class="collections-admin">
      <div class="header">
        <h1>Gestion des collectes</h1>
      </div>

      <mat-card class="filters-card">
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Rechercher</mat-label>
            <input matInput [(ngModel)]="searchTerm" placeholder="Client, ID...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select [(ngModel)]="statusFilter">
              <mat-option value="">Tous</mat-option>
              <mat-option value="PENDING">En attente</mat-option>
              <mat-option value="CONFIRMED">Confirmées</mat-option>
              <mat-option value="IN_PROGRESS">En cours</mat-option>
              <mat-option value="COMPLETED">Terminées</mat-option>
              <mat-option value="CANCELLED">Annulées</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date</mat-label>
            <mat-select [(ngModel)]="dateFilter">
              <mat-option value="">Toutes</mat-option>
              <mat-option value="today">Aujourd'hui</mat-option>
              <mat-option value="tomorrow">Demain</mat-option>
              <mat-option value="week">Cette semaine</mat-option>
              <mat-option value="month">Ce mois</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="resetFilters()">
            <mat-icon>clear</mat-icon>
            Réinitialiser
          </button>
        </div>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="collections()" matSort>
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let c">#{{ c.id.slice(0, 8) }}</td>
          </ng-container>

          <ng-container matColumnDef="client">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Client</th>
            <td mat-cell *matCellDef="let c">
              <div class="client-cell">
                <span class="name">{{ c.clientName }}</span>
                <span class="email">{{ c.clientEmail }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="address">
            <th mat-header-cell *matHeaderCellDef>Adresse</th>
            <td mat-cell *matCellDef="let c">{{ c.address }}</td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
            <td mat-cell *matCellDef="let c">
              <div class="date-cell">
                <span>{{ c.scheduledDate | date:'shortDate' }}</span>
                <span class="time">{{ c.timeSlot }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="devices">
            <th mat-header-cell *matHeaderCellDef>Appareils</th>
            <td mat-cell *matCellDef="let c">{{ c.devicesCount }}</td>
          </ng-container>

          <ng-container matColumnDef="driver">
            <th mat-header-cell *matHeaderCellDef>Chauffeur</th>
            <td mat-cell *matCellDef="let c">{{ c.driverName || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
            <td mat-cell *matCellDef="let c">
              <mat-chip [class]="c.statusClass">{{ c.statusLabel }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let c">
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="viewDetails(c)">
                  <mat-icon>visibility</mat-icon>
                  <span>Voir détails</span>
                </button>
                @if (c.status === 'PENDING') {
                  <button mat-menu-item (click)="confirmCollection(c)">
                    <mat-icon>check</mat-icon>
                    <span>Confirmer</span>
                  </button>
                  <button mat-menu-item (click)="assignDriver(c)">
                    <mat-icon>person_add</mat-icon>
                    <span>Assigner chauffeur</span>
                  </button>
                }
                @if (c.status !== 'COMPLETED' && c.status !== 'CANCELLED') {
                  <button mat-menu-item (click)="cancelCollection(c)" class="danger">
                    <mat-icon>cancel</mat-icon>
                    <span>Annuler</span>
                  </button>
                }
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .collections-admin {
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        h1 {
          margin: 0;
        }
      }
    }

    .filters-card {
      margin-bottom: 1.5rem;
      padding: 1rem;

      .filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;

        mat-form-field {
          flex: 1;
          min-width: 150px;
        }
      }
    }

    .table-card {
      table {
        width: 100%;
      }

      .client-cell {
        display: flex;
        flex-direction: column;

        .name {
          font-weight: 500;
        }

        .email {
          font-size: 0.875rem;
          color: rgba(0, 0, 0, 0.6);
        }
      }

      .date-cell {
        display: flex;
        flex-direction: column;

        .time {
          font-size: 0.875rem;
          color: rgba(0, 0, 0, 0.6);
        }
      }

      mat-chip {
        font-size: 0.75rem;

        &.pending { background: #fff3e0; color: #e65100; }
        &.confirmed { background: #e3f2fd; color: #1976d2; }
        &.in-progress { background: #e8f5e9; color: #388e3c; }
        &.completed { background: #e8f5e9; color: #2e7d32; }
        &.cancelled { background: #ffebee; color: #c62828; }
      }

      .danger {
        color: #f44336;
      }
    }
  `]
})
export class AdminCollectionsComponent {
  displayedColumns = ['id', 'client', 'address', 'date', 'devices', 'driver', 'status', 'actions'];

  searchTerm = '';
  statusFilter = '';
  dateFilter = '';

  collections = signal<CollectionRow[]>([
    {
      id: 'abc12345defgh',
      clientName: 'Jean Dupont',
      clientEmail: 'jean.dupont@email.com',
      address: '15 rue de Paris, 75001 Paris',
      scheduledDate: new Date(),
      timeSlot: '14h-18h',
      devicesCount: 3,
      status: 'PENDING',
      statusClass: 'pending',
      statusLabel: 'En attente'
    },
    {
      id: 'xyz98765uvwxy',
      clientName: 'Marie Martin',
      clientEmail: 'marie.martin@email.com',
      address: '8 avenue des Champs, 75008 Paris',
      scheduledDate: new Date(),
      timeSlot: '08h-12h',
      devicesCount: 1,
      status: 'CONFIRMED',
      statusClass: 'confirmed',
      statusLabel: 'Confirmée',
      driverName: 'Pierre L.'
    },
    {
      id: 'mno45678pqrst',
      clientName: 'Pierre Durand',
      clientEmail: 'p.durand@email.com',
      address: '42 boulevard Haussmann, 75009 Paris',
      scheduledDate: new Date(),
      timeSlot: '12h-14h',
      devicesCount: 5,
      status: 'IN_PROGRESS',
      statusClass: 'in-progress',
      statusLabel: 'En cours',
      driverName: 'Marc D.'
    },
    {
      id: 'ghi12345jklmn',
      clientName: 'Sophie Leroy',
      clientEmail: 'sophie.leroy@email.com',
      address: '3 rue de Lyon, 75012 Paris',
      scheduledDate: new Date(Date.now() - 86400000),
      timeSlot: '14h-18h',
      devicesCount: 2,
      status: 'COMPLETED',
      statusClass: 'completed',
      statusLabel: 'Terminée',
      driverName: 'Pierre L.'
    }
  ]);

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.dateFilter = '';
  }

  viewDetails(collection: CollectionRow): void {
    alert(`Détails de la collecte ${collection.id}`);
  }

  confirmCollection(collection: CollectionRow): void {
    alert(`Confirmer la collecte ${collection.id}`);
  }

  assignDriver(collection: CollectionRow): void {
    alert(`Assigner un chauffeur à la collecte ${collection.id}`);
  }

  cancelCollection(collection: CollectionRow): void {
    alert(`Annuler la collecte ${collection.id}`);
  }
}
