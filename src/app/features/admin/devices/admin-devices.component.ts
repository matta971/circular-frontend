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

interface DeviceRow {
  id: string;
  category: string;
  categoryIcon: string;
  brand: string;
  model: string;
  condition: string;
  conditionClass: string;
  estimatedValue: number;
  finalValue?: number;
  status: string;
  statusClass: string;
  statusLabel: string;
  collectionId: string;
  receivedDate?: Date;
}

@Component({
  selector: 'app-admin-devices',
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
    <div class="devices-admin">
      <div class="header">
        <h1>Gestion des appareils</h1>
      </div>

      <!-- Stats rapides -->
      <div class="stats-row">
        <mat-card class="stat-mini">
          <span class="value">{{ stats().total }}</span>
          <span class="label">Total</span>
        </mat-card>
        <mat-card class="stat-mini pending">
          <span class="value">{{ stats().pending }}</span>
          <span class="label">En attente</span>
        </mat-card>
        <mat-card class="stat-mini processing">
          <span class="value">{{ stats().processing }}</span>
          <span class="label">En traitement</span>
        </mat-card>
        <mat-card class="stat-mini evaluated">
          <span class="value">{{ stats().evaluated }}</span>
          <span class="label">Évalués</span>
        </mat-card>
        <mat-card class="stat-mini recycled">
          <span class="value">{{ stats().recycled }}</span>
          <span class="label">Recyclés</span>
        </mat-card>
      </div>

      <mat-card class="filters-card">
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Rechercher</mat-label>
            <input matInput [(ngModel)]="searchTerm" placeholder="Marque, modèle...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Catégorie</mat-label>
            <mat-select [(ngModel)]="categoryFilter">
              <mat-option value="">Toutes</mat-option>
              <mat-option value="SMARTPHONE">Smartphone</mat-option>
              <mat-option value="LAPTOP">Ordinateur portable</mat-option>
              <mat-option value="TABLET">Tablette</mat-option>
              <mat-option value="DESKTOP">PC Bureau</mat-option>
              <mat-option value="TV">Télévision</mat-option>
              <mat-option value="OTHER">Autre</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select [(ngModel)]="statusFilter">
              <mat-option value="">Tous</mat-option>
              <mat-option value="PENDING">En attente</mat-option>
              <mat-option value="PROCESSING">En traitement</mat-option>
              <mat-option value="EVALUATED">Évalué</mat-option>
              <mat-option value="RECYCLED">Recyclé</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="devices()" matSort>
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let d">#{{ d.id.slice(0, 8) }}</td>
          </ng-container>

          <ng-container matColumnDef="device">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Appareil</th>
            <td mat-cell *matCellDef="let d">
              <div class="device-cell">
                <mat-icon>{{ d.categoryIcon }}</mat-icon>
                <div class="device-info">
                  <span class="brand-model">{{ d.brand }} {{ d.model }}</span>
                  <span class="category">{{ d.category }}</span>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="condition">
            <th mat-header-cell *matHeaderCellDef>État</th>
            <td mat-cell *matCellDef="let d">
              <mat-chip [class]="d.conditionClass">{{ d.condition }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="estimatedValue">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Estimation</th>
            <td mat-cell *matCellDef="let d">{{ d.estimatedValue | currency:'EUR' }}</td>
          </ng-container>

          <ng-container matColumnDef="finalValue">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Valeur finale</th>
            <td mat-cell *matCellDef="let d">
              {{ d.finalValue ? (d.finalValue | currency:'EUR') : '-' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
            <td mat-cell *matCellDef="let d">
              <mat-chip [class]="d.statusClass">{{ d.statusLabel }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="collection">
            <th mat-header-cell *matHeaderCellDef>Collecte</th>
            <td mat-cell *matCellDef="let d">#{{ d.collectionId.slice(0, 8) }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let d">
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="viewDetails(d)">
                  <mat-icon>visibility</mat-icon>
                  <span>Voir détails</span>
                </button>
                @if (d.status === 'PROCESSING') {
                  <button mat-menu-item (click)="evaluateDevice(d)">
                    <mat-icon>assessment</mat-icon>
                    <span>Évaluer</span>
                  </button>
                }
                @if (d.status === 'EVALUATED') {
                  <button mat-menu-item (click)="markAsRecycled(d)">
                    <mat-icon>recycling</mat-icon>
                    <span>Marquer recyclé</span>
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
    .devices-admin {
      .header {
        margin-bottom: 1.5rem;

        h1 {
          margin: 0;
        }
      }
    }

    .stats-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;

      .stat-mini {
        flex: 1;
        min-width: 100px;
        padding: 1rem;
        text-align: center;

        .value {
          display: block;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .label {
          font-size: 0.875rem;
          color: rgba(0, 0, 0, 0.6);
        }

        &.pending { border-left: 4px solid #ff9800; }
        &.processing { border-left: 4px solid #2196f3; }
        &.evaluated { border-left: 4px solid #9c27b0; }
        &.recycled { border-left: 4px solid #4caf50; }
      }
    }

    .filters-card {
      margin-bottom: 1.5rem;
      padding: 1rem;

      .filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;

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

      .device-cell {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        mat-icon {
          color: #1976d2;
        }

        .device-info {
          display: flex;
          flex-direction: column;

          .brand-model {
            font-weight: 500;
          }

          .category {
            font-size: 0.875rem;
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }

      mat-chip {
        font-size: 0.75rem;

        &.excellent { background: #e8f5e9; color: #2e7d32; }
        &.good { background: #f1f8e9; color: #558b2f; }
        &.fair { background: #fff3e0; color: #e65100; }
        &.poor { background: #ffebee; color: #c62828; }

        &.pending { background: #fff3e0; color: #e65100; }
        &.processing { background: #e3f2fd; color: #1976d2; }
        &.evaluated { background: #f3e5f5; color: #7b1fa2; }
        &.recycled { background: #e8f5e9; color: #2e7d32; }
      }
    }
  `]
})
export class AdminDevicesComponent {
  displayedColumns = ['id', 'device', 'condition', 'estimatedValue', 'finalValue', 'status', 'collection', 'actions'];

  searchTerm = '';
  categoryFilter = '';
  statusFilter = '';

  stats = signal({
    total: 487,
    pending: 45,
    processing: 32,
    evaluated: 78,
    recycled: 332
  });

  devices = signal<DeviceRow[]>([
    {
      id: 'dev123456789',
      category: 'Smartphone',
      categoryIcon: 'smartphone',
      brand: 'Apple',
      model: 'iPhone 12 Pro',
      condition: 'Excellent',
      conditionClass: 'excellent',
      estimatedValue: 320,
      finalValue: 350,
      status: 'RECYCLED',
      statusClass: 'recycled',
      statusLabel: 'Recyclé',
      collectionId: 'col123456789',
      receivedDate: new Date()
    },
    {
      id: 'dev234567890',
      category: 'Ordinateur portable',
      categoryIcon: 'laptop',
      brand: 'Dell',
      model: 'XPS 15 9510',
      condition: 'Bon',
      conditionClass: 'good',
      estimatedValue: 450,
      status: 'PROCESSING',
      statusClass: 'processing',
      statusLabel: 'En traitement',
      collectionId: 'col234567890'
    },
    {
      id: 'dev345678901',
      category: 'Tablette',
      categoryIcon: 'tablet',
      brand: 'Samsung',
      model: 'Galaxy Tab S7',
      condition: 'Correct',
      conditionClass: 'fair',
      estimatedValue: 180,
      finalValue: 165,
      status: 'EVALUATED',
      statusClass: 'evaluated',
      statusLabel: 'Évalué',
      collectionId: 'col345678901'
    },
    {
      id: 'dev456789012',
      category: 'Smartphone',
      categoryIcon: 'smartphone',
      brand: 'Google',
      model: 'Pixel 6',
      condition: 'Mauvais',
      conditionClass: 'poor',
      estimatedValue: 80,
      status: 'PENDING',
      statusClass: 'pending',
      statusLabel: 'En attente',
      collectionId: 'col456789012'
    }
  ]);

  viewDetails(device: DeviceRow): void {
    alert(`Détails de l'appareil ${device.id}`);
  }

  evaluateDevice(device: DeviceRow): void {
    alert(`Évaluer l'appareil ${device.id}`);
  }

  markAsRecycled(device: DeviceRow): void {
    alert(`Marquer l'appareil ${device.id} comme recyclé`);
  }
}
