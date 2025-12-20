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

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  roleLabel: string;
  roleClass: string;
  collectionsCount: number;
  devicesCount: number;
  walletBalance: number;
  createdAt: Date;
  lastLogin?: Date;
  status: 'active' | 'inactive' | 'blocked';
}

@Component({
  selector: 'app-admin-users',
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
    <div class="users-admin">
      <div class="header">
        <h1>Gestion des utilisateurs</h1>
        <button mat-raised-button color="primary">
          <mat-icon>person_add</mat-icon>
          Nouvel utilisateur
        </button>
      </div>

      <mat-card class="filters-card">
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Rechercher</mat-label>
            <input matInput [(ngModel)]="searchTerm" placeholder="Nom, email...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Rôle</mat-label>
            <mat-select [(ngModel)]="roleFilter">
              <mat-option value="">Tous</mat-option>
              <mat-option value="CLIENT">Client</mat-option>
              <mat-option value="DRIVER">Chauffeur</mat-option>
              <mat-option value="TECHNICIAN">Technicien</mat-option>
              <mat-option value="ADMIN">Admin</mat-option>
              <mat-option value="PARTNER">Partenaire</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select [(ngModel)]="statusFilter">
              <mat-option value="">Tous</mat-option>
              <mat-option value="active">Actif</mat-option>
              <mat-option value="inactive">Inactif</mat-option>
              <mat-option value="blocked">Bloqué</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="users()" matSort>
          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Utilisateur</th>
            <td mat-cell *matCellDef="let u">
              <div class="user-cell">
                <div class="avatar">{{ u.firstName[0] }}{{ u.lastName[0] }}</div>
                <div class="user-info">
                  <span class="name">{{ u.firstName }} {{ u.lastName }}</span>
                  <span class="email">{{ u.email }}</span>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Rôle</th>
            <td mat-cell *matCellDef="let u">
              <mat-chip [class]="u.roleClass">{{ u.roleLabel }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="collections">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Collectes</th>
            <td mat-cell *matCellDef="let u">{{ u.collectionsCount }}</td>
          </ng-container>

          <ng-container matColumnDef="devices">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Appareils</th>
            <td mat-cell *matCellDef="let u">{{ u.devicesCount }}</td>
          </ng-container>

          <ng-container matColumnDef="wallet">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Solde</th>
            <td mat-cell *matCellDef="let u">{{ u.walletBalance | currency:'EUR' }}</td>
          </ng-container>

          <ng-container matColumnDef="lastLogin">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Dernière connexion</th>
            <td mat-cell *matCellDef="let u">
              {{ u.lastLogin ? (u.lastLogin | date:'short') : 'Jamais' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let u">
              <mat-icon [class]="u.status">{{ getStatusIcon(u.status) }}</mat-icon>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let u">
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="viewProfile(u)">
                  <mat-icon>person</mat-icon>
                  <span>Voir profil</span>
                </button>
                <button mat-menu-item (click)="editUser(u)">
                  <mat-icon>edit</mat-icon>
                  <span>Modifier</span>
                </button>
                <button mat-menu-item (click)="viewWallet(u)">
                  <mat-icon>account_balance_wallet</mat-icon>
                  <span>Voir wallet</span>
                </button>
                @if (u.status !== 'blocked') {
                  <button mat-menu-item (click)="blockUser(u)" class="danger">
                    <mat-icon>block</mat-icon>
                    <span>Bloquer</span>
                  </button>
                } @else {
                  <button mat-menu-item (click)="unblockUser(u)">
                    <mat-icon>check_circle</mat-icon>
                    <span>Débloquer</span>
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
    .users-admin {
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

      .user-cell {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1976d2;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .user-info {
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
      }

      mat-chip {
        font-size: 0.75rem;

        &.client { background: #e3f2fd; color: #1976d2; }
        &.driver { background: #fff3e0; color: #e65100; }
        &.technician { background: #f3e5f5; color: #7b1fa2; }
        &.admin { background: #ffebee; color: #c62828; }
        &.partner { background: #e8f5e9; color: #2e7d32; }
      }

      mat-icon {
        &.active { color: #4caf50; }
        &.inactive { color: #9e9e9e; }
        &.blocked { color: #f44336; }
      }

      .danger {
        color: #f44336;
      }
    }
  `]
})
export class AdminUsersComponent {
  displayedColumns = ['user', 'role', 'collections', 'devices', 'wallet', 'lastLogin', 'status', 'actions'];

  searchTerm = '';
  roleFilter = '';
  statusFilter = '';

  users = signal<UserRow[]>([
    {
      id: 'usr123456789',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '+33612345678',
      role: 'CLIENT',
      roleLabel: 'Client',
      roleClass: 'client',
      collectionsCount: 5,
      devicesCount: 12,
      walletBalance: 127.50,
      createdAt: new Date(2024, 0, 15),
      lastLogin: new Date(),
      status: 'active'
    },
    {
      id: 'usr234567890',
      firstName: 'Pierre',
      lastName: 'Legrand',
      email: 'p.legrand@circular.fr',
      role: 'DRIVER',
      roleLabel: 'Chauffeur',
      roleClass: 'driver',
      collectionsCount: 156,
      devicesCount: 0,
      walletBalance: 0,
      createdAt: new Date(2023, 6, 10),
      lastLogin: new Date(),
      status: 'active'
    },
    {
      id: 'usr345678901',
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@email.com',
      role: 'CLIENT',
      roleLabel: 'Client',
      roleClass: 'client',
      collectionsCount: 2,
      devicesCount: 3,
      walletBalance: 45.00,
      createdAt: new Date(2024, 5, 20),
      lastLogin: new Date(Date.now() - 86400000 * 3),
      status: 'active'
    },
    {
      id: 'usr456789012',
      firstName: 'Admin',
      lastName: 'Circular',
      email: 'admin@circular.fr',
      role: 'ADMIN',
      roleLabel: 'Admin',
      roleClass: 'admin',
      collectionsCount: 0,
      devicesCount: 0,
      walletBalance: 0,
      createdAt: new Date(2023, 0, 1),
      lastLogin: new Date(),
      status: 'active'
    },
    {
      id: 'usr567890123',
      firstName: 'Sophie',
      lastName: 'Durand',
      email: 'sophie.durand@email.com',
      role: 'CLIENT',
      roleLabel: 'Client',
      roleClass: 'client',
      collectionsCount: 0,
      devicesCount: 0,
      walletBalance: 0,
      createdAt: new Date(2024, 8, 1),
      status: 'inactive'
    }
  ]);

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      active: 'check_circle',
      inactive: 'remove_circle',
      blocked: 'block'
    };
    return icons[status] || 'help';
  }

  viewProfile(user: UserRow): void {
    alert(`Profil de ${user.firstName} ${user.lastName}`);
  }

  editUser(user: UserRow): void {
    alert(`Modifier ${user.firstName} ${user.lastName}`);
  }

  viewWallet(user: UserRow): void {
    alert(`Wallet de ${user.firstName} ${user.lastName}: ${user.walletBalance}€`);
  }

  blockUser(user: UserRow): void {
    alert(`Bloquer ${user.firstName} ${user.lastName}`);
  }

  unblockUser(user: UserRow): void {
    alert(`Débloquer ${user.firstName} ${user.lastName}`);
  }
}
