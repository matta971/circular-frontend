// P2P Marketplace Models

export interface P2PListing {
  id: number;
  sellerId: number;
  sellerName?: string;
  sellerRating?: number;
  deviceId?: number;
  title: string;
  description?: string;
  category: DeviceCategory;
  brand?: string;
  model?: string;
  condition: ListingCondition;
  price: number;
  negotiable: boolean;
  images: string[];
  status: ListingStatus;
  viewCount: number;
  favoriteCount: number;
  location?: string;
  shippingAvailable: boolean;
  shippingCost?: number;
  meetupAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
}

export enum DeviceCategory {
  SMARTPHONE = 'SMARTPHONE',
  TABLET = 'TABLET',
  LAPTOP = 'LAPTOP',
  DESKTOP = 'DESKTOP',
  SMARTWATCH = 'SMARTWATCH',
  HEADPHONES = 'HEADPHONES',
  GAMING_CONSOLE = 'GAMING_CONSOLE',
  CAMERA = 'CAMERA',
  OTHER = 'OTHER'
}

export enum ListingCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  FOR_PARTS = 'FOR_PARTS'
}

export enum ListingStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface CreateListingRequest {
  deviceId?: number;
  title: string;
  description?: string;
  category: DeviceCategory;
  brand?: string;
  model?: string;
  condition: ListingCondition;
  price: number;
  negotiable?: boolean;
  images?: string[];
  shippingAvailable?: boolean;
  shippingCost?: number;
  meetupAvailable?: boolean;
  location?: string;
}

export interface ListingSearchParams {
  query?: string;
  category?: DeviceCategory;
  condition?: ListingCondition;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  shippingAvailable?: boolean;
  location?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'date_desc' | 'popularity';
  page?: number;
  size?: number;
}

// Orders
export interface P2POrder {
  id: number;
  orderNumber: string;
  listingId: number;
  listing?: P2PListing;
  buyerId: number;
  buyerName?: string;
  sellerId: number;
  sellerName?: string;
  price: number;
  shippingCost?: number;
  totalAmount: number;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  shippingAddress?: ShippingAddress;
  meetupLocation?: string;
  meetupDate?: string;
  notes?: string;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export enum OrderStatus {
  CREATED = 'CREATED',           // Backend: CREATED
  PENDING_PAYMENT = 'PENDING_PAYMENT', // Alias for CREATED
  PAID = 'PAID',
  PAID_ESCROW = 'PAID_ESCROW',   // Backend: PAID_ESCROW
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED'
}

export enum DeliveryMethod {
  SHIPPING = 'SHIPPING',
  MEETUP = 'MEETUP'
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CreateOrderRequest {
  listingId: number;
  deliveryMethod: DeliveryMethod;
  shippingAddress?: ShippingAddress;
  meetupLocation?: string;
  meetupDate?: string;
  notes?: string;
}

// Payments
export interface PaymentTransaction {
  id: number;
  transactionRef: string;
  orderId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  escrowReleaseDate?: string;
  createdAt: string;
  completedAt?: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  IN_ESCROW = 'IN_ESCROW',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

// Shipments
export interface Shipment {
  id: number;
  orderId: number;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  labelUrl?: string;
  status: ShipmentStatus;
  estimatedDelivery?: string;
  shippedAt?: string;
  deliveredAt?: string;
  weight?: number;
  dimensions?: string;
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  LABEL_CREATED = 'LABEL_CREATED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  EXCEPTION = 'EXCEPTION'
}

// Disputes
export interface P2PDispute {
  id: number;
  orderId: number;
  order?: P2POrder;
  initiatorId: number;
  initiatorType: 'BUYER' | 'SELLER';
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  evidence?: DisputeEvidence[];
  resolution?: string;
  refundAmount?: number;
  createdAt: string;
  resolvedAt?: string;
}

export enum DisputeReason {
  ITEM_NOT_RECEIVED = 'ITEM_NOT_RECEIVED',
  ITEM_NOT_AS_DESCRIBED = 'ITEM_NOT_AS_DESCRIBED',
  ITEM_DAMAGED = 'ITEM_DAMAGED',
  WRONG_ITEM = 'WRONG_ITEM',
  BUYER_REMORSE = 'BUYER_REMORSE',
  SELLER_UNRESPONSIVE = 'SELLER_UNRESPONSIVE',
  OTHER = 'OTHER'
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  SELLER_RESPONSE = 'SELLER_RESPONSE',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED_BUYER = 'RESOLVED_BUYER',
  RESOLVED_SELLER = 'RESOLVED_SELLER',
  RESOLVED_SPLIT = 'RESOLVED_SPLIT',
  CLOSED = 'CLOSED'
}

export interface DisputeEvidence {
  id: number;
  type: 'IMAGE' | 'DOCUMENT' | 'TEXT';
  url?: string;
  description: string;
  uploadedBy: number;
  uploadedAt: string;
}

export interface CreateDisputeRequest {
  orderId: number;
  reason: DisputeReason;
  description: string;
  evidenceUrls?: string[];
}

// Seller Stats
export interface SellerStats {
  totalListings: number;
  activeListings: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount: number;
  responseRate: number;
  responseTime: string;
}
