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
    <mat-toolbar color="primary">
      <a routerLink="/" class="logo">
        <span>Circular Electronics</span>
      </a>

      <nav class="nav-links">
        <a mat-button routerLink="/evaluation" routerLinkActive="active">Évaluer</a>
        <a mat-button routerLink="/marketplace" routerLinkActive="active">Marketplace</a>
        <a mat-button routerLink="/collection" routerLinkActive="active">Collecte</a>
        <a mat-button routerLink="/deposit" routerLinkActive="active">Dépôt</a>
      </nav>

      <span class="spacer"></span>

      @if (authService.isAuthenticated()) {
        <a mat-button routerLink="/wallet">
          <mat-icon>account_balance_wallet</mat-icon>
          Mon Wallet
        </a>

        <a mat-icon-button routerLink="/notifications"
          [matBadge]="unreadCount > 0 ? unreadCount : null"
          matBadgeColor="warn"
          matBadgeSize="small">
          <mat-icon>notifications</mat-icon>
        </a>

        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu">
          <div class="user-info">
            <p>{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</p>
            <small>{{ authService.currentUser()?.email }}</small>
          </div>
          <mat-divider></mat-divider>
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
          <mat-divider></mat-divider>
          @if (authService.isAdmin()) {
            <a mat-menu-item routerLink="/admin">
              <mat-icon>admin_panel_settings</mat-icon>
              Administration
            </a>
          }
          <button mat-menu-item (click)="authService.logout()">
            <mat-icon>logout</mat-icon>
            Déconnexion
          </button>
        </mat-menu>
      } @else {
        <a mat-button routerLink="/auth/login">Connexion</a>
        <a mat-raised-button routerLink="/auth/register">Inscription</a>
      }
    </mat-toolbar>
  `,
  styles: [`
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .logo {
      text-decoration: none;
      color: inherit;
      font-weight: 600;
      font-size: 1.2rem;
    }

    .nav-links {
      margin-left: 2rem;
    }

    .nav-links a.active {
      background: rgba(255, 255, 255, 0.1);
    }

    .spacer {
      flex: 1;
    }

    .user-info {
      padding: 1rem;
      p {
        margin: 0;
        font-weight: 500;
      }
      small {
        color: rgba(0, 0, 0, 0.6);
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
