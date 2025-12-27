import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-partner-ops-layout',
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
    <mat-sidenav-container class="ops-container">
      <mat-sidenav mode="side" opened class="ops-sidenav">
        <div class="sidenav-header">
          <mat-icon>engineering</mat-icon>
          <span>Portail Opérations</span>
        </div>

        <mat-nav-list>
          <a mat-list-item routerLink="dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Tableau de bord</span>
          </a>
          <a mat-list-item routerLink="to-receive" routerLinkActive="active">
            <mat-icon matListItemIcon>inbox</mat-icon>
            <span matListItemTitle>À réceptionner</span>
          </a>
          <a mat-list-item routerLink="devices" routerLinkActive="active">
            <mat-icon matListItemIcon>devices</mat-icon>
            <span matListItemTitle>Appareils</span>
          </a>
          <a mat-list-item routerLink="finalization" routerLinkActive="active">
            <mat-icon matListItemIcon>check_circle</mat-icon>
            <span matListItemTitle>Finalisation</span>
          </a>
          <a mat-list-item routerLink="certificates" routerLinkActive="active">
            <mat-icon matListItemIcon>verified</mat-icon>
            <span matListItemTitle>Certificats</span>
          </a>
        </mat-nav-list>

        <div class="sidenav-footer">
          <a mat-list-item routerLink="/">
            <mat-icon matListItemIcon>arrow_back</mat-icon>
            <span>Retour au site</span>
          </a>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="ops-content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .ops-container {
      height: calc(100vh - 64px);
    }

    .ops-sidenav {
      width: 250px;
      background: #1565c0;

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
          color: #90caf9;
        }
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
            background: rgba(255, 255, 255, 0.2);
            color: white;

            mat-icon {
              color: white;
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

    .ops-content {
      background: #f5f5f5;
      padding: 2rem;
    }
  `]
})
export class PartnerOpsLayoutComponent {}
