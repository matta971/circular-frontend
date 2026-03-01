import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard, technicianGuard, homeGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [homeGuard],
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'evaluation',
    loadChildren: () => import('./features/evaluation/evaluation.routes').then(m => m.EVALUATION_ROUTES)
  },
  {
    path: 'repairability',
    loadChildren: () => import('./features/repairability/repairability.routes').then(m => m.REPAIRABILITY_ROUTES)
  },
  {
    path: 'collection',
    canActivate: [authGuard],
    loadChildren: () => import('./features/collection/collection.routes').then(m => m.COLLECTION_ROUTES)
  },
  {
    path: 'deposit',
    loadChildren: () => import('./features/deposit/deposit.routes').then(m => m.DEPOSIT_ROUTES)
  },
  {
    path: 'wallet',
    canActivate: [authGuard],
    loadChildren: () => import('./features/wallet/wallet.routes').then(m => m.WALLET_ROUTES)
  },
  {
    path: 'tokens',
    canActivate: [authGuard],
    loadChildren: () => import('./features/tokens/tokens.routes').then(m => m.TOKENS_ROUTES)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: 'marketplace',
    loadChildren: () => import('./features/marketplace/marketplace.routes').then(m => m.MARKETPLACE_ROUTES)
  },
  {
    path: 'certificates',
    loadChildren: () => import('./features/certificates/certificates.routes').then(m => m.CERTIFICATES_ROUTES)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notifications/notifications.routes').then(m => m.NOTIFICATIONS_ROUTES)
  },
  {
    path: 'ops',
    canActivate: [technicianGuard],
    loadChildren: () => import('./features/partner-ops/partner-ops.routes').then(m => m.PARTNER_OPS_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  // Public certificate verification
  {
    path: 'verify/:certificateNumber',
    loadComponent: () => import('./features/certificates/certificate-verify-direct/certificate-verify-direct.component').then(m => m.CertificateVerifyDirectComponent),
    title: 'Vérification de certificat - Circular Electronics'
  },
  // Landing pages (public)
  {
    path: 'citoyen',
    loadComponent: () => import('./features/landing/citoyen/citoyen-landing.component').then(m => m.CitoyenLandingComponent),
    title: 'Citoyen - Circular Electronics'
  },
  {
    path: 'association',
    loadComponent: () => import('./features/landing/association/association-landing.component').then(m => m.AssociationLandingComponent),
    title: 'Association - Circular Electronics'
  },
  {
    path: 'entreprise',
    loadComponent: () => import('./features/landing/entreprise/entreprise-landing.component').then(m => m.EntrepriseLandingComponent),
    title: 'Entreprise - Circular Electronics'
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact - Circular Electronics'
  },
  // Actor redirects (→ existing landing pages)
  { path: 'actors/individuals', redirectTo: '/citoyen' },
  { path: 'actors/associations', redirectTo: '/association' },
  { path: 'actors/companies', redirectTo: '/entreprise' },
  { path: 'actors/communities', redirectTo: '/entreprise' },
  { path: 'contact/institutional', redirectTo: '/contact' },
  // About pages
  {
    path: 'about/mission',
    loadComponent: () => import('./features/pages/about/mission.component').then(m => m.MissionComponent),
    title: 'Mission - Circular Electronics'
  },
  {
    path: 'about/vision',
    loadComponent: () => import('./features/pages/about/vision.component').then(m => m.VisionComponent),
    title: 'Vision - Circular Electronics'
  },
  {
    path: 'about/governance',
    loadComponent: () => import('./features/pages/about/governance.component').then(m => m.GovernanceComponent),
    title: 'Gouvernance - Circular Electronics'
  },
  {
    path: 'about/partners',
    loadComponent: () => import('./features/pages/about/partners.component').then(m => m.PartnersComponent),
    title: 'Partenaires - Circular Electronics'
  },
  // Trust & Regulation pages
  {
    path: 'trust/traceability',
    loadComponent: () => import('./features/pages/trust/traceability.component').then(m => m.TraceabilityComponent),
    title: 'Traçabilité - Circular Electronics'
  },
  {
    path: 'trust/rep-compliance',
    loadComponent: () => import('./features/pages/trust/rep-compliance.component').then(m => m.RepComplianceComponent),
    title: 'Conformité REP - Circular Electronics'
  },
  {
    path: 'trust/methodology',
    loadComponent: () => import('./features/pages/trust/methodology.component').then(m => m.MethodologyComponent),
    title: 'Méthodologie - Circular Electronics'
  },
  {
    path: 'trust/data-security',
    loadComponent: () => import('./features/pages/trust/data-security.component').then(m => m.DataSecurityComponent),
    title: 'Sécurité des données - Circular Electronics'
  },
  // Resources pages
  {
    path: 'resources/blog',
    loadComponent: () => import('./features/pages/resources/blog.component').then(m => m.BlogComponent),
    title: 'Blog - Circular Electronics'
  },
  {
    path: 'resources/studies',
    loadComponent: () => import('./features/pages/resources/studies.component').then(m => m.StudiesComponent),
    title: 'Études & Chiffres - Circular Electronics'
  },
  {
    path: 'resources/press',
    loadComponent: () => import('./features/pages/resources/press.component').then(m => m.PressComponent),
    title: 'Presse - Circular Electronics'
  },
  {
    path: 'resources/faq',
    loadComponent: () => import('./features/pages/resources/faq.component').then(m => m.FaqComponent),
    title: 'FAQ Réglementaire - Circular Electronics'
  },
  // Legal pages
  {
    path: 'legal/terms',
    loadComponent: () => import('./features/pages/legal/terms.component').then(m => m.TermsComponent),
    title: 'Mentions Légales - Circular Electronics'
  },
  {
    path: 'legal/privacy',
    loadComponent: () => import('./features/pages/legal/privacy.component').then(m => m.PrivacyComponent),
    title: 'Politique de Confidentialité - Circular Electronics'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
