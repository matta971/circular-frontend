import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CollectionService } from '../../core/services/collection.service';
import { CollectionRequest, CollectionStatus } from '../../core/models';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="collection-detail-container">
      @if (loading()) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (collection()) {
        <div class="header">
          <button mat-icon-button routerLink="/collection">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Collecte #{{ collection()!.id }}</h1>
          <mat-chip [class]="getStatusClass(collection()!.status)">
            {{ getStatusLabel(collection()!.status) }}
          </mat-chip>
        </div>

        <div class="content-grid">
          <mat-card class="info-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>event</mat-icon>
              <mat-card-title>Date et horaire</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="primary-info">{{ collection()!.plannedDate | date:'fullDate' }}</p>
              <p class="secondary-info">Créneau : {{ collection()!.plannedTimeStart }} - {{ collection()!.plannedTimeEnd }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="info-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>place</mat-icon>
              <mat-card-title>Adresse de collecte</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="primary-info">{{ collection()!.address?.line1 }}</p>
              @if (collection()!.address?.line2) {
                <p class="secondary-info">{{ collection()!.address?.line2 }}</p>
              }
              <p class="secondary-info">{{ collection()!.address?.postalCode }} {{ collection()!.address?.city }}</p>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="devices-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>devices</mat-icon>
            <mat-card-title>Appareils ({{ collection()!.items?.length || 0 }})</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (collection()!.items && collection()!.items!.length > 0) {
              <div class="devices-list">
                @for (item of collection()!.items; track item.id) {
                  <div class="device-item">
                    <mat-icon>{{ getDeviceTypeIcon(item.deviceType) }}</mat-icon>
                    <div class="device-info">
                      <span class="device-name">{{ item.brand }} {{ item.model }}</span>
                      <span class="device-condition">{{ item.condition }}</span>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="no-devices">Aucun appareil enregistré</p>
            }
          </mat-card-content>
        </mat-card>

        @if (collection()!.notes) {
          <mat-card class="notes-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>notes</mat-icon>
              <mat-card-title>Instructions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ collection()!.notes }}</p>
            </mat-card-content>
          </mat-card>
        }

        <div class="timeline">
          <h2>Suivi de la collecte</h2>
          <div class="timeline-items">
            <div class="timeline-item" [class.active]="true">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">Demande créée</span>
                <span class="timeline-date">{{ collection()!.requestedAt | date:'short' }}</span>
              </div>
            </div>
            <div class="timeline-item" [class.active]="isStatusReached(CollectionStatus.PLANNED)">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">Collecte planifiée</span>
              </div>
            </div>
            <div class="timeline-item" [class.active]="isStatusReached(CollectionStatus.IN_PROGRESS)">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">Chauffeur en route</span>
              </div>
            </div>
            <div class="timeline-item" [class.active]="isStatusReached(CollectionStatus.COMPLETED)">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">Collecte effectuée</span>
              </div>
            </div>
          </div>
        </div>

        @if (collection()!.status === CollectionStatus.REQUESTED) {
          <div class="actions">
            <button mat-raised-button color="warn" (click)="cancelCollection()">
              <mat-icon>cancel</mat-icon>
              Annuler la collecte
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .collection-detail-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;

      h1 {
        flex: 1;
        margin: 0;
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .info-card, .devices-card, .notes-card {
      mat-icon[mat-card-avatar] {
        background: #e3f2fd;
        color: #1976d2;
        padding: 8px;
        border-radius: 50%;
      }

      .primary-info {
        font-size: 1.1rem;
        font-weight: 500;
        margin: 0.5rem 0 0.25rem;
      }

      .secondary-info {
        color: rgba(0, 0, 0, 0.6);
        margin: 0.25rem 0;
      }
    }

    .devices-card {
      margin-bottom: 1rem;
    }

    .devices-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .device-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: #fafafa;
      border-radius: 8px;

      mat-icon {
        color: #1976d2;
      }

      .device-info {
        display: flex;
        flex-direction: column;

        .device-name {
          font-weight: 500;
        }

        .device-condition {
          font-size: 0.875rem;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .no-devices {
      color: rgba(0, 0, 0, 0.5);
      text-align: center;
      padding: 1rem;
    }

    .notes-card {
      margin-bottom: 1.5rem;
    }

    .timeline {
      margin: 2rem 0;

      h2 {
        margin-bottom: 1.5rem;
      }
    }

    .timeline-items {
      position: relative;
      padding-left: 2rem;

      &::before {
        content: '';
        position: absolute;
        left: 7px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #e0e0e0;
      }
    }

    .timeline-item {
      position: relative;
      padding-bottom: 1.5rem;

      &:last-child {
        padding-bottom: 0;
      }

      .timeline-dot {
        position: absolute;
        left: -2rem;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #e0e0e0;
        top: 2px;
      }

      &.active .timeline-dot {
        background: #4caf50;
      }

      .timeline-content {
        display: flex;
        flex-direction: column;

        .timeline-title {
          font-weight: 500;
        }

        .timeline-date {
          font-size: 0.875rem;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .actions {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
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
export class CollectionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private collectionService = inject(CollectionService);

  CollectionStatus = CollectionStatus;

  collection = signal<CollectionRequest | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCollection(Number(id));
    }
  }

  loadCollection(id: number): void {
    this.collectionService.getCollection(id).subscribe({
      next: (data) => {
        this.collection.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getDeviceTypeIcon(deviceType: string): string {
    const icons: Record<string, string> = {
      SMARTPHONE: 'smartphone',
      LAPTOP: 'laptop',
      TABLET: 'tablet',
      DESKTOP: 'desktop_windows',
      TV: 'tv',
      CONSOLE: 'videogame_asset',
      PERIPHERAL: 'keyboard',
      OTHER: 'devices_other'
    };
    return icons[deviceType] || 'devices';
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

  isStatusReached(status: CollectionStatus): boolean {
    const order = [
      CollectionStatus.REQUESTED,
      CollectionStatus.PLANNED,
      CollectionStatus.IN_PROGRESS,
      CollectionStatus.COMPLETED
    ];
    const currentIndex = order.indexOf(this.collection()?.status || CollectionStatus.REQUESTED);
    const targetIndex = order.indexOf(status);
    return currentIndex >= targetIndex;
  }

  cancelCollection(): void {
    const id = this.collection()?.id;
    if (!id) return;

    this.collectionService.cancelCollection(id).subscribe({
      next: () => {
        this.loadCollection(id);
      }
    });
  }
}
