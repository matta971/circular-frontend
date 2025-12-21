export interface VisionAnalysisResult {
  analysisId: string;
  analyzedAt: string;
  imageUrls: string[];
  identification: DeviceIdentification;
  condition: ConditionAssessment;
  damageReport: DamageReport;
  components: VisibleComponent[];
  evaluationData?: EvaluationEnrichmentData;
  overallConfidence: number;
  rawAnalysisText?: string;
  metadata?: Record<string, any>;
  processingTimeMs: number;
  manualReviewRequired: boolean;
}

export interface DeviceIdentification {
  deviceType: string;
  deviceTypeConfidence: number;
  brand: string;
  brandConfidence: number;
  model: string;
  modelConfidence: number;
  variant?: string;
  estimatedReleaseYear?: number;
  alternativePredictions?: string[];
}

export interface ConditionAssessment {
  overallCondition: string;
  conditionConfidence: number;
  cosmeticGrade: string;
  powersOnDetected?: boolean;
  powersOnConfidence?: number;
  screenState: string;
  screenConfidence: number;
  waterDamageIndicators?: boolean;
  waterDamageConfidence?: number;
  estimatedBatteryHealthPct?: number;
  cosmeticDefects: string[];
  detailedNotes?: string;
}

export interface DamageReport {
  damages: DamageItem[];
  severityLevel: string;
  estimatedRepairCost: number;
  isRefurbishable: boolean;
}

export interface DamageItem {
  damageType: string;
  location: string;
  severity: string;
  confidence: number;
  description?: string;
}

export interface VisibleComponent {
  componentType: string;
  status: string;
  confidence: number;
  notes?: string;
}

export interface EvaluationEnrichmentData {
  powersOn?: boolean;
  screenCracked?: boolean;
  waterDamage?: boolean;
  batteryHealthPct?: number;
  cosmeticGrade?: string;
  conditionNotes?: string;
}
