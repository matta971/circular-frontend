export interface Evaluation {
  id: number;
  deviceId: number;
  userId?: number;
  ruleSetId?: number;
  ruleSetVersion: string;
  source: EvaluationSource;
  globalScore?: number;
  estimatedValueEur?: number;
  minValueEur?: number;
  maxValueEur?: number;
  result?: EvaluationResult;
  decision?: EvaluationDecision;
  components?: EvaluationScoreComponent[];
  createdAt: string;
  updatedAt?: string;
}

export interface EvaluationResult {
  totalScore?: number;
  confidence?: number;
  marketReferenceEur?: number;
  mpirFloorEur?: number;
  estimatedRepairCostEur?: number;
  estimatedLogisticCostEur?: number;
  indicativeBuybackEur?: number;
}

export interface EvaluationScoreComponent {
  id: number;
  evaluationId: number;
  componentType: ScoreComponentType;
  rawScore: number;
  weight: number;
  weightedScore: number;
  details?: string;
}

export interface EvaluationDecision {
  id: number;
  evaluationId: number;
  decisionType: DecisionType;
  confidence: number;
  reason?: string;
  decidedAt: string;
}

export interface BuybackOffer {
  id: number;
  offerRef: string;
  deviceId: number;
  evaluationId: number;
  userId: number;
  indicativeAmountEur: number;
  firmAmountEur?: number;
  status: OfferStatus;
  validUntil?: string;
  acceptedAt?: string;
  refusedAt?: string;
  refuseReason?: string;
  createdAt: string;
}

export enum EvaluationSource {
  CLIENT_DRAFT = 'CLIENT_DRAFT',
  DRIVER_SCAN = 'DRIVER_SCAN',
  CENTER = 'CENTER',
  AI_RECHECK = 'AI_RECHECK'
}

export enum ScoreComponentType {
  ETAT = 'ETAT',
  REPARABILITE = 'REPARABILITE',
  VALEUR_MARCHE = 'VALEUR_MARCHE',
  VALEUR_MATIERE = 'VALEUR_MATIERE',
  LOGISTIQUE = 'LOGISTIQUE',
  IMPACT_ECO = 'IMPACT_ECO'
}

export enum DecisionType {
  REPARER = 'REPARER',
  RECONDITIONNER = 'RECONDITIONNER',
  REVENTE_P2P = 'REVENTE_P2P',
  RECYCLER = 'RECYCLER',
  REFUSER = 'REFUSER'
}

export enum OfferStatus {
  INDICATIVE = 'INDICATIVE',
  FIRM = 'FIRM',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED'
}

export interface EvaluationWithDevice extends Evaluation {
  device?: {
    id: number;
    type: string;
    brand?: string;
    model?: string;
    condition: string;
    imageUrl?: string;
  };
  offer?: BuybackOffer;
}

export interface CreateEvaluationRequest {
  deviceId: number;
  deviceType?: string;
  deviceBrand?: string;
  deviceModel?: string;
  userId?: number;
  source?: EvaluationSource;
  ruleSetVersion?: string;
  // Inputs pour le scoring (etat de l'appareil)
  powersOn?: boolean;
  screenCracked?: boolean;
  batteryHealthPct?: number;
  waterDamage?: boolean;
  conditionNotes?: string;
  // Donnees marche/logistique
  marketReferenceEur?: number;
  repairCostEur?: number;
  logisticCostEur?: number;
  mpirFloorEur?: number;
  // Donnees IA
  repairabilityIndex?: number;
  partsAvailability?: number;
  avgRepairTimeScore?: number;
  // Fetch market price from API if not provided
  fetchMarketPrice?: boolean;
  // Vision AI analysis reference
  visionAnalysisId?: string;
}
