import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PartnerOpsService } from '../services/partner-ops.service';
import { OpsCollection, OpsDropOff } from '../models/partner-ops.model';

@Component({
  selector: 'app-ops-to-receive',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="to-receive-container">
      <h1>À réceptionner</h1>

      <mat-tab-group>
        <!-- Collectes tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>local_shipping</mat-icon>
            Collectes ({{ collections().length }})
          </ng-template>

          @if (loadingCollections()) {
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else if (collections().length === 0) {
            <mat-card class="empty-state">
              <mat-card-content>
                <mat-icon>check_circle</mat-icon>
                <h3>Aucune collecte en attente</h3>
                <p>Toutes les collectes ont été réceptionnées.</p>
              </mat-card-content>
            </mat-card>
          } @else {
            <table mat-table [dataSource]="collections()" class="mat-elevation-z2">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let c">#{{ c.id }}</td>
              </ng-container>

              <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef>Adresse</th>
                <td mat-cell *matCellDef="let c">{{ c.address }}, {{ c.postalCode }} {{ c.city }}</td>
              </ng-container>

              <ng-container matColumnDef="scheduledDate">
                <th mat-header-cell *matHeaderCellDef>Date prévue</th>
                <td mat-cell *matCellDef="let c">{{ c.scheduledDate | date:'dd/MM/yyyy' }} {{ c.scheduledTimeSlot }}</td>
              </ng-container>

              <ng-container matColumnDef="itemCount">
                <th mat-header-cell *matHeaderCellDef>Articles</th>
                <td mat-cell *matCellDef="let c">{{ c.itemCount }} appareil(s)</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let c">
                  <mat-chip [highlighted]="true" color="accent">{{ c.status }}</mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let c">
                  <button mat-raised-button color="primary"
                          [disabled]="receivingCollection() === c.id"
                          (click)="receiveCollection(c)">
                    @if (receivingCollection() === c.id) {
                      <mat-spinner diameter="20"></mat-spinner>
                    } @else {
                      <mat-icon>check</mat-icon>
                      Réceptionner
                    }
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="collectionColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: collectionColumns;"></tr>
            </table>
          }
        </mat-tab>

        <!-- Drop-offs tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>store</mat-icon>
            Dépôts ({{ dropOffs().length }})
          </ng-template>

          @if (loadingDropOffs()) {
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else if (dropOffs().length === 0) {
            <mat-card class="empty-state">
              <mat-card-content>
                <mat-icon>check_circle</mat-icon>
                <h3>Aucun dépôt en attente</h3>
                <p>Tous les dépôts ont été réceptionnés.</p>
              </mat-card-content>
            </mat-card>
          } @else {
            <table mat-table [dataSource]="dropOffs()" class="mat-elevation-z2">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let d">#{{ d.id }}</td>
              </ng-container>

              <ng-container matColumnDef="code">
                <th mat-header-cell *matHeaderCellDef>Code</th>
                <td mat-cell *matCellDef="let d">{{ d.code }}</td>
              </ng-container>

              <ng-container matColumnDef="dropOffPoint">
                <th mat-header-cell *matHeaderCellDef>Point de dépôt</th>
                <td mat-cell *matCellDef="let d">{{ d.dropOffPointName }}</td>
              </ng-container>

              <ng-container matColumnDef="droppedAt">
                <th mat-header-cell *matHeaderCellDef>Déposé le</th>
                <td mat-cell *matCellDef="let d">{{ d.droppedAt | date:'dd/MM/yyyy HH:mm' }}</td>
              </ng-container>

              <ng-container matColumnDef="declaredItemCount">
                <th mat-header-cell *matHeaderCellDef>Articles déclarés</th>
                <td mat-cell *matCellDef="let d">{{ d.declaredItemCount }} appareil(s)</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let d">
                  <mat-chip [highlighted]="true" color="accent">{{ d.status }}</mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let d">
                  <button mat-raised-button color="primary"
                          [disabled]="receivingDropOff() === d.id"
                          (click)="receiveDropOff(d)">
                    @if (receivingDropOff() === d.id) {
                      <mat-spinner diameter="20"></mat-spinner>
                    } @else {
                      <mat-icon>check</mat-icon>
                      Réceptionner
                    }
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="dropOffColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: dropOffColumns;"></tr>
            </table>
          }
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .to-receive-container {
      max-width: 1200px;
      margin: 0 auto;

      h1 {
        margin-bottom: 1.5rem;
        color: #1565c0;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .empty-state {
      margin: 2rem 0;
      text-align: center;
      padding: 3rem;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #4caf50;
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
      margin-top: 1rem;
    }

    mat-tab-group {
      mat-icon {
        margin-right: 0.5rem;
      }
    }

    button mat-spinner {
      display: inline-block;
    }
  `]
})
export class OpsToReceiveComponent implements OnInit {
  collections = signal<OpsCollection[]>([]);
  dropOffs = signal<OpsDropOff[]>([]);
  loadingCollections = signal(true);
  loadingDropOffs = signal(true);
  receivingCollection = signal<number | null>(null);
  receivingDropOff = signal<number | null>(null);

  collectionColumns = ['id', 'address', 'scheduledDate', 'itemCount', 'status', 'actions'];
  dropOffColumns = ['id', 'code', 'dropOffPoint', 'droppedAt', 'declaredItemCount', 'status', 'actions'];

  constructor(
    private opsService: PartnerOpsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadingCollections.set(true);
    this.loadingDropOffs.set(true);

    this.opsService.getCollectionsPending().subscribe({
      next: (response) => {
        if (response.success) {
          this.collections.set(response.data);
        }
        this.loadingCollections.set(false);
      },
      error: () => this.loadingCollections.set(false)
    });

    this.opsService.getDropOffsPending().subscribe({
      next: (response) => {
        if (response.success) {
          this.dropOffs.set(response.data);
        }
        this.loadingDropOffs.set(false);
      },
      error: () => this.loadingDropOffs.set(false)
    });
  }

  receiveCollection(collection: OpsCollection): void {
    this.receivingCollection.set(collection.id);
    this.opsService.receiveCollection(collection.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Collecte réceptionnée avec succès', 'OK', { duration: 3000 });
          this.collections.update(list => list.filter(c => c.id !== collection.id));
        }
        this.receivingCollection.set(null);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la réception', 'OK', { duration: 3000 });
        this.receivingCollection.set(null);
      }
    });
  }

  receiveDropOff(dropOff: OpsDropOff): void {
    this.receivingDropOff.set(dropOff.id);
    this.opsService.receiveDropOff(dropOff.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Dépôt réceptionné avec succès', 'OK', { duration: 3000 });
          this.dropOffs.update(list => list.filter(d => d.id !== dropOff.id));
        }
        this.receivingDropOff.set(null);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la réception', 'OK', { duration: 3000 });
        this.receivingDropOff.set(null);
      }
    });
  }
}
