import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';
import {
  Notification,
  NotificationPreferences,
  NotificationStats,
  UpdatePreferencesRequest,
  NotificationType
} from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshUnreadCount();
  }

  // ============ NOTIFICATIONS ============

  getNotifications(page = 0, size = 20, unreadOnly = false): Observable<{ content: Notification[]; totalElements: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (unreadOnly) {
      params = params.set('unreadOnly', 'true');
    }

    return this.http.get<ApiResponse<{ content: Notification[]; totalElements: number }>>(
      this.apiUrl,
      { params }
    ).pipe(
      map(response => response.data),
      catchError(() => of({ content: [], totalElements: 0 }))
    );
  }

  getNotification(id: number): Observable<Notification | null> {
    return this.http.get<ApiResponse<Notification>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<ApiResponse<Notification[]>>(`${this.apiUrl}/unread`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  markAsRead(id: number): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/read`, {}).pipe(
      map(() => undefined),
      tap(() => this.refreshUnreadCount())
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/read-all`, {}).pipe(
      map(() => undefined),
      tap(() => this.unreadCountSubject.next(0))
    );
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined),
      tap(() => this.refreshUnreadCount())
    );
  }

  clearAll(): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/clear`).pipe(
      map(() => undefined),
      tap(() => this.unreadCountSubject.next(0))
    );
  }

  // ============ STATS ============

  getStats(): Observable<NotificationStats> {
    return this.http.get<ApiResponse<NotificationStats>>(`${this.apiUrl}/stats`).pipe(
      map(response => response.data),
      catchError(() => of({ total: 0, unread: 0, byType: {} as Record<NotificationType, number> }))
    );
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<ApiResponse<{ count: number }>>(`${this.apiUrl}/unread/count`).pipe(
      map(response => response.data.count),
      tap(count => this.unreadCountSubject.next(count)),
      catchError(() => of(0))
    );
  }

  refreshUnreadCount(): void {
    this.getUnreadCount().subscribe();
  }

  // ============ PREFERENCES ============

  getPreferences(): Observable<NotificationPreferences | null> {
    return this.http.get<ApiResponse<NotificationPreferences>>(`${this.apiUrl}/preferences`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  updatePreferences(request: UpdatePreferencesRequest): Observable<NotificationPreferences> {
    return this.http.put<ApiResponse<NotificationPreferences>>(`${this.apiUrl}/preferences`, request).pipe(
      map(response => response.data)
    );
  }

  // ============ REAL-TIME (WebSocket placeholder) ============

  // For future WebSocket implementation
  subscribeToNotifications(): Observable<Notification> {
    // This would be replaced with actual WebSocket connection
    // For now, we use polling
    return new Observable(subscriber => {
      const interval = setInterval(() => {
        this.getUnreadNotifications().subscribe(notifications => {
          notifications.forEach(n => subscriber.next(n));
        });
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval);
    });
  }
}
