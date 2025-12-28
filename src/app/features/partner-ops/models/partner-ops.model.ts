/**
 * Partner Ops Dashboard DTO
 */
export interface PartnerOpsDashboard {
  partnerId: number;
  collectionsToReceive: number;
  dropOffsToReceive: number;
  devicesToFinalize: number;
  openDisputes: number;
  collectionsReceivedToday: number;
  dropOffsReceivedToday: number;
  devicesReceivedToday: number;
  devicesFinalizedToday: number;
  totalCollectionsLast30Days: number;
  totalDropOffsLast30Days: number;
  totalDevicesLast30Days: number;
  totalCertificatesLast30Days: number;
  generatedAt: string;
}

/**
 * Collection Request for Partner Ops
 */
export interface OpsCollection {
  id: number;
  externalId: string;
  userId: number;
  status: string;
  address: string;
  city: string;
  postalCode: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  itemCount: number;
  notes: string;
  createdAt: string;
  collectedAt: string;
  receivedAt: string;
}

/**
 * Drop-off for Partner Ops
 */
export interface OpsDropOff {
  id: number;
  userId: number;
  dropOffPointId: number;
  dropOffPointName: string;
  code: string;
  qrCodeUrl: string;
  status: string;
  declaredItemCount: number;
  actualItemCount: number | null;
  createdAt: string;
  droppedAt: string;
  receivedAt: string;
  completedAt: string;
}

/**
 * Device statuses for Partner Ops
 */
export type DeviceStatus =
  | 'REGISTERED'
  | 'COLLECTED'
  | 'DROPPED'
  | 'RECEIVED'
  | 'ON_HOLD'
  | 'UNDER_REVIEW'
  | 'DIAGNOSED'
  | 'DECISION_DRAFTED'
  | 'DECISION_CONFIRMED'
  | 'IN_EXECUTION'
  | 'TRANSFER_PREPARED'
  | 'TRANSFER_SENT'
  | 'TRANSFER_RECEIVED'
  | 'THIRD_PARTY_PROCESSING'
  | 'CLOSED'
  | 'CANCELLED'
  | 'FINALIZED'; // legacy

/**
 * Device for Partner Ops
 */
export interface OpsDevice {
  id: number;
  externalId: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  condition: string;
  description: string;
  estimatedValue: number;
  actualValue: number;
  userId: number;
  partnerId: number;
  collectionRequestId: number;
  dropOffId: number;
  status: DeviceStatus;
  imageUrl: string;
  createdAt: string;
  analysedAt: string;
  receivedAt: string;
  finalizedAt: string;

  // Workflow flags
  disputeOpen: boolean;
  onHold: boolean;
  holdReason: string;

  // Diagnosis data
  diagnosisNotes: string;
  diagnosedCondition: string;
  diagnosedValue: number;

  // Decision data
  draftDecision: string;
  confirmedDecision: string;
  decisionChannel: string;
  decisionNotes: string;

  // Third party transfer
  thirdPartyTransferId: number;

  // Timestamps
  reviewStartedAt: string;
  diagnosedAt: string;
  decisionDraftedAt: string;
  decisionConfirmedAt: string;
  executionStartedAt: string;
  closedAt: string;
}

/**
 * Device finalization request
 */
export interface FinalizeDeviceRequest {
  outcome: 'REEMPLOI_REVENTE' | 'MPIR_RECYCLE' | 'DESTRUCTION_SANS_VALEUR';
  realizedValueEur: number;
  channel: string;
  details: string;
}

/**
 * Device finalization result
 */
export interface DeviceFinalization {
  id: number;
  deviceId: number;
  outcome: string;
  realizedValueEur: number;
  channel: string;
  details: string;
  finalizedAt: string;
  createdAt: string;
}

/**
 * Device statistics for partner
 */
export interface OpsDeviceStats {
  pendingFinalization: number;
  received: number;
  diagnosed: number;
  finalized: number;
  receivedToday: number;
  finalizedToday: number;
  receivedLast30Days: number;
  finalizedLast30Days: number;
  generatedAt: string;
}

/**
 * Receive collection request
 */
