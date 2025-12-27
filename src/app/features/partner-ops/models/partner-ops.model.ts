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
  status: string;
  imageUrl: string;
  createdAt: string;
  analysedAt: string;
  receivedAt: string;
  finalizedAt: string;
}

/**
 * Device finalization request
 */
export interface FinalizeDeviceRequest {
  outcome: 'REUSE' | 'REPAIR' | 'RECYCLE';
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
