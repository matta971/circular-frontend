import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../core/services';
import { Notification, NotificationType } from '../../core/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="notifications-container">
      <header>
        <div>
          <h1>Notifications</h1>
          <p>{{ unreadCount }} non lue(s)</p>
        </div>
        <div class="actions">
          <button mat-stroked-button (click)="markAllAsRead()" [disabled]="unreadCount === 0">
            <mat-icon>done_all</mat-icon>
            Tout marquer comme lu
          </button>
          <a mat-stroked-button routerLink="/notifications/preferences">
            <mat-icon>settings</mat-icon>
            Préférences
          </a>
        </div>
      </header>

      @if (loading) {
        <div class="loading"><mat-spinner diameter="40"></mat-spinner></div>
      } @else if (notifications.length === 0) {
        <div class="empty-state">
          <mat-icon>notifications_none</mat-icon>
          <h3>Aucune notification</h3>
          <p>Vous n'avez pas encore de notifications</p>
        </div>
      } @else {
        <mat-card>
          <mat-list>
            @for (notif of notifications; track notif.id) {
              <mat-list-item class="notification-item" [class.unread]="!notif.read" (click)="onNotificationClick(notif)">
                <div matListItemIcon class="notif-icon" [class]="getNotificationClass(notif.type)">
                  <mat-icon>{{ getNotificationIcon(notif.type) }}</mat-icon>
                </div>
                <div matListItemTitle>{{ notif.title }}</div>
                <div matListItemLine class="notif-message">{{ notif.message }}</div>
                <div matListItemMeta class="notif-meta">
                  <span class="time">{{ getTimeAgo(notif.createdAt) }}</span>
                  <button mat-icon-button (click)="deleteNotification($event, notif)">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </mat-list-item>
              <mat-divider></mat-divider>
            }
          </mat-list>

          @if (hasMore) {
            <div class="load-more">
              <button mat-button (click)="loadMore()" [disabled]="loadingMore">
                @if (loadingMore) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  Charger plus
                }
              </button>
            </div>
          }
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .notifications-container { padding: 24px; max-width: 800px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    header h1 { margin: 0; }
    header p { color: #666; margin: 4px 0 0 0; }
    .actions { display: flex; gap: 12px; }
    .notification-item { cursor: pointer; padding: 16px 0 !important; min-height: 72px !important; }
    .notification-item:hover { background: #f5f5f5; }
    .notification-item.unread { background: #e3f2fd; }
    .notif-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; }
    .notif-icon.success { background: #e8f5e9; color: #4caf50; }
    .notif-icon.info { background: #e3f2fd; color: #2196f3; }
    .notif-icon.warning { background: #fff3e0; color: #ff9800; }
    .notif-icon.error { background: #ffebee; color: #f44336; }
    .notif-message { color: #666 !important; font-size: 0.875rem !important; }
    .notif-meta { display: flex; align-items: center; gap: 8px; }
    .time { font-size: 0.75rem; color: #999; }
    .load-more { padding: 16px; text-align: center; }
    .loading, .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; text-align: center; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; margin-bottom: 16px; }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  loadingMore = false;
  unreadCount = 0;
  page = 0;
  hasMore = true;

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.notificationService.unreadCount$.subscribe(count => this.unreadCount = count);
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotifications(0, 20).subscribe({
      next: (res) => {
        this.notifications = res.content;
        this.hasMore = res.content.length < res.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadMore(): void {
    this.loadingMore = true;
    this.page++;
    this.notificationService.getNotifications(this.page, 20).subscribe({
      next: (res) => {
        this.notifications = [...this.notifications, ...res.content];
        this.hasMore = this.notifications.length < res.totalElements;
        this.loadingMore = false;
      },
      error: () => { this.loadingMore = false; }
    });
  }

  onNotificationClick(notif: Notification): void {
    if (!notif.read) {
      this.notificationService.markAsRead(notif.id).subscribe(() => {
        notif.read = true;
      });
    }
    if (notif.actionUrl) {
      window.location.href = notif.actionUrl;
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.read = true);
      this.snackBar.open('Toutes les notifications marquées comme lues', 'OK', { duration: 2000 });
    });
  }

  deleteNotification(event: Event, notif: Notification): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(notif.id).subscribe(() => {
      this.notifications = this.notifications.filter(n => n.id !== notif.id);
    });
  }

  getTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  }

  getNotificationIcon(type: NotificationType | string): string {
    const icons: Record<string, string> = {
      COLLECTION_CONFIRMED: 'check_circle', COLLECTION_COMPLETED: 'done_all',
      DROPOFF_CONFIRMED: 'store', DROPOFF_COMPLETED: 'done',
      EVALUATION_COMPLETE: 'assessment', VALUATION_READY: 'attach_money',
      REWARD_EARNED: 'stars', REWARD_PAID: 'payments', WALLET_CREDITED: 'account_balance_wallet',
      LISTING_PUBLISHED: 'storefront', LISTING_SOLD: 'sell',
      ORDER_CREATED: 'shopping_cart', ORDER_PAID: 'payment', ORDER_SHIPPED: 'local_shipping', ORDER_DELIVERED: 'inventory',
      DISPUTE_OPENED: 'report_problem', DISPUTE_RESOLVED: 'gavel',
      CERTIFICATE_ISSUED: 'workspace_premium', CERTIFICATE_READY: 'description',
      SYSTEM_ANNOUNCEMENT: 'campaign', SECURITY_ALERT: 'security'
    };
    return icons[type] || 'notifications';
  }

  getNotificationClass(type: NotificationType | string): string {
    const successTypes = ['COLLECTION_COMPLETED', 'DROPOFF_COMPLETED', 'EVALUATION_COMPLETE', 'REWARD_PAID', 'ORDER_DELIVERED', 'DISPUTE_RESOLVED', 'CERTIFICATE_ISSUED'];
    const warningTypes = ['DISPUTE_OPENED', 'LISTING_EXPIRED'];
    const errorTypes = ['ORDER_CANCELLED', 'SECURITY_ALERT'];

    if (successTypes.includes(type)) return 'success';
    if (warningTypes.includes(type)) return 'warning';
    if (errorTypes.includes(type)) return 'error';
    return 'info';
  }
}
