// Certificate and Traceability Models

export interface Certificate {
  id: number;
  certificateNumber: string;
  type: CertificateType;
  deviceId: number;
  device?: CertificateDevice;
  userId?: number;
  partnerId?: number;
  issuedAt: string;
  expiresAt?: string;
  status: CertificateStatus;
  pdfUrl?: string;
  blockchainHash?: string;
  verificationUrl?: string;
  metadata?: CertificateMetadata;
}

export enum CertificateType {
  RECYCLING = 'RECYCLING',
  DONATION = 'DONATION',
  REFURBISHMENT = 'REFURBISHMENT',
  DESTRUCTION = 'DESTRUCTION',
  TRACEABILITY = 'TRACEABILITY'
}

export enum CertificateStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  VERIFIED = 'VERIFIED',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED'
}

export interface CertificateDevice {
  id: number;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  condition?: string;
}

export interface CertificateMetadata {
  weight?: number;
  materialsRecovered?: MaterialRecovered[];
  environmentalImpact?: EnvironmentalImpact;
  processingCenter?: string;
  processingDate?: string;
  donationRecipient?: string;
  donationPurpose?: string;
}

export interface MaterialRecovered {
  material: string;
  quantity: number;
  unit: string;
}

export interface EnvironmentalImpact {
  co2SavedKg: number;
  waterSavedLiters?: number;
  energySavedKwh?: number;
  wastePreventedKg?: number;
}

// Traceability
export interface TraceabilityEvent {
  id: number;
  deviceId: number;
  eventType: TraceabilityEventType;
  description: string;
  location?: string;
  performedBy?: string;
  performedByRole?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  previousEventId?: number;
  blockchainTxId?: string;
}

export enum TraceabilityEventType {
  COLLECTION = 'COLLECTION',
  DROPOFF = 'DROPOFF',
  RECEPTION = 'RECEPTION',
  DIAGNOSTIC = 'DIAGNOSTIC',
  REFURBISHMENT = 'REFURBISHMENT',
  QUALITY_CHECK = 'QUALITY_CHECK',
  LISTING = 'LISTING',
  SALE = 'SALE',
  SHIPPING = 'SHIPPING',
  DELIVERY = 'DELIVERY',
  RECYCLING = 'RECYCLING',
  DONATION = 'DONATION',
  DESTRUCTION = 'DESTRUCTION'
}

export interface DeviceTraceability {
  deviceId: number;
  device: CertificateDevice;
  events: TraceabilityEvent[];
  certificates: Certificate[];
  currentStatus: string;
  totalEventsCount: number;
}

export interface CertificateVerification {
  valid: boolean;
  certificate?: Certificate;
  verifiedAt: string;
  blockchainVerified?: boolean;
  message: string;
}

// Request types
export interface IssueCertificateRequest {
  deviceId: number;
  type: CertificateType;
  metadata?: CertificateMetadata;
}

export interface VerifyCertificateRequest {
  certificateNumber: string;
}
