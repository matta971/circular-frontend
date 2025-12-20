import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../core/services';
import { NotificationPreferences } from '../../../core/models';

@Component({
  selector: 'app-notification-preferences',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="preferences-container">
      <header>
        <a mat-icon-button routerLink="/notifications">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <div>
          <h1>Préférences de notification</h1>
          <p>Gérez comment vous souhaitez être notifié</p>
        </div>
      </header>

      @if (loading) {
        <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
      } @else if (preferences) {
        <mat-card>
          <mat-card-header>
            <mat-card-title>Canaux de notification</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="toggle-row">
              <div class="toggle-info">
                <mat-icon>email</mat-icon>
                <div>
                  <strong>Email</strong>
                  <p>Recevoir des notifications par email</p>
                </div>
              </div>
              <mat-slide-toggle [(ngModel)]="preferences.emailEnabled" (change)="save()">
              </mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="toggle-row">
              <div class="toggle-info">
                <mat-icon>notifications</mat-icon>
                <div>
                  <strong>Push</strong>
                  <p>Recevoir des notifications push sur le navigateur</p>
                </div>
              </div>
              <mat-slide-toggle [(ngModel)]="preferences.pushEnabled" (change)="save()">
              </mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="toggle-row">
              <div class="toggle-info">
                <mat-icon>sms</mat-icon>
                <div>
                  <strong>SMS</strong>
                  <p>Recevoir des notifications par SMS</p>
                </div>
              </div>
              <mat-slide-toggle [(ngModel)]="preferences.smsEnabled" (change)="save()">
              </mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Types de notification</mat-card-title>
            <mat-card-subtitle>Activez ou désactivez les notifications par catégorie</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            @for (category of notificationCategories; track category.key) {
              <div class="category-section">
                <h4>{{ category.label }}</h4>
                @for (type of category.types; track type.key) {
                  <div class="type-row">
                    <span>{{ type.label }}</span>
                    <div class="type-toggles">
                      <mat-slide-toggle
                        [checked]="isTypeEnabled(type.key, 'email')"
                        (change)="toggleType(type.key, 'email', $event.checked)"
                        [disabled]="!preferences.emailEnabled">
                        <mat-icon>email</mat-icon>
                      </mat-slide-toggle>
                      <mat-slide-toggle
                        [checked]="isTypeEnabled(type.key, 'push')"
                        (change)="toggleType(type.key, 'push', $event.checked)"
                        [disabled]="!preferences.pushEnabled">
                        <mat-icon>notifications</mat-icon>
                      </mat-slide-toggle>
                    </div>
                  </div>
                }
              </div>
              <mat-divider></mat-divider>
            }
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .preferences-container { padding: 24px; max-width: 700px; margin: 0 auto; }
    header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    header h1 { margin: 0; }
    header p { color: #666; margin: 4px 0 0 0; }
    mat-card { margin-bottom: 24px; }
    .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; }
    .toggle-info { display: flex; align-items: center; gap: 16px; }
    .toggle-info mat-icon { color: #666; }
    .toggle-info strong { display: block; }
    .toggle-info p { margin: 0; color: #666; font-size: 0.875rem; }
    .category-section { padding: 16px 0; }
    .category-section h4 { margin: 0 0 12px 0; color: #1976d2; }
    .type-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
    .type-toggles { display: flex; gap: 24px; }
    .type-toggles mat-icon { font-size: 18px; width: 18px; height: 18px; margin-right: 4px; }
    .loading { display: flex; justify-content: center; padding: 64px; }
  `]
})
export class NotificationPreferencesComponent implements OnInit {
  preferences: NotificationPreferences | null = null;
  loading = true;
  saving = false;

  notificationCategories = [
    {
      key: 'collection',
      label: 'Collectes & Dépôts',
      types: [
        { key: 'COLLECTION_CONFIRMED', label: 'Collecte confirmée' },
        { key: 'COLLECTION_COMPLETED', label: 'Collecte terminée' },
        { key: 'DROPOFF_CONFIRMED', label: 'Dépôt confirmé' },
        { key: 'DROPOFF_COMPLETED', label: 'Dépôt terminé' }
      ]
    },
    {
      key: 'rewards',
      label: 'Récompenses & Portefeuille',
      types: [
        { key: 'REWARD_EARNED', label: 'Récompense gagnée' },
        { key: 'REWARD_PAID', label: 'Récompense versée' },
        { key: 'WALLET_CREDITED', label: 'Compte crédité' }
      ]
    },
    {
      key: 'marketplace',
      label: 'Marketplace',
      types: [
        { key: 'LISTING_PUBLISHED', label: 'Annonce publiée' },
        { key: 'LISTING_SOLD', label: 'Article vendu' },
        { key: 'ORDER_CREATED', label: 'Nouvelle commande' },
        { key: 'ORDER_SHIPPED', label: 'Commande expédiée' },
        { key: 'ORDER_DELIVERED', label: 'Commande livrée' }
      ]
    },
    {
      key: 'certificates',
      label: 'Certificats',
      types: [
        { key: 'CERTIFICATE_ISSUED', label: 'Certificat émis' },
        { key: 'CERTIFICATE_READY', label: 'Certificat prêt' }
      ]
    }
  ];

  private typePreferences: Map<string, { email: boolean; push: boolean; inApp: boolean }> = new Map();

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    this.notificationService.getPreferences().subscribe({
      next: (prefs) => {
        this.preferences = prefs;
        if (prefs?.preferences) {
          prefs.preferences.forEach(p => {
            this.typePreferences.set(p.type, { email: p.email, push: p.push, inApp: p.inApp });
          });
        }
        this.loading = false;
      },
      error: () => {
        this.preferences = { userId: 0, emailEnabled: true, pushEnabled: true, smsEnabled: false, preferences: [] };
        this.loading = false;
      }
    });
  }

  save(): void {
    if (!this.preferences || this.saving) return;
    this.saving = true;

    this.notificationService.updatePreferences({
      emailEnabled: this.preferences.emailEnabled,
      pushEnabled: this.preferences.pushEnabled,
      smsEnabled: this.preferences.smsEnabled
    }).subscribe({
      next: () => {
        this.snackBar.open('Préférences sauvegardées', 'OK', { duration: 2000 });
        this.saving = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors de la sauvegarde', 'OK', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  isTypeEnabled(type: string, channel: 'email' | 'push'): boolean {
    const pref = this.typePreferences.get(type);
    return pref ? pref[channel] : true;
  }

  toggleType(type: string, channel: 'email' | 'push', enabled: boolean): void {
    let pref = this.typePreferences.get(type);
    if (!pref) {
      pref = { email: true, push: true, inApp: true };
    }
    pref[channel] = enabled;
    this.typePreferences.set(type, pref);
    this.save();
  }
}
