import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule
  ],
  template: `
    <mat-toolbar class="header-toolbar">
      <a routerLink="/" class="logo">
        <img src="logo.svg" alt="Circular Electronics" class="logo-img" />
      </a>

      <nav class="nav-links">
        <a mat-button routerLink="/evaluation" routerLinkActive="active">
          <mat-icon>assessment</mat-icon>
          <span>Évaluer</span>
        </a>
        <a mat-button routerLink="/marketplace" routerLinkActive="active">
          <mat-icon>storefront</mat-icon>
          <span>Marketplace</span>
        </a>
        <a mat-button routerLink="/collection" routerLinkActive="active">
          <mat-icon>inventory_2</mat-icon>
          <span>Collecte</span>
        </a>
        <a mat-button routerLink="/deposit" routerLinkActive="active">
          <mat-icon>place</mat-icon>
          <span>Dépôt</span>
        </a>
      </nav>

      <span class="spacer"></span>

      @if (authService.isAuthenticated()) {
        <a mat-button routerLink="/tokens" class="tokens-btn">
          <mat-icon>toll</mat-icon>
          <span class="tokens-text">Mes Tokens</span>
        </a>

        <a mat-button routerLink="/wallet" class="wallet-btn">
          <mat-icon>account_balance_wallet</mat-icon>
          <span class="wallet-text">Mon Wallet</span>
        </a>

        <button mat-icon-button routerLink="/notifications" class="notification-btn"
          [matBadge]="unreadCount > 0 ? unreadCount : null"
          matBadgeColor="warn"
          matBadgeSize="small">
          <mat-icon>notifications</mat-icon>
        </button>

        <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-btn">
          @if (authService.currentUser()?.avatarUrl) {
            <img [src]="authService.currentUser()?.avatarUrl" alt="Avatar" class="header-avatar" referrerpolicy="no-referrer">
          } @else {
            <mat-icon>account_circle</mat-icon>
          }
        </button>

        <mat-menu #userMenu="matMenu" class="user-menu">
          <div class="user-info">
            <div class="user-avatar">
              @if (authService.currentUser()?.avatarUrl) {
                <img [src]="authService.currentUser()?.avatarUrl" alt="Avatar" referrerpolicy="no-referrer">
              } @else {
                <mat-icon>person</mat-icon>
              }
            </div>
            <div class="user-details">
              <p class="user-name">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</p>
              <small class="user-email">{{ authService.currentUser()?.email }}</small>
            </div>
          </div>
          <mat-divider></mat-divider>
          <a mat-menu-item routerLink="/profile">
            <mat-icon>settings</mat-icon>
            Mon profil
          </a>
          <a mat-menu-item routerLink="/evaluation/my-evaluations">
            <mat-icon>assessment</mat-icon>
            Mes évaluations
          </a>
          <a mat-menu-item routerLink="/marketplace/my-listings">
            <mat-icon>storefront</mat-icon>
            Mes annonces
          </a>
          <a mat-menu-item routerLink="/marketplace/orders">
            <mat-icon>shopping_bag</mat-icon>
            Mes commandes
          </a>
          <a mat-menu-item routerLink="/certificates">
            <mat-icon>workspace_premium</mat-icon>
            Mes certificats
          </a>
          <a mat-menu-item routerLink="/tokens">
            <mat-icon>toll</mat-icon>
            Mes Tokens & Vouchers
          </a>
          <mat-divider></mat-divider>
          @if (authService.isTechnician()) {
            <a mat-menu-item routerLink="/ops">
              <mat-icon>engineering</mat-icon>
              Portail Opérations
            </a>
          }
          @if (authService.isAdmin()) {
            <a mat-menu-item routerLink="/ops">
              <mat-icon>engineering</mat-icon>
              Portail Opérations
            </a>
            <a mat-menu-item routerLink="/admin">
              <mat-icon>admin_panel_settings</mat-icon>
              Administration
            </a>
          }
          <button mat-menu-item (click)="authService.logout()" class="logout-btn">
            <mat-icon>logout</mat-icon>
            Déconnexion
          </button>
        </mat-menu>
      } @else {
        <a mat-button routerLink="/auth/login" class="login-btn">Connexion</a>
        <a mat-raised-button color="primary" routerLink="/auth/register" class="register-btn">Inscription</a>
      }
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: white;
      border-bottom: 1px solid var(--ce-gray-200);
      padding: 0 1.5rem;
      height: 100px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .logo-img {
      height: 160px;
      width: auto;
    }

    .nav-links {
      margin-left: 2rem;
      display: flex;
      gap: 0.5rem;

      a {
        color: var(--ce-gray-700);
        border-radius: var(--ce-radius-md);
        transition: all 0.2s ease;
        font-size: 1.1rem;
        padding: 0.5rem 1rem;

        mat-icon {
          margin-right: 6px;
          font-size: 24px;
          height: 24px;
          width: 24px;
        }

        span {
          font-weight: 500;
        }

        &:hover {
          background: var(--ce-gray-100);
          color: var(--ce-primary);
        }

        &.active {
          background: rgba(26, 31, 216, 0.08);
          color: var(--ce-primary);
        }
      }
    }

    .spacer {
      flex: 1;
    }

    .tokens-btn {
      color: var(--ce-secondary, #f59e0b);
      margin-right: 0.5rem;
      font-size: 1.1rem;

      mat-icon {
        margin-right: 6px;
        font-size: 24px;
        height: 24px;
        width: 24px;
      }

      .tokens-text {
        font-weight: 500;
      }

      &:hover {
        background: rgba(245, 158, 11, 0.1);
      }
    }

    .wallet-btn {
      color: var(--ce-primary);
      margin-right: 0.5rem;
      font-size: 1.1rem;

      mat-icon {
        margin-right: 6px;
        font-size: 24px;
        height: 24px;
        width: 24px;
      }

      .wallet-text {
        font-weight: 500;
      }
    }

    .notification-btn {
      color: var(--ce-gray-600);

      mat-icon {
        font-size: 28px;
        height: 28px;
        width: 28px;
      }

      &:hover {
        color: var(--ce-primary);
      }
    }

    .user-btn {
      color: var(--ce-gray-600);

      mat-icon {
        font-size: 28px;
        height: 28px;
        width: 28px;
      }

      .header-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }

      &:hover {
        color: var(--ce-primary);
      }
    }

    .login-btn {
      color: var(--ce-primary);
      font-weight: 500;
      font-size: 1.1rem;
    }

    .register-btn {
      margin-left: 0.5rem;
      font-weight: 500;
      font-size: 1.1rem;
      padding: 0.5rem 1.25rem;
    }

    .user-info {
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--ce-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        mat-icon {
          color: white;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-details {
        .user-name {
          margin: 0;
          font-weight: 600;
          color: var(--ce-black);
        }

        .user-email {
          color: var(--ce-gray-600);
          font-size: 12px;
        }
      }
    }

    .logout-btn {
      color: var(--ce-error);
    }

    // Responsive
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .tokens-text,
      .wallet-text {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  unreadCount = 0;

  ngOnInit(): void {
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }
}
