import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TokenService } from '../../../../core/services/token.service';
import { TokenTransaction, PagedResponse } from '../../../../core/models/token.model';

@Component({
  selector: 'app-token-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    RouterLink
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-icon mat-card-avatar>history</mat-icon>
        <mat-card-title>Historique des tokens</mat-card-title>
        <mat-card-subtitle>{{ totalElements }} transactions</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <table mat-table [dataSource]="transactions" class="transactions-table">
          <!-- Date Column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let tx">
              {{ tx.createdAt | date:'dd/MM/yyyy HH:mm' }}
            </td>
          </ng-container>

          <!-- Type Column -->
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let tx">
              <mat-chip [class]="tx.isCredit ? 'credit-chip' : 'debit-chip'">
                {{ tx.transactionTypeLabel }}
              </mat-chip>
            </td>
          </ng-container>

          <!-- Amount Column -->
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Montant</th>
            <td mat-cell *matCellDef="let tx" [class]="tx.isCredit ? 'credit' : 'debit'">
              <span class="amount">
                {{ tx.isCredit ? '+' : '' }}{{ tx.amount | number:'1.0-0' }}
              </span>
            </td>
          </ng-container>

          <!-- Description Column -->
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let tx">
              {{ tx.description }}
            </td>
          </ng-container>

          <!-- Balance Column -->
          <ng-container matColumnDef="balance">
            <th mat-header-cell *matHeaderCellDef>Solde</th>
            <td mat-cell *matCellDef="let tx">
              {{ tx.balanceAfter | number:'1.0-0' }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        @if (transactions.length === 0 && !loading) {
          <div class="no-data">
            <mat-icon>receipt_long</mat-icon>
            <p>Aucune transaction pour le moment</p>
            <p class="hint">Évaluez des appareils pour gagner des tokens!</p>
            <button mat-raised-button color="primary" routerLink="/evaluation">
              Évaluer un appareil
            </button>
          </div>
        }

        <mat-paginator
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageIndex]="pageIndex"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .transactions-table {
      width: 100%;
    }

    .credit {
      color: #22c55e;
      font-weight: 600;
    }

    .debit {
      color: #ef4444;
      font-weight: 600;
    }

    .amount {
      font-family: 'Roboto Mono', monospace;
    }

    .credit-chip {
      background-color: #dcfce7 !important;
      color: #166534 !important;
    }

    .debit-chip {
      background-color: #fee2e2 !important;
      color: #991b1b !important;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      text-align: center;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .no-data p {
      margin: 0.5rem 0;
    }

    .no-data .hint {
      font-size: 0.9rem;
      color: #999;
      margin-bottom: 1rem;
    }
  `]
})
export class TokenTransactionsComponent implements OnInit {
  private tokenService = inject(TokenService);

  transactions: TokenTransaction[] = [];
  displayedColumns = ['date', 'type', 'amount', 'description', 'balance'];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;
  loading = true;

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.tokenService.getMyTransactions(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.transactions = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTransactions();
  }
}
