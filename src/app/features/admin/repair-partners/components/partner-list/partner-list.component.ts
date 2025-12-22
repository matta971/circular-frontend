import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { RepairPartnerAdminService, RepairPartner } from '../../services/repair-partner-admin.service';

@Component({
  selector: 'app-partner-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDividerModule
  ],
  template: `
    <div class="partner-list">
      <div class="page-header">
        <h1>Partenaires Réparateurs</h1>
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon>
          Nouveau partenaire
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-cards">
        <mat-card class="stat-card">
          <mat-icon>store</mat-icon>
          <div class="stat-content">
            <span class="stat-value">{{ stats().total }}</span>
            <span class="stat-label">Total</span>
          </div>
        </mat-card>
        <mat-card class="stat-card active">
          <mat-icon>check_circle</mat-icon>
          <div class="stat-content">
            <span class="stat-value">{{ stats().active }}</span>
            <span class="stat-label">Actifs</span>
          </div>
        </mat-card>
        <mat-card class="stat-card pending">
          <mat-icon>pending</mat-icon>
          <div class="stat-content">
            <span class="stat-value">{{ stats().pending }}</span>
            <span class="stat-label">En attente</span>
          </div>
        </mat-card>
        <mat-card class="stat-card qualirepar">
          <mat-icon>verified</mat-icon>
          <div class="stat-content">
            <span class="stat-value">{{ stats().withQualiRepar }}</span>
            <span class="stat-label">QualiRépar</span>
          </div>
        </mat-card>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Rechercher</mat-label>
            <input matInput [(ngModel)]="searchQuery" (keyup.enter)="applyFilters()" placeholder="Nom, ville, SIRET...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
              <mat-option value="">Tous</mat-option>
              <mat-option value="ACTIVE">Actif</mat-option>
              <mat-option value="PENDING">En attente</mat-option>
              <mat-option value="INACTIVE">Inactif</mat-option>
              <mat-option value="SUSPENDED">Suspendu</mat-option>
              <mat-option value="EXPIRED">Expiré</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select [(ngModel)]="typeFilter" (selectionChange)="applyFilters()">
              <mat-option value="">Tous</mat-option>
              <mat-option value="AUTHORIZED">Agréé constructeur</mat-option>
              <mat-option value="INDEPENDENT">Indépendant</mat-option>
              <mat-option value="FRANCHISE">Franchise</mat-option>
              <mat-option value="REPAIR_CAFE">Repair Café</mat-option>
              <mat-option value="RESSOURCERIE">Ressourcerie</mat-option>
              <mat-option value="ESS">ESS</mat-option>
              <mat-option value="SELF_REPAIR">Auto-réparation</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-slide-toggle [(ngModel)]="qualiReparOnly" (change)="applyFilters()">
            QualiRépar uniquement
          </mat-slide-toggle>
        </div>
      </mat-card>

      <!-- Table -->
      <mat-card class="table-card">
        @if (loading()) {
          <div class="loading">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else {
          <table mat-table [dataSource]="dataSource" matSort>
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Partenaire</th>
              <td mat-cell *matCellDef="let partner">
                <div class="partner-info">
                  <span class="partner-name">{{ partner.name }}</span>
                  <span class="partner-city">{{ partner.city }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Type Column -->
            <ng-container matColumnDef="partnerType">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
              <td mat-cell *matCellDef="let partner">
                <mat-chip [class]="'type-' + partner.partnerType.toLowerCase()">
                  {{ getTypeLabel(partner.partnerType) }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
              <td mat-cell *matCellDef="let partner">
                <mat-chip [class]="'status-' + partner.status.toLowerCase()">
                  {{ getStatusLabel(partner.status) }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Labels Column -->
            <ng-container matColumnDef="labels">
              <th mat-header-cell *matHeaderCellDef>Labels</th>
              <td mat-cell *matCellDef="let partner">
                <div class="labels">
                  @if (partner.hasQualiReparLabel) {
                    <mat-icon matTooltip="QualiRépar" class="label-icon qualirepar">verified</mat-icon>
                  }
                  @if (partner.isEss) {
                    <mat-icon matTooltip="ESS" class="label-icon ess">eco</mat-icon>
                  }
                  @if (partner.acceptsBonusReparation) {
                    <mat-icon matTooltip="Bonus Réparation" class="label-icon bonus">savings</mat-icon>
                  }
                </div>
              </td>
            </ng-container>

            <!-- Rating Column -->
            <ng-container matColumnDef="rating">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Note</th>
              <td mat-cell *matCellDef="let partner">
                <div class="rating">
                  <mat-icon class="star">star</mat-icon>
                  <span>{{ partner.rating?.toFixed(1) || '-' }}</span>
                  <span class="review-count">({{ partner.reviewCount || 0 }})</span>
                </div>
              </td>
            </ng-container>

            <!-- Repairs Column -->
            <ng-container matColumnDef="repairs">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Réparations</th>
              <td mat-cell *matCellDef="let partner">
                <span>{{ partner.totalRepairs || 0 }}</span>
                <span class="this-month">({{ partner.repairsThisMonth || 0 }} ce mois)</span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let partner">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <a mat-menu-item [routerLink]="[partner.id]">
                    <mat-icon>visibility</mat-icon>
                    <span>Voir</span>
                  </a>
                  <a mat-menu-item [routerLink]="[partner.id, 'edit']">
                    <mat-icon>edit</mat-icon>
                    <span>Modifier</span>
                  </a>
                  <mat-divider></mat-divider>
                  @if (partner.status === 'PENDING') {
                    <button mat-menu-item (click)="updateStatus(partner, 'ACTIVE')">
                      <mat-icon>check_circle</mat-icon>
                      <span>Activer</span>
                    </button>
                  }
                  @if (partner.status === 'ACTIVE') {
                    <button mat-menu-item (click)="updateStatus(partner, 'SUSPENDED')">
                      <mat-icon>pause_circle</mat-icon>
                      <span>Suspendre</span>
                    </button>
                  }
                  @if (partner.status === 'SUSPENDED' || partner.status === 'INACTIVE') {
                    <button mat-menu-item (click)="updateStatus(partner, 'ACTIVE')">
                      <mat-icon>play_circle</mat-icon>
                      <span>Réactiver</span>
                    </button>
                  }
                  <mat-divider></mat-divider>
                  <button mat-menu-item class="delete-action" (click)="confirmDelete(partner)">
                    <mat-icon>delete</mat-icon>
                    <span>Supprimer</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator
            [length]="totalElements()"
            [pageSize]="pageSize"
            [pageSizeOptions]="[10, 25, 50, 100]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .partner-list {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;

      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        color: #666;
      }

      &.active mat-icon { color: #4caf50; }
      &.pending mat-icon { color: #ff9800; }
      &.qualirepar mat-icon { color: #2196f3; }

      .stat-content {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #666;
        }
      }
    }

    .filters-card {
      margin-bottom: 1.5rem;
      padding: 1rem;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;

      mat-form-field {
        flex: 1;
        min-width: 200px;
      }
    }

    .table-card {
      overflow: hidden;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }

    table {
      width: 100%;
    }

    .partner-info {
      display: flex;
      flex-direction: column;

      .partner-name {
        font-weight: 500;
      }

      .partner-city {
        font-size: 0.875rem;
        color: #666;
      }
    }

    .labels {
      display: flex;
      gap: 0.5rem;

      .label-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;

        &.qualirepar { color: #2196f3; }
        &.ess { color: #4caf50; }
        &.bonus { color: #ff9800; }
      }
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      .star {
        color: #ffc107;
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }

      .review-count {
        font-size: 0.75rem;
        color: #666;
      }
    }

    .this-month {
      font-size: 0.75rem;
      color: #666;
      margin-left: 0.25rem;
    }

    mat-chip {
      &.status-active { background: #e8f5e9; color: #2e7d32; }
      &.status-pending { background: #fff3e0; color: #f57c00; }
      &.status-inactive { background: #eeeeee; color: #616161; }
      &.status-suspended { background: #ffebee; color: #c62828; }
      &.status-expired { background: #fce4ec; color: #ad1457; }

      &.type-authorized { background: #e3f2fd; color: #1565c0; }
      &.type-independent { background: #f3e5f5; color: #7b1fa2; }
      &.type-franchise { background: #e8eaf6; color: #3949ab; }
      &.type-repair_cafe { background: #e8f5e9; color: #2e7d32; }
      &.type-ressourcerie { background: #fff8e1; color: #f9a825; }
      &.type-ess { background: #e0f2f1; color: #00695c; }
      &.type-self_repair { background: #fce4ec; color: #c2185b; }
    }

    .delete-action {
      color: #f44336;
    }
  `]
})
export class PartnerListComponent implements OnInit {
  private partnerService = inject(RepairPartnerAdminService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<RepairPartner>([]);
  displayedColumns = ['name', 'partnerType', 'status', 'labels', 'rating', 'repairs', 'actions'];

  loading = signal(true);
  totalElements = signal(0);
  pageSize = 25;

  searchQuery = '';
  statusFilter = '';
  typeFilter = '';
  qualiReparOnly = false;

  stats = signal({
    total: 0,
    active: 0,
    pending: 0,
    withQualiRepar: 0,
    withContracts: 0,
    byType: {} as { [key: string]: number },
    byCity: {} as { [key: string]: number }
  });

  ngOnInit() {
    this.loadData();
    this.loadStats();
  }

  loadData() {
    this.loading.set(true);
    this.partnerService.getAll({
      query: this.searchQuery || undefined,
      status: this.statusFilter || undefined,
      partnerType: this.typeFilter || undefined,
      hasQualiReparLabel: this.qualiReparOnly || undefined,
      page: 0,
      size: this.pageSize
    }).subscribe(result => {
      this.dataSource.data = result.data;
      this.totalElements.set(result.total);
      this.loading.set(false);
    });
  }

  loadStats() {
    this.partnerService.getStatistics().subscribe(stats => {
      this.stats.set(stats);
    });
  }

  applyFilters() {
    this.loadData();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.partnerService.getAll({
      query: this.searchQuery || undefined,
      status: this.statusFilter || undefined,
      partnerType: this.typeFilter || undefined,
      hasQualiReparLabel: this.qualiReparOnly || undefined,
      page: event.pageIndex,
      size: event.pageSize
    }).subscribe(result => {
      this.dataSource.data = result.data;
      this.totalElements.set(result.total);
    });
  }

  updateStatus(partner: RepairPartner, newStatus: string) {
    this.partnerService.updateStatus(partner.id, newStatus).subscribe(updated => {
      if (updated) {
        this.loadData();
        this.loadStats();
      }
    });
  }

  confirmDelete(partner: RepairPartner) {
    if (confirm(`Supprimer le partenaire "${partner.name}" ?`)) {
      this.partnerService.delete(partner.id).subscribe(success => {
        if (success) {
          this.loadData();
          this.loadStats();
        }
      });
    }
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'AUTHORIZED': 'Agréé',
      'INDEPENDENT': 'Indépendant',
      'FRANCHISE': 'Franchise',
      'REPAIR_CAFE': 'Repair Café',
      'RESSOURCERIE': 'Ressourcerie',
      'ESS': 'ESS',
      'SELF_REPAIR': 'Auto-réparation'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ACTIVE': 'Actif',
      'PENDING': 'En attente',
      'INACTIVE': 'Inactif',
      'SUSPENDED': 'Suspendu',
      'EXPIRED': 'Expiré',
      'REJECTED': 'Refusé'
    };
    return labels[status] || status;
  }
}
