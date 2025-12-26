import { Component, inject, signal, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

declare const google: any;
declare const FB: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="auth-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Connexion</mat-card-title>
          <mat-card-subtitle>Accédez à votre compte Circular</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }

          <!-- Social Login Buttons -->
          <div class="social-login">
            <button mat-stroked-button class="social-btn google-btn" (click)="loginWithGoogle()" [disabled]="loading()">
              <svg class="social-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continuer avec Google</span>
            </button>

            <button mat-stroked-button class="social-btn facebook-btn" (click)="loginWithFacebook()" [disabled]="loading()">
              <svg class="social-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continuer avec Facebook</span>
            </button>
          </div>

          <div class="divider-container">
            <mat-divider></mat-divider>
            <span class="divider-text">ou</span>
            <mat-divider></mat-divider>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="votre@email.com">
              <mat-icon matPrefix>email</mat-icon>
              @if (form.controls.email.hasError('required')) {
                <mat-error>Email requis</mat-error>
              }
              @if (form.controls.email.hasError('email')) {
                <mat-error>Email invalide</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.controls.password.hasError('required')) {
                <mat-error>Mot de passe requis</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="loading() || form.invalid">
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Se connecter
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p>Pas encore de compte ? <a routerLink="/auth/register">Inscrivez-vous</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #f5f5f5;
    }

    mat-card {
      width: 100%;
      max-width: 400px;
      padding: 1rem;
    }

    mat-card-header {
      margin-bottom: 1.5rem;
    }

    .social-login {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .social-btn {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 0.95rem;
      border-radius: 8px;
      border: 1px solid #dadce0;
      transition: background-color 0.2s, box-shadow 0.2s;
    }

    .social-btn:hover:not(:disabled) {
      background-color: #f8f9fa;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .social-icon {
      flex-shrink: 0;
    }

    .google-btn {
      color: #3c4043;
    }

    .facebook-btn {
      color: #1877F2;
    }

    .divider-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .divider-container mat-divider {
      flex: 1;
    }

    .divider-text {
      color: #757575;
      font-size: 0.875rem;
      text-transform: uppercase;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    button[type="submit"] {
      height: 48px;
      font-size: 1rem;
    }

    mat-card-actions {
      text-align: center;
      padding-top: 1rem;

      a {
        color: #1976d2;
        text-decoration: none;
        font-weight: 500;
      }
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = signal(false);
  error = signal<string | null>(null);
  hidePassword = signal(true);

  private googleClientId = environment['googleClientId'] as string || '';
  private facebookAppId = environment['facebookAppId'] as string || '';

  ngOnInit(): void {
    this.initGoogleSignIn();
    this.initFacebookSdk();
    this.handleOAuthRedirect();
  }

  private handleOAuthRedirect(): void {
    // Check if we have an id_token in the URL fragment (OAuth redirect)
    const fragment = window.location.hash.substring(1);
    if (fragment && fragment.includes('id_token=')) {
      const params = new URLSearchParams(fragment);
      const idToken = params.get('id_token');

      if (idToken) {
        // Clear the URL fragment
        window.history.replaceState({}, document.title, window.location.pathname);
        // Process the token
        this.handleOAuthLogin('GOOGLE', idToken);
      }
    }
  }

  private initGoogleSignIn(): void {
    if (!this.googleClientId) return;

    // Load Google Sign-In script dynamically
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
          client_id: this.googleClientId,
          callback: (response: any) => this.handleGoogleCredentialResponse(response)
        });
      }
    };
    document.head.appendChild(script);
  }

  private initFacebookSdk(): void {
    if (!this.facebookAppId) return;

    // Load Facebook SDK dynamically
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/fr_FR/sdk.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (typeof FB !== 'undefined') {
        FB.init({
          appId: this.facebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      }
    };
    document.head.appendChild(script);
  }

  loginWithGoogle(): void {
    if (!this.googleClientId) {
      this.error.set('Google Sign-In non configuré');
      return;
    }

    // Build OAuth URL for ID token
    const redirectUri = window.location.origin + '/auth/login';
    const nonce = Math.random().toString(36).substring(2);

    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      `client_id=${this.googleClientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      '&response_type=id_token' +
      '&scope=openid%20email%20profile' +
      `&nonce=${nonce}`;

    // Open popup
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      authUrl,
      'Google Sign-In',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for the redirect with token
    const checkPopup = setInterval(() => {
      try {
        if (popup?.closed) {
          clearInterval(checkPopup);
          return;
        }

        const popupUrl = popup?.location?.href;
        if (popupUrl && popupUrl.includes('id_token=')) {
          clearInterval(checkPopup);
          popup?.close();

          // Extract id_token from URL fragment
          const fragment = popupUrl.split('#')[1];
          const params = new URLSearchParams(fragment);
          const idToken = params.get('id_token');

          if (idToken) {
            this.ngZone.run(() => {
              this.handleOAuthLogin('GOOGLE', idToken);
            });
          }
        }
      } catch (e) {
        // Cross-origin error - popup still on Google domain
      }
    }, 500);
  }

  private handleGoogleCredentialResponse(response: any): void {
    if (response.credential) {
      this.ngZone.run(() => {
        this.handleOAuthLogin('GOOGLE', response.credential);
      });
    }
  }

  loginWithFacebook(): void {
    if (typeof FB === 'undefined' || !this.facebookAppId) {
      this.error.set('Facebook Login non disponible');
      return;
    }

    FB.login((response: any) => {
      if (response.authResponse) {
        this.ngZone.run(() => {
          this.handleOAuthLogin('FACEBOOK', response.authResponse.accessToken);
        });
      } else {
        this.ngZone.run(() => {
          this.error.set('Connexion Facebook annulée');
        });
      }
    }, { scope: 'email,public_profile' });
  }

  private handleOAuthLogin(provider: 'GOOGLE' | 'FACEBOOK', token: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService.oauthLogin({ provider, token }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || `Erreur de connexion ${provider}`);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur de connexion');
      }
    });
  }
}
