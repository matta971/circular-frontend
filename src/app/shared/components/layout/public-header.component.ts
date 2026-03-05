import { Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

export type LandingPageType = 'citoyen' | 'association' | 'entreprise' | null;

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar class="public-header">
      <a routerLink="/" class="logo">
        <img src="logo.svg" alt="Circular Electronics" class="logo-img" />
      </a>

      <nav class="nav-links">
        <a mat-button (click)="scrollTo('concept')">Concept</a>
        <a mat-button (click)="scrollTo('how-it-works')">Comment ça marche</a>
        <a mat-button (click)="scrollTo('impact')">Impact</a>
        <a mat-button (click)="scrollTo('partners')">Partenaires</a>
      </nav>

      <span class="spacer"></span>

      <div class="vous-etes">
        <button mat-button [matMenuTriggerFor]="vousEtesMenu" class="vous-etes-btn">
          <span>Vous êtes ?</span>
          <mat-icon>expand_more</mat-icon>
        </button>
        <mat-menu #vousEtesMenu="matMenu" class="vous-etes-menu">
          @if (currentPage !== 'citoyen') {
            <a mat-menu-item routerLink="/citoyen" class="menu-citoyen">
              <mat-icon>person</mat-icon>
              Citoyen
            </a>
          }
          @if (currentPage !== 'association') {
            <a mat-menu-item routerLink="/association" class="menu-association">
              <mat-icon>groups</mat-icon>
              Association
            </a>
          }
          @if (currentPage !== 'entreprise') {
            <a mat-menu-item routerLink="/entreprise" class="menu-entreprise">
              <mat-icon>business</mat-icon>
              Entreprise
            </a>
          }
        </mat-menu>
      </div>

      <a mat-button routerLink="/auth/login" class="login-btn">Se connecter</a>
    </mat-toolbar>
  `,
  styles: [`
    .public-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--ce-white, #ffffff);
      border-bottom: 1px solid var(--ce-gray-200, #eeeeee);
      padding: 0 2rem;
      height: 80px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .logo-img {
      height: 120px;
      width: auto;
    }

    .nav-links {
      margin-left: 3rem;
      display: flex;
      gap: 0.25rem;

      a {
        color: var(--ce-gray-700, #616161);
        font-weight: 500;
        font-size: 0.95rem;
        padding: 0.5rem 1rem;
        border-radius: var(--ce-radius-md, 8px);
        transition: all 0.2s ease;

        &:hover {
          background: var(--ce-gray-100, #f5f5f5);
          color: var(--ce-primary, #1a1fd8);
        }
      }
    }

    .spacer {
      flex: 1;
    }

    .vous-etes {
      margin-right: 1rem;
    }

    .vous-etes-btn {
      background: var(--ce-primary, #1a1fd8) !important;
      color: white !important;
      border-radius: 24px;
      padding: 0.5rem 1.25rem;
      font-weight: 500;
      transition: background 0.2s ease, transform 0.2s ease;
      line-height: normal;

      mat-icon {
        margin-left: 4px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: white !important;
      }

      span {
        color: white !important;
      }

      &:hover {
        background: var(--ce-primary-dark, #1519a8) !important;
        transform: translateY(-1px);
      }

      &:focus, &:active, &[aria-expanded="true"] {
        background: var(--ce-primary, #1a1fd8) !important;
        color: white !important;
      }
    }

    .menu-citoyen mat-icon {
      color: var(--ce-secondary, #19e166);
    }

    .menu-association mat-icon {
      color: #0ea5e9;
    }

    .menu-entreprise mat-icon {
      color: var(--ce-primary, #1a1fd8);
    }

    .login-btn {
      color: var(--ce-gray-700, #616161);
      font-weight: 500;
      border: 1px solid var(--ce-gray-300, #e0e0e0);
      border-radius: 24px;
      padding: 0.5rem 1.25rem;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--ce-primary, #1a1fd8);
        color: var(--ce-primary, #1a1fd8);
        background: rgba(26, 31, 216, 0.05);
      }
    }

    /* Responsive */
    @media (max-width: 992px) {
      .nav-links {
        display: none;
      }

      .public-header {
        padding: 0 1rem;
      }
    }

    @media (max-width: 576px) {
      .logo-img {
        height: 80px;
      }

      .vous-etes-btn span {
        display: none;
      }

      .vous-etes-btn {
        padding: 0.5rem;
        min-width: auto;

        mat-icon {
          margin-left: 0;
        }
      }
    }
  `]
})
export class PublicHeaderComponent {
  @Input() currentPage: LandingPageType = null;

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  scrollTo(section: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
