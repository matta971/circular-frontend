export interface RepairabilityAssessment {
  repairabilityIndex: number;
  repairabilityGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  details: RepairabilityDetails;
  faultDiagnoses: FaultDiagnosis[];
  repairPartners: RepairPartner[];
  recommendation: RepairRecommendation;
}

export interface RepairabilityDetails {
  documentationScore: number;
  documentationComment: string;
  disassemblyScore: number;
  disassemblyComment: string;
  sparePartsScore: number;
  sparePartsComment: string;
  sparePartsAvailabilityYears: number;
  sparePartsPriceScore: number;
  sparePartsPriceComment: string;
  specificCriteriaScore: number;
  specificCriteriaComment: string;
}

export interface FaultDiagnosis {
  faultType: string;
  faultName: string;
  description: string;
  probability: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedRepairCost: number;
  estimatedRepairTimeMinutes: number;
  selfRepairable: boolean;
  repairDifficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
}

export interface RepairPartner {
  id: number;
  name: string;
  type: 'AUTHORIZED' | 'INDEPENDENT' | 'SELF_REPAIR';
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  estimatedDelayDays: number;
  certifications: string[];
  warrantyProvided: boolean;
  phoneNumber: string;
  website: string;
}

export interface RepairRecommendation {
  action: 'REPAIR' | 'SELL_AS_IS' | 'RECYCLE' | 'REFURBISH';
  reason: string;
  repairCostEstimate: number;
  valueAfterRepair: number;
  valueWithoutRepair: number;
  repairProfitability: number;
  environmentallyRecommended: boolean;
  co2SavedKg: number;
}

export interface RepairabilityRequest {
  type: string;
  brand: string;
  model: string;
  condition?: string;
  description?: string;
  releaseYear?: number;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
  maxDistanceKm?: number;
}