export interface ReceiveCollectionRequest {
  notes?: string;
}

/**
 * Receive drop-off request
 */
export interface ReceiveDropOffRequest {
  actualItemCount?: number;
  notes?: string;
}

// ========== WORKFLOW DTOs ==========

/**
 * Update diagnosis request
 */
export interface DiagnosisUpdateRequest {
  diagnosedCondition?: string;
  diagnosedValue?: number;
  diagnosisNotes?: string;
}

/**
 * Decision draft request
 */
export interface DecisionDraftRequest {
  outcome: 'REEMPLOI_REVENTE' | 'REPARATION' | 'MPIR_RECYCLE' | 'DESTRUCTION_SANS_VALEUR';
  channel: 'INTERNAL' | 'MARKETPLACE' | 'PARTNER' | 'DONATION' | 'THIRD_PARTY';
  notes?: string;
}

/**
 * Close execution request
 */
export interface CloseExecutionRequest {
  realizedValue?: number;
  proofUrl?: string;
  notes?: string;
}

/**
 * Prepare transfer request
 */
export interface PrepareTransferRequest {
  thirdPartyId?: number;
  thirdPartyName: string;
  thirdPartyType: string;
  carrierName?: string;
  trackingNumber?: string;
  shippingReference?: string;
  expectedDeliveryAt?: string;
  notes?: string;
}

/**
 * Mark sent request
 */
export interface MarkSentRequest {
  trackingNumber?: string;
  proofOfShipmentUrl?: string;
  notes?: string;
}

/**
 * Mark received request
 */
export interface MarkReceivedRequest {
  proofOfReceiptUrl?: string;
  externalReference?: string;
  notes?: string;
}

/**
 * Attach proof request
 */
export interface AttachProofRequest {
  certificateUrl?: string;
  realizedValue?: number;
  notes?: string;
}

/**
 * Open dispute request
 */
export interface OpenDisputeRequest {
  type: DisputeType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  summary: string;
  description?: string;
}

/**
 * Resolve dispute request
 */
export interface ResolveDisputeRequest {
  resolution: 'RESOLVED_FOR_CITIZEN' | 'RESOLVED_FOR_PARTNER' | 'RESOLVED_MUTUAL' | 'CANCELLED';
  notes?: string;
}

/**
 * Dispute types
 */
export type DisputeType =
  | 'CONDITION_MISMATCH'
  | 'DEVICE_MISMATCH'
  | 'MISSING_PARTS'
  | 'UNDISCLOSED_DAMAGE'
  | 'VALUATION_DISPUTE'
  | 'FUNCTIONALITY_ISSUE'
  | 'REWARD_DISPUTE'
  | 'THIRD_PARTY_ISSUE'
  | 'OTHER';

/**
 * Dispute status
 */
export type DisputeStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'PENDING_CITIZEN'
  | 'PENDING_THIRD_PARTY'
  | 'RESOLVED_FOR_CITIZEN'
  | 'RESOLVED_FOR_PARTNER'
  | 'RESOLVED_MUTUAL'
  | 'CANCELLED';

/**
 * Device dispute
 */
export interface DeviceDispute {
  id: number;
  deviceId: number;
  partnerId: number;
  type: DisputeType;
  status: DisputeStatus;
  priority: string;
  summary: string;
  description: string;
  resolutionNotes: string;
  deviceStatusAtOpen: string;
  openedByUserId: number;
  resolvedByUserId: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string;
}

/**
 * Third party transfer
 */
export interface ThirdPartyTransfer {
  id: number;
  deviceId: number;
  partnerId: number;
  thirdPartyId: number;
  thirdPartyName: string;
  thirdPartyType: string;
  carrierName: string;
  trackingNumber: string;
  shippingReference: string;
  proofOfShipmentUrl: string;
  proofOfReceiptUrl: string;
  processingCertificateUrl: string;
  expectedDeliveryAt: string;
  notes: string;
  externalReference: string;
  status: string;
  createdAt: string;
  sentAt: string;
  receivedAt: string;
  processingStartedAt: string;
  completedAt: string;
}
