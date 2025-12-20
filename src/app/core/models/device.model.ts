export interface Device {
  id: number;
  externalId?: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  condition: DeviceCondition;
  description?: string;
  estimatedValue?: number;
  actualValue?: number;
  userId?: number;
  collectionRequestId?: number;
  dropOffId?: number;
  analysed?: boolean;
  processed?: boolean;
  imageUrl?: string;
  createdAt?: string;
  analysedAt?: string;
  processedAt?: string;
}

export enum DeviceCondition {
  NEW = 'NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  BROKEN = 'BROKEN',
  DEAD = 'DEAD'
}

export interface DeviceDraft {
  id: number;
  userId: number;
  type: string;
  brand?: string;
  model?: string;
  condition?: DeviceCondition;
  description?: string;
  estimatedValueMin?: number;
  estimatedValueMax?: number;
  imageUrl?: string;
  converted?: boolean;
  deviceId?: number;
  createdAt?: string;
  expiresAt?: string;
}

export interface CreateDeviceDraftRequest {
  type: string;
  brand?: string;
  model?: string;
  condition?: DeviceCondition;
  description?: string;
  imageUrl?: string;
}

export interface DevicePrediction {
  predictedType: string;
  predictedBrand?: string;
  predictedModel?: string;
  predictedCondition: string;
  typeConfidence: number;
  conditionConfidence: number;
  estimatedValueMin: number;
  estimatedValueMax: number;
  refurbishable?: boolean;
  refurbishProbability?: number;
}
