import { Address } from './user.model';

export interface CollectionRequest {
  id: number;
  userId: number;
  addressId?: number;
  address?: Address;
  driverId?: number;
  status: CollectionStatus;
  plannedDate?: string;
  plannedTimeStart?: string;
  plannedTimeEnd?: string;
  notes?: string;
  accessInstructions?: string;
  estimatedItemCount?: number;
  items?: CollectionItem[];
  requestedAt?: string;
  completedAt?: string;
}

export enum CollectionStatus {
  REQUESTED = 'REQUESTED',
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface CollectionItem {
  id?: number;
  deviceType: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  condition?: string;
  description?: string;
  estimatedValue?: number;
  deviceId?: number;
  scanned?: boolean;
}

export interface CreateCollectionRequest {
  addressId?: number;
  address?: Address;
  preferredDate?: string;
  preferredTimeStart?: string;
  preferredTimeEnd?: string;
  notes?: string;
  accessInstructions?: string;
  items?: CollectionItem[];
}

export interface DropOffPoint {
  id: number;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  openingHours?: string;
  isMainCenter?: boolean;
  active?: boolean;
}

export interface DropOff {
  id: number;
  userId?: number;
  dropOffPointId: number;
  dropOffPoint?: DropOffPoint;
  code: string;
  qrCodeUrl?: string;
  completed: boolean;
  declaredItemCount?: number;
  actualItemCount?: number;
  createdAt: string;
  completedAt?: string;
}

export interface CreateDropOffRequest {
  dropOffPointId: number;
  declaredItemCount?: number;
}
