# Circular Electronics - Frontend

Application web Angular pour la plateforme de recyclage électronique intelligent.

## Stack technique

- **Angular 20** (standalone components)
- **Angular Material** (UI components)
- **TailwindCSS** (styling)
- **RxJS** (reactive programming)
- **TypeScript 5.x**

## Structure du projet

```
src/app/
├── core/                      # Services globaux, guards, interceptors
│   ├── guards/
│   │   └── auth.guard.ts      # authGuard, adminGuard, driverGuard
│   └── services/
│       ├── auth.service.ts
│       ├── evaluation.service.ts
│       ├── marketplace.service.ts
│       ├── device-autocomplete.service.ts
│       └── ...
├── shared/                    # Composants réutilisables
│   ├── components/
│   └── pipes/
├── features/                  # Modules fonctionnels
│   ├── auth/                  # Login, register, forgot-password
│   ├── home/                  # Page d'accueil
│   ├── evaluation/            # Évaluation d'appareils
│   │   ├── evaluation.component.ts    # Formulaire complet
│   │   └── my-evaluations/            # Historique
│   ├── marketplace/           # Marketplace P2P
│   │   ├── listings/          # Liste annonces
│   │   ├── listing-detail/    # Détail annonce
│   │   ├── create-listing/    # Créer annonce
│   │   ├── orders/            # Mes commandes
│   │   ├── order-detail/      # Détail commande
│   │   ├── my-listings/       # Mes annonces
│   │   ├── favorites/         # Favoris
│   │   ├── payment-dialog/    # Paiement
│   │   └── dispute-dialog/    # Litige
│   ├── admin/                 # Administration
│   │   ├── dashboard/         # Vue d'ensemble
│   │   ├── users/             # Gestion utilisateurs
│   │   ├── devices/           # Gestion appareils
│   │   ├── collections/       # Gestion collectes
│   │   ├── repair-partners/   # Partenaires réparateurs
│   │   ├── scoring/           # Règles de scoring
│   │   └── kpi-dashboard/     # Dashboard KPIs
│   └── driver/                # Interface chauffeur
└── app.routes.ts              # Routes principales
```

## Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm start
# ou
ng serve

# Build production
npm run build
```

## Variables d'environnement

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Routes principales

| Route | Composant | Guard | Description |
|-------|-----------|-------|-------------|
| `/` | HomeComponent | - | Page d'accueil |
| `/auth/login` | LoginComponent | guestGuard | Connexion |
| `/auth/register` | RegisterComponent | guestGuard | Inscription |
| `/evaluation` | EvaluationComponent | authGuard | Nouvelle évaluation |
| `/evaluation/my-evaluations` | MyEvaluationsComponent | authGuard | Historique |
| `/marketplace` | ListingsComponent | - | Annonces |
| `/marketplace/listing/:id` | ListingDetailComponent | - | Détail annonce |
| `/marketplace/create` | CreateListingComponent | authGuard | Créer annonce |
| `/marketplace/orders` | OrdersComponent | authGuard | Mes commandes |
| `/admin` | AdminLayoutComponent | adminGuard | Administration |
| `/admin/repair-partners` | PartnerListComponent | adminGuard | Partenaires |
| `/admin/scoring` | RulesetListComponent | adminGuard | Scoring |
| `/admin/kpis` | KpiOverviewComponent | adminGuard | KPIs |

## Fonctionnalités principales

### Module Évaluation

- **Formulaire multi-étapes** : Type, marque, modèle, état, photos
- **Vision AI** : Upload photo pour détection automatique
- **NLP** : Description texte libre analysée par IA
- **Autocomplétion** : Suggestions marque/modèle en temps réel
- **Enrichissement** : Prix marché (eBay), réparabilité (iFixit)
- **Résultat** : Score sur 100, décision, offre de reprise

### Module Marketplace

- **Annonces** : Liste filtrable avec pagination
- **Détail** : Photos, description, vendeur, actions
- **Achat** : Paiement escrow, confirmation livraison
- **Vente** : Créer annonce, gérer mes annonces
- **Litiges** : Ouvrir et suivre les disputes

### Module Admin

#### Partenaires Réparateurs
- Liste avec filtres (statut, type, ville, QualiRépar)
- Création/édition avec formulaire complet
- Import CSV bulk
- Statistiques et carte

#### Scoring
- Liste des versions (rule sets)
- Éditeur de poids visuel (sliders)
- Éditeur de paramètres
- Activation/clonage de versions

#### Dashboard KPIs
- Métriques volume (évaluations, collectes, devices)
- Métriques revenue (GMV, commissions, wallets)
- Métriques qualité (temps traitement, conversion)
- Sélecteur de période

## Guards d'authentification

```typescript
// Vérifie si l'utilisateur est connecté
export const authGuard: CanActivateFn = () => {
  return inject(AuthService).isAuthenticated()
    ? true
    : inject(Router).navigate(['/auth/login']), false;
};

// Vérifie si l'utilisateur est admin
export const adminGuard: CanActivateFn = () => {
  return inject(AuthService).isAdmin()
    ? true
    : inject(Router).navigate(['/']), false;
};

// Vérifie si l'utilisateur est chauffeur
export const driverGuard: CanActivateFn = () => {
  return inject(AuthService).isDriver()
    ? true
    : inject(Router).navigate(['/']), false;
};
```

## Services principaux

### EvaluationService

```typescript
// Créer une évaluation
createEvaluation(request: CreateEvaluationRequest): Observable<Evaluation>

// Enrichir avec prix marché
enrichWithMarketPrice(brand: string, model: string): Observable<MarketPriceData>

// Enrichir avec réparabilité
enrichWithRepairability(brand: string, model: string): Observable<RepairabilityData>
```

### DeviceAutocompleteService

```typescript
// Rechercher des appareils
search(query: string, category?: string): Observable<DeviceSuggestion[]>

// Obtenir les détails d'un appareil
getDeviceDetails(id: string): Observable<DeviceDetails>
```

### MarketplaceService

```typescript
// Lister les annonces
getListings(filters?: ListingFilters): Observable<Page<Listing>>

// Créer une commande
createOrder(listingId: number): Observable<Order>

// Payer une commande (escrow)
payOrder(orderId: number, paymentMethod: string): Observable<Order>
```

## Développement

### Tests unitaires

```bash
ng test
```

### Tests E2E

```bash
ng e2e
```

### Linting

```bash
ng lint
```

### Build

```bash
# Development
ng build

# Production
ng build --configuration=production
```

## Design System

L'application utilise **Angular Material** avec un thème personnalisé aux couleurs Circular Electronics :

- **Primary** : Vert (#22c55e)
- **Accent** : Bleu (#3b82f6)
- **Warn** : Rouge (#ef4444)

Les composants supplémentaires utilisent **TailwindCSS** pour le styling utilitaire.

## API Backend

L'application consomme l'API Gateway sur le port 8080.

Voir la documentation backend dans `circular-backend/docs/specs/` pour les détails des endpoints.
