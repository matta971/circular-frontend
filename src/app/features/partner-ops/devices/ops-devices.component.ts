import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PartnerOpsService } from '../services/partner-ops.service';
import { OpsDevice } from '../models/partner-ops.model';

@Component({
  selector: 'app-ops-devices',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule
  ],
  template: `
    <div class="devices-container">
      <h1>Appareils</h1>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select [formControl]="statusFilter" multiple>
              <mat-option value="RECEIVED">Reçu</mat-option>
              <mat-option value="DIAGNOSED">Diagnostiqué</mat-option>
              <mat-option value="FINALIZED">Finalisé</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="loadDevices()">
            <mat-icon>search</mat-icon>
            Filtrer
          </button>
        </mat-card-content>
      </mat-card>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (devices().length === 0) {
        <mat-card class="empty-state">
          <mat-card-content>
            <mat-icon>devices</mat-icon>
            <h3>Aucun appareil</h3>
            <p>Aucun appareil ne correspond aux critères de recherche.</p>
          </mat-card-content>
        </mat-card>
      } @else {
        <table mat-table [dataSource]="devices()" class="mat-elevation-z2">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let d">#{{ d.id }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let d">{{ d.type }}</td>
          </ng-container>

          <ng-container matColumnDef="brand">
            <th mat-header-cell *matHeaderCellDef>Marque / Modèle</th>
            <td mat-cell *matCellDef="let d">{{ d.brand }} {{ d.model }}</td>
          </ng-container>

          <ng-container matColumnDef="condition">
            <th mat-header-cell *matHeaderCellDef>État</th>
            <td mat-cell *matCellDef="let d">
              <mat-chip>{{ d.condition || 'N/A' }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let d">
              <mat-chip [color]="getStatusColor(d.status)" [highlighted]="true">
                {{ getStatusLabel(d.status) }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="receivedAt">
            <th mat-header-cell *matHeaderCellDef>Reçu le</th>
            <td mat-cell *matCellDef="let d">{{ d.receivedAt | date:'dd/MM/yyyy HH:mm' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let d">
              <button mat-icon-button color="primary" [routerLink]="['/ops/devices', d.id]">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="clickable-row"
              [routerLink]="['/ops/devices', row.id]"></tr>
        </table>

        <mat-paginator
          [length]="totalElements()"
          [pageSize]="pageSize"
          [pageIndex]="currentPage()"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="onPageChange($event)">
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .devices-container {
      max-width: 1200px;
      margin: 0 auto;

      h1 {
        margin-bottom: 1.5rem;
        color: #1565c0;
      }
    }

    .filters-card {
      margin-bottom: 1.5rem;

      mat-card-content {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #78909c;
      }

      h3 {
        margin: 1rem 0 0.5rem;
        color: #37474f;
      }

      p {
        color: #78909c;
      }
    }

    table {
      width: 100%;
    }

    .clickable-row {
      cursor: pointer;

      &:hover {
        background: #f5f5f5;
      }
    }
  `]
})
export class OpsDevicesComponent implements OnInit {
  devices = signal<OpsDevice[]>([]);
  loading = signal(true);
  currentPage = signal(0);
  totalElements = signal(0);
  pageSize = 20;

  statusFilter = new FormControl<string[]>([]);
  displayedColumns = ['id', 'type', 'brand', 'condition', 'status', 'receivedAt', 'actions'];

  constructor(private opsService: PartnerOpsService) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.loading.set(true);
    const statuses = this.statusFilter.value || [];
    this.opsService.getDevices(this.currentPage(), this.pageSize, statuses).subscribe({
      next: (response) => {
        if (response.success) {
          this.devices.set(response.data.content);
          this.totalElements.set(response.data.totalElements);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize = event.pageSize;
    this.loadDevices();
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'RECEIVED': return 'accent';
      case 'DIAGNOSED': return 'primary';
      case 'FINALIZED': return 'primary';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'REGISTERED': return 'Enregistré';
      case 'COLLECTED': return 'Collecté';
      case 'DROPPED': return 'Déposé';
      case 'RECEIVED': return 'Reçu';
      case 'DIAGNOSED': return 'Diagnostiqué';
      case 'FINALIZED': return 'Finalisé';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  }
}
