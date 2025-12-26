import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/layout/header.component';
import { FooterComponent } from './shared/components/layout/footer.component';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);

  // Routes that use their own layout (no standard header/footer)
  private landingRoutes = ['/citoyen', '/association', '/entreprise'];

  isLandingPage = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => this.landingRoutes.some(route => event.urlAfterRedirects.startsWith(route)))
    ),
    { initialValue: this.landingRoutes.some(route => this.router.url.startsWith(route)) }
  );
}
