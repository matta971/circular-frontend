import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public pages — prerender for SEO
  { path: '', renderMode: RenderMode.Server },
  { path: 'citoyen', renderMode: RenderMode.Server },
  { path: 'association', renderMode: RenderMode.Server },
  { path: 'entreprise', renderMode: RenderMode.Server },
  { path: 'contact', renderMode: RenderMode.Server },
  { path: 'about/**', renderMode: RenderMode.Server },
  { path: 'trust/**', renderMode: RenderMode.Server },
  { path: 'resources/**', renderMode: RenderMode.Server },
  { path: 'legal/**', renderMode: RenderMode.Server },
  { path: 'marketplace', renderMode: RenderMode.Server },
  { path: 'marketplace/:id', renderMode: RenderMode.Server },
  { path: 'verify/:certificateNumber', renderMode: RenderMode.Server },

  // Auth & user pages — client-side only (no SSR needed)
  { path: 'auth/**', renderMode: RenderMode.Client },
  { path: 'collection/**', renderMode: RenderMode.Client },
  { path: 'deposit/**', renderMode: RenderMode.Client },
  { path: 'wallet/**', renderMode: RenderMode.Client },
  { path: 'tokens/**', renderMode: RenderMode.Client },
  { path: 'profile/**', renderMode: RenderMode.Client },
  { path: 'notifications/**', renderMode: RenderMode.Client },
  { path: 'ops/**', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },

  // Default — server render
  { path: '**', renderMode: RenderMode.Server }
];
