import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule
  ],
  template: `
    <mat-sidenav-container class="admin-container">
      <mat-sidenav mode="side" opened class="admin-sidenav">
        <div class="sidenav-header">
          <mat-icon>admin_panel_settings</mat-icon>
          <span>Administration</span>
        </div>

        <mat-nav-list>
          <a mat-list-item routerLink="dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Tableau de bord</span>
          </a>
          <a mat-list-item routerLink="collections" routerLinkActive="active">
            <mat-icon matListItemIcon>local_shipping</mat-icon>
            <span matListItemTitle>Collectes</span>
          </a>
          <a mat-list-item routerLink="devices" routerLinkActive="active">
            <mat-icon matListItemIcon>devices</mat-icon>
            <span matListItemTitle>Appareils</span>
          </a>
          <a mat-list-item routerLink="users" routerLinkActive="active">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Utilisateurs</span>
          </a>

          <div class="nav-divider"></div>

          <a mat-list-item routerLink="repair-partners" routerLinkActive="active">
            <mat-icon matListItemIcon>build</mat-icon>
            <span matListItemTitle>Partenaires Répar.</span>
          </a>
          <a mat-list-item routerLink="scoring" routerLinkActive="active">
            <mat-icon matListItemIcon>tune</mat-icon>
            <span matListItemTitle>Scoring & Règles</span>
          </a>
          <a mat-list-item routerLink="kpis" routerLinkActive="active">
            <mat-icon matListItemIcon>insights</mat-icon>
            <span matListItemTitle>KPIs & Analytics</span>
          </a>

          <div class="nav-divider"></div>
          <div class="nav-section-title">Portail Partenaires</div>

          <a mat-list-item routerLink="partner-analytics" routerLinkActive="active">
            <mat-icon matListItemIcon>business</mat-icon>
            <span matListItemTitle>Analytics Partenaires</span>
          </a>
          <a mat-list-item routerLink="partner-subscriptions" routerLinkActive="active">
            <mat-icon matListItemIcon>subscriptions</mat-icon>
            <span matListItemTitle>Abonnements API</span>
          </a>
        </mat-nav-list>

        <div class="sidenav-footer">
          <a mat-list-item routerLink="/">
            <mat-icon matListItemIcon>arrow_back</mat-icon>
            <span>Retour au site</span>
          </a>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="admin-content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .admin-container {
      height: calc(100vh - 64px);
    }

    .admin-sidenav {
      width: 250px;
      background: #263238;

      .sidenav-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1.5rem;
        color: white;
        font-weight: 600;
        font-size: 1.1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        mat-icon {
          color: #4caf50;
        }
      }

      .nav-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 1rem 1rem;
      }

      .nav-section-title {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0 1rem;
        margin-bottom: 0.5rem;
      }

      mat-nav-list {
        padding-top: 1rem;

        a {
          color: rgba(255, 255, 255, 0.8);
          margin: 0.25rem 0.5rem;
          border-radius: 8px;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          &.active {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;

            mat-icon {
              color: #4caf50;
            }
          }

          mat-icon {
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }

      .sidenav-footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.5rem;

        a {
          color: rgba(255, 255, 255, 0.6);

          &:hover {
            color: white;
          }
        }
      }
    }

    .admin-content {
      background: #f5f5f5;
      padding: 2rem;
    }
  `]
})
export class AdminLayoutComponent {}
