/**
 * Niveaux de tokens basés sur le cumul de tokens gagnés.
 */
export enum TokenLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

/**
 * Libellés et styles pour les niveaux de tokens.
 */
export const TOKEN_LEVEL_CONFIG: Record<TokenLevel, { label: string; color: string; icon: string }> = {
  [TokenLevel.BRONZE]: { label: 'Bronze', color: '#CD7F32', icon: 'military_tech' },
  [TokenLevel.SILVER]: { label: 'Argent', color: '#C0C0C0', icon: 'military_tech' },
  [TokenLevel.GOLD]: { label: 'Or', color: '#FFD700', icon: 'emoji_events' },
  [TokenLevel.PLATINUM]: { label: 'Platine', color: '#E5E4E2', icon: 'workspace_premium' }
};

/**
 * Solde de tokens d'un utilisateur.
 */
export interface TokenBalance {
  userId: number;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  level: TokenLevel;
  levelDisplayName: string;
  discountRate: number;
  tokensToNextLevel: number;
  progressToNextLevel: number;
  nextLevel: TokenLevel | null;
  updatedAt: string;
}

/**
 * Types de transactions de tokens.
 */
export enum TokenTransactionType {
  EVALUATION_CREDIT = 'EVALUATION_CREDIT',
  COLLECTION_BONUS = 'COLLECTION_BONUS',
  REFERRAL_BONUS = 'REFERRAL_BONUS',
  LOYALTY_BONUS = 'LOYALTY_BONUS',
  ADMIN_CREDIT = 'ADMIN_CREDIT',
  PROMO_CREDIT = 'PROMO_CREDIT',
  VOUCHER_REDEMPTION = 'VOUCHER_REDEMPTION',
  MARKETPLACE_DISCOUNT = 'MARKETPLACE_DISCOUNT',
  SHIPPING_DISCOUNT = 'SHIPPING_DISCOUNT',
  PREMIUM_ACCESS = 'PREMIUM_ACCESS',
  ADMIN_DEBIT = 'ADMIN_DEBIT',
  EXPIRATION = 'EXPIRATION'
}

/**
 * Transaction de tokens.
 */
export interface TokenTransaction {
  id: number;
  userId: number;
  transactionType: TokenTransactionType;
  transactionTypeLabel: string;
  amount: number;
  balanceAfter: number;
  description: string;
  referenceType: string;
  referenceId: number;
  evaluationId?: number;
  deviceId?: number;
  voucherId?: number;
  isCredit: boolean;
  createdAt: string;
}

/**
 * Types de vouchers.
 */
export enum VoucherType {
  REPAIR_DISCOUNT = 'REPAIR_DISCOUNT',
  DIAGNOSTIC_DISCOUNT = 'DIAGNOSTIC_DISCOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
  MARKETPLACE_DISCOUNT = 'MARKETPLACE_DISCOUNT',
  WARRANTY_EXTENSION = 'WARRANTY_EXTENSION',
  PARTNER_CREDIT = 'PARTNER_CREDIT'
}

/**
 * Statuts de vouchers.
 */
export enum VoucherStatus {
  ACTIVE = 'ACTIVE',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

/**
 * Voucher échangé contre des tokens.
 */
export interface Voucher {
  id: number;
  code: string;
  userId: number;
  partnerId?: number;
  partnerName?: string;
  voucherType: VoucherType;
  voucherTypeLabel: string;
  status: VoucherStatus;
  statusLabel: string;
  tokensCost: number;
  value: number;
  valueUnit: string;
  valueDisplay: string;
  description: string;
  termsAndConditions?: string;
  isUsable: boolean;
  createdAt: string;
  expiresAt: string;
  redeemedAt?: string;
  partnerOrderId?: number;
  daysUntilExpiry: number;
}

/**
 * Template de voucher disponible à l'échange.
 */
export interface VoucherTemplate {
  id: number;
  name: string;
  description: string;
  voucherType: VoucherType;
  voucherTypeLabel: string;
  tokensCost: number;
  value: number;
  valueUnit: string;
  valueDisplay: string;
  minimumLevel: TokenLevel;
  minimumLevelDisplay: string;
  partnerId?: number;
  partnerName?: string;
  validityDays: number;
  termsAndConditions?: string;
  isAvailable: boolean;
  imageUrl?: string;
  displayOrder: number;
}

/**
 * Statistiques globales des tokens (admin).
 */
export interface TokenStatistics {
  totalTokensInCirculation: number;
  totalTokensEarned: number;
  totalTokensSpent: number;
  burnRate: number;
  usersByLevel: Record<TokenLevel, number>;
}

/**
 * Réponse paginée.
 */
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
