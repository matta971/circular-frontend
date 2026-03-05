import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User, UserRole, ProfileUpdateRequest } from '../models';

export interface OAuthRequest {
  provider: 'GOOGLE' | 'FACEBOOK';
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';
  private readonly isBrowser: boolean;

  private currentUserSignal = signal<User | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === UserRole.ADMIN);
  readonly isDriver = computed(() => this.currentUserSignal()?.role === UserRole.DRIVER);
  readonly isTechnician = computed(() => this.currentUserSignal()?.role === UserRole.TECHNICIAN);

  private platformId = inject(PLATFORM_ID);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.currentUserSignal.set(this.getStoredUser());
  }

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          this.storeTokens(response.data);
          this.currentUserSignal.set(response.data.user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        if (response.success) {
          this.storeTokens(response.data);
          this.currentUserSignal.set(response.data.user);
        }
      })
    );
  }

  /**
   * OAuth login via Google or Facebook
   */
  oauthLogin(request: OAuthRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/oauth`, request).pipe(
      tap(response => {
        if (response.success) {
          this.storeTokens(response.data);
          this.currentUserSignal.set(response.data.user);
        }
      })
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    }
    this.clearTokens();
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(response => {
        if (response.success) {
          this.storeTokens(response.data);
          this.currentUserSignal.set(response.data.user);
        }
      })
    );
  }

  /**
   * Met a jour le profil de l'utilisateur connecte.
   */
  updateProfile(request: ProfileUpdateRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${environment.apiUrl}/users/me/profile`, request).pipe(
      tap(response => {
        if (response.success) {
          this.currentUserSignal.set(response.data);
          if (this.isBrowser) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
          }
        }
      })
    );
  }

  /**
   * Recupere le profil utilisateur depuis le serveur.
   */
  fetchCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/users/me`).pipe(
      tap(response => {
        if (response.success) {
          this.currentUserSignal.set(response.data);
          if (this.isBrowser) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
          }
        }
      })
    );
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private storeTokens(auth: AuthResponse): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.TOKEN_KEY, auth.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, auth.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth.user));
  }

  private clearTokens(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private getStoredUser(): User | null {
    if (!this.isBrowser) return null;
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
