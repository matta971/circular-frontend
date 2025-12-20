import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CollectionService } from '../../core/services/collection.service';
import { CollectionRequest, CollectionStatus } from '../../core/models';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="collection-container">
      <div class="header">
        <h1>Mes demandes de collecte</h1>
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon>
          Nouvelle collecte
        </button>
      </div>

      @if (loading()) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (collections().length === 0) {
        <mat-card class="empty-state">
          <mat-icon>local_shipping</mat-icon>
          <h2>Aucune collecte</h2>
          <p>Vous n'avez pas encore de demande de collecte</p>
          <button mat-raised-button color="primary" routerLink="new">
            Planifier une collecte
          </button>
        </mat-card>
      } @else {
        <div class="collection-list">
          @for (collection of collections(); track collection.id) {
            <mat-card class="collection-card" [routerLink]="[collection.id]">
              <mat-card-header>
                <mat-icon mat-card-avatar>local_shipping</mat-icon>
                <mat-card-title>Collecte #{{ collection.id }}</mat-card-title>
                <mat-card-subtitle>{{ collection.plannedDate | date:'fullDate' }}</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <div class="collection-info">
                  <div class="info-item">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ collection.plannedTimeStart }} - {{ collection.plannedTimeEnd }}</span>
                  </div>
                  <div class="info-item">
                    <mat-icon>place</mat-icon>
                    <span>{{ collection.address?.line1 }}, {{ collection.address?.city }}</span>
                  </div>
                  <div class="info-item">
                    <mat-icon>devices</mat-icon>
                    <span>{{ collection.items?.length || 0 }} appareil(s)</span>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <mat-chip [class]="getStatusClass(collection.status)">
                  {{ getStatusLabel(collection.status) }}
                </mat-chip>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .collection-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
      }
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #ccc;
      }

      h2 {
        margin: 1rem 0 0.5rem;
      }

      p {
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 1.5rem;
      }
    }

    .collection-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .collection-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      mat-card-header {
        mat-icon[mat-card-avatar] {
          background: #e3f2fd;
          color: #1976d2;
          padding: 8px;
          border-radius: 50%;
        }
      }

      .collection-info {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        margin-top: 1rem;

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
            color: rgba(0, 0, 0, 0.5);
          }
        }
      }
    }

    mat-chip {
      &.pending { background: #fff3e0; color: #e65100; }
      &.confirmed { background: #e3f2fd; color: #1976d2; }
      &.in-progress { background: #e8f5e9; color: #388e3c; }
      &.completed { background: #e8f5e9; color: #2e7d32; }
      &.cancelled { background: #ffebee; color: #c62828; }
    }
  `]
})
export class CollectionListComponent implements OnInit {
  private collectionService = inject(CollectionService);

  collections = signal<CollectionRequest[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.collectionService.getMyCollections().subscribe({
      next: (data) => {
        this.collections.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getStatusClass(status: CollectionStatus): string {
    const classes: Record<CollectionStatus, string> = {
      [CollectionStatus.REQUESTED]: 'pending',
      [CollectionStatus.PLANNED]: 'confirmed',
      [CollectionStatus.IN_PROGRESS]: 'in-progress',
      [CollectionStatus.COMPLETED]: 'completed',
      [CollectionStatus.CANCELLED]: 'cancelled'
    };
    return classes[status] || 'pending';
  }

  getStatusLabel(status: CollectionStatus): string {
    const labels: Record<CollectionStatus, string> = {
      [CollectionStatus.REQUESTED]: 'En attente',
      [CollectionStatus.PLANNED]: 'Planifiée',
      [CollectionStatus.IN_PROGRESS]: 'En cours',
      [CollectionStatus.COMPLETED]: 'Terminée',
      [CollectionStatus.CANCELLED]: 'Annulée'
    };
    return labels[status] || status;
  }
}
