import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

interface DepositPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  distance: number;
  openingHours: string;
  type: 'store' | 'partner' | 'recycling_center';
}

@Component({
  selector: 'app-deposit-points',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="deposit-container">
      <h1>Points de dépôt</h1>
      <p class="subtitle">Trouvez un point de dépôt proche de chez vous</p>

      <div class="search-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Entrez votre adresse ou code postal</mat-label>
          <input matInput [formControl]="searchControl" placeholder="75001 Paris">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="search()">
          Rechercher
        </button>
      </div>

      <div class="filter-chips">
        <mat-chip-listbox [value]="selectedType" (change)="onTypeChange($event)">
          <mat-chip-option value="all">Tous</mat-chip-option>
          <mat-chip-option value="store">Magasins</mat-chip-option>
          <mat-chip-option value="partner">Partenaires</mat-chip-option>
          <mat-chip-option value="recycling_center">Déchetteries</mat-chip-option>
        </mat-chip-listbox>
      </div>

      @if (loading()) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (filteredPoints().length === 0) {
        <mat-card class="empty-state">
          <mat-icon>place</mat-icon>
          <h2>Aucun point trouvé</h2>
          <p>Essayez une autre adresse ou élargissez votre recherche</p>
        </mat-card>
      } @else {
        <div class="points-grid">
          @for (point of filteredPoints(); track point.id) {
            <mat-card class="point-card">
              <mat-card-header>
                <mat-icon mat-card-avatar [class]="point.type">{{ getTypeIcon(point.type) }}</mat-icon>
                <mat-card-title>{{ point.name }}</mat-card-title>
                <mat-card-subtitle>{{ point.distance }} km</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <div class="point-info">
                  <div class="info-item">
                    <mat-icon>place</mat-icon>
                    <span>{{ point.address }}, {{ point.postalCode }} {{ point.city }}</span>
                  </div>
                  <div class="info-item">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ point.openingHours }}</span>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-button (click)="openInMaps(point)">
                  <mat-icon>map</mat-icon>
                  Itinéraire
                </button>
                <button mat-raised-button color="primary" routerLink="new" [queryParams]="{ point: point.id }">
                  <mat-icon>qr_code</mat-icon>
                  Générer QR
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .deposit-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      text-align: center;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 2rem;
    }

    .search-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;

      .search-field {
        flex: 1;
      }

      button {
        height: 56px;
      }
    }

    .filter-chips {
      margin-bottom: 2rem;
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
      }
    }

    .points-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .point-card {
      mat-icon[mat-card-avatar] {
        padding: 8px;
        border-radius: 50%;

        &.store { background: #e3f2fd; color: #1976d2; }
        &.partner { background: #e8f5e9; color: #388e3c; }
        &.recycling_center { background: #fff3e0; color: #e65100; }
      }

      .point-info {
        margin-top: 1rem;

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
            color: rgba(0, 0, 0, 0.5);
            flex-shrink: 0;
            margin-top: 2px;
          }

          span {
            font-size: 0.9rem;
          }
        }
      }

      mat-card-actions {
        display: flex;
        justify-content: space-between;
      }
    }
  `]
})
export class DepositPointsComponent implements OnInit {
  searchControl = new FormControl('');
  selectedType = 'all';

  points = signal<DepositPoint[]>([]);
  filteredPoints = signal<DepositPoint[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadMockPoints();
  }

  loadMockPoints(): void {
    // Données simulées
    const mockPoints: DepositPoint[] = [
      {
        id: '1',
        name: 'Fnac Châtelet',
        address: '1 rue Pierre Lescot',
        city: 'Paris',
        postalCode: '75001',
        distance: 0.5,
        openingHours: 'Lun-Sam: 10h-20h',
        type: 'store'
      },
      {
        id: '2',
        name: 'Darty Beaubourg',
        address: '15 rue du Temple',
        city: 'Paris',
        postalCode: '75004',
        distance: 1.2,
        openingHours: 'Lun-Sam: 9h30-19h30',
        type: 'store'
      },
      {
        id: '3',
        name: 'Eco-systèmes Paris Centre',
        address: '50 rue de Rivoli',
        city: 'Paris',
        postalCode: '75004',
        distance: 1.8,
        openingHours: 'Lun-Ven: 8h-18h',
        type: 'partner'
      },
      {
        id: '4',
        name: 'Déchetterie Ivry',
        address: '25 rue Bruneseau',
        city: 'Ivry-sur-Seine',
        postalCode: '94200',
        distance: 5.2,
        openingHours: 'Mar-Sam: 8h-17h',
        type: 'recycling_center'
      }
    ];

    this.points.set(mockPoints);
    this.filteredPoints.set(mockPoints);
  }

  search(): void {
    this.loading.set(true);
    // Simulation d'une recherche
    setTimeout(() => {
      this.filterPoints();
      this.loading.set(false);
    }, 500);
  }

  onTypeChange(event: any): void {
    this.selectedType = event.value;
    this.filterPoints();
  }

  filterPoints(): void {
    const type = this.selectedType;
    if (type === 'all') {
      this.filteredPoints.set(this.points());
    } else {
      this.filteredPoints.set(this.points().filter(p => p.type === type));
    }
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      store: 'store',
      partner: 'handshake',
      recycling_center: 'recycling'
    };
    return icons[type] || 'place';
  }

  openInMaps(point: DepositPoint): void {
    const address = encodeURIComponent(`${point.address}, ${point.postalCode} ${point.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  }
}
