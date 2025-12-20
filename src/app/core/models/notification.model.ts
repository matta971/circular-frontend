// Notification Models

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  readAt?: string;
  actionUrl?: string;
  imageUrl?: string;
  createdAt: string;
}

export enum NotificationType {
  // Collection & Deposit
  COLLECTION_CONFIRMED = 'COLLECTION_CONFIRMED',
  COLLECTION_SCHEDULED = 'COLLECTION_SCHEDULED',
  COLLECTION_COMPLETED = 'COLLECTION_COMPLETED',
  COLLECTION_CANCELLED = 'COLLECTION_CANCELLED',
  DROPOFF_CONFIRMED = 'DROPOFF_CONFIRMED',
  DROPOFF_COMPLETED = 'DROPOFF_COMPLETED',

  // Evaluation & Valuation
  EVALUATION_COMPLETE = 'EVALUATION_COMPLETE',
  VALUATION_READY = 'VALUATION_READY',

  // Rewards & Wallet
  REWARD_EARNED = 'REWARD_EARNED',
  REWARD_PAID = 'REWARD_PAID',
  WALLET_CREDITED = 'WALLET_CREDITED',
  WALLET_DEBITED = 'WALLET_DEBITED',

  // Marketplace
  LISTING_PUBLISHED = 'LISTING_PUBLISHED',
  LISTING_EXPIRED = 'LISTING_EXPIRED',
  LISTING_SOLD = 'LISTING_SOLD',
  NEW_OFFER = 'NEW_OFFER',
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_PAID = 'ORDER_PAID',
  ORDER_SHIPPED = 'ORDER_SHIPPED',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',

  // Disputes
  DISPUTE_OPENED = 'DISPUTE_OPENED',
  DISPUTE_RESPONSE = 'DISPUTE_RESPONSE',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',

  // Certificates
  CERTIFICATE_ISSUED = 'CERTIFICATE_ISSUED',
  CERTIFICATE_READY = 'CERTIFICATE_READY',

  // System
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
  SECURITY_ALERT = 'SECURITY_ALERT'
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS'
}

export interface NotificationPreferences {
  userId: number;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  preferences: NotificationTypePreference[];
}

export interface NotificationTypePreference {
  type: NotificationType;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
}

// Request types
export interface UpdatePreferencesRequest {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  smsEnabled?: boolean;
  typePreferences?: NotificationTypePreference[];
}

export interface SendNotificationRequest {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channels?: NotificationChannel[];
}
