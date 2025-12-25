/**
 * Modèles pour les analytics partenaires
 */

export enum PartnerType {
  PRODUCER = 'PRODUCER',
  ECO_ORGANISM = 'ECO_ORGANISM',
  LOCAL_AUTHORITY = 'LOCAL_AUTHORITY',
  REFURBISHER = 'REFURBISHER',
  RECYCLER = 'RECYCLER',
  INSURER = 'INSURER',
  RETAILER = 'RETAILER',
  PUBLIC_AGENCY = 'PUBLIC_AGENCY',
  RESEARCH = 'RESEARCH'
}

export enum DataScope {
  REP_COMPLIANCE = 'REP_COMPLIANCE',
  TRACEABILITY = 'TRACEABILITY',
  DEVICE_FLOWS = 'DEVICE_FLOWS',
  CO2_IMPACT = 'CO2_IMPACT',
  TERRITORIAL_IMPACT = 'TERRITORIAL_IMPACT',
  MATERIAL_RECOVERY = 'MATERIAL_RECOVERY',
  REUSE_RATES = 'REUSE_RATES',
  COLLECTION_VOLUMES = 'COLLECTION_VOLUMES',
  MARKET_PRICES = 'MARKET_PRICES',
  MARKET_TRENDS = 'MARKET_TRENDS',
  REPAIRABILITY = 'REPAIRABILITY',
  METAL_PRICES = 'METAL_PRICES',
  DEVICE_CONDITIONS = 'DEVICE_CONDITIONS',
  REPAIR_COSTS = 'REPAIR_COSTS',
  WARRANTY_DATA = 'WARRANTY_DATA',
  CONSUMER_BEHAVIOR = 'CONSUMER_BEHAVIOR',
  PRODUCT_LIFECYCLE = 'PRODUCT_LIFECYCLE',
  RECYCLING_RATES = 'RECYCLING_RATES'
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface PartnerSummary {
  id: number;
  name: string;
  type: PartnerType;
  active: boolean;
  contactEmail: string;
  plan: string | null;
  subscriptionStatus: string;
}

export interface PartnerSubscription {
  plan: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  scopes: DataScope[];
  requestLimit: number;
}

export interface PartnerDetail {
  partner: PartnerSummary;
  subscription?: PartnerSubscription;
  dashboard: DashboardSummary;
}

export interface DashboardSummary {
  period: {
    startDate: string;
    endDate: string;
    daysIncluded: number;
  };
  overview: {
    devicesProcessed: number;
    changeFromPrevious: number;
    reuseRate: number;
    avgProcessingDays: number;
  };
  co2Impact?: {
    co2AvoidedTons: number;
    changeFromPrevious: number;
    treesEquivalent: number;
  };
  deviceFlows?: {
    inflow: number;
    outflow: number;
    inStock: number;
  };
  marketOverview?: {
    avgPriceChange: number;
    topSellingCategory: string;
    marketTrend: string;
  };
  materialRecovery?: {
    totalValueEur: number;
    topMaterial: string;
    recoveryRate: number;
  };
  collections?: {
    totalCollections: number;
    totalDevices: number;
    avgDevicesPerCollection: number;
  };
}

export interface RepComplianceReport {
  reportPeriod: {
    startDate: string;
    endDate: string;
  };
  volumesByCategory: Array<{
    category: string;
    code: string;
    unitsCollected: number;
    weightKg: number;
  }>;
  outcomeRates: {
    reuseRate: number;
    refurbishmentRate: number;
    recyclingRate: number;
    disposalRate: number;
  };
  repTargets: {
    targetReuseRate: number;
    actualReuseRate: number;
    targetRecyclingRate: number;
    actualRecyclingRate: number;
    compliance: boolean;
  };
  certificates: {
    traceabilityCertificates: number;
    recyclingCertificates: number;
    destructionCertificates: number;
  };
}

export interface DeviceFlows {
  inflows: {
    collections: number;
    dropOffs: number;
    buybacks: number;
    partnerReturns: number;
    total: number;
  };
  outflows: {
    directResale: number;
    refurbishment: number;
    partsRecovery: number;
    materialRecycling: number;
    disposal: number;
    inStock: number;
    total: number;
  };
  conversionFunnel: Array<{
    stage: string;
    count: number;
    rate: number;
  }>;
  byBrand: Array<{
    brand: string;
    units: number;
    percentage: number;
  }>;
}

export interface Co2Impact {
  summary: {
    totalCo2AvoidedKg: number;
    totalCo2AvoidedTons: number;
    period: {
      startDate: string;
      endDate: string;
    };
  };
  byAction: Array<{
    action: string;
    co2AvoidedKg: number;
    percentage: number;
  }>;
  equivalences: {
    treesPlantedForOneYear: number;
    carKilometersAvoided: number;
    domesticFlightsAvoided: number;
    homeElectricityYears: number;
  };
  byCategory: Array<{
    category: string;
    unitsReused: number;
    co2AvoidedKg: number;
  }>;
}

export interface TerritorialImpact {
  byRegion: Array<{
    region: string;
    code: string;
    units: number;
    co2AvoidedKg: number;
    collectionPoints: number;
  }>;
  topDepartments: Array<{
    department: string;
    code: string;
    units: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    units: number;
  }>;
}

export interface MaterialRecovery {
  byMaterial: Array<{
    material: string;
    symbol: string;
    weightKg: number;
    valueEur: number;
    pricePerKg: number;
  }>;
  summary: {
    totalWeightKg: number;
    totalValueEur: number;
    averageValuePerDevice: number;
    devicesProcessed: number;
  };
  recoveryRates: {
    preciousMetals: number;
    baseMetals: number;
    rareEarth: number;
    plastics: number;
    batteries: number;
  };
}

export interface MarketTrends {
  priceTrends: Array<{
    category: string;
    currentPrice: number;
    priceChange30d: number;
    priceChange90d: number;
    demand: string;
  }>;
  topDemand: Array<{
    model: string;
    demandScore: number;
    avgDaysToSell: number;
  }>;
  seasonality: {
    peakMonths: string[];
    lowMonths: string[];
    currentSeasonTrend: string;
  };
}

export interface CollectionVolumes {
  summary: {
    totalCollections: number;
    totalDevices: number;
    totalWeightKg: number;
    avgDevicesPerCollection: number;
  };
  byType: Array<{
    type: string;
    count: number;
    devices: number;
    percentage: number;
  }>;
  topCollectionPoints: Array<{
    pointId: number;
    name: string;
    devices: number;
    collections: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    collections: number;
    devices: number;
  }>;
}

export interface GlobalDashboard {
  period: {
    startDate: string;
    endDate: string;
  };
  partners: {
    total: number;
    active: number;
    withActiveSubscription: number;
    byType: Record<string, number>;
  };
  aggregatedMetrics: DashboardSummary;
  subscriptionRevenue: {
    monthlyRecurringRevenue: number;
    annualRecurringRevenue: number;
    activeSubscriptions: number;
  };
}

export interface PartnerApiPlan {
  id: number;
  name: string;
  code: string;
  description: string;
  monthlyPriceEur: number | null;
  yearlyPriceEur: number | null;
  monthlyRequestLimit: number;
  requestsPerMinute: number;
  includedScopes: DataScope[];
  dashboardAccess: boolean;
  exportEnabled: boolean;
  webhooksEnabled: boolean;
  dedicatedSupport: boolean;
  slaResponseTimeHours: number | null;
  dataRetentionDays: number;
  isActive: boolean;
  displayOrder: number;
}

export interface AnalyticsRequest {
  startDate?: string;
  endDate?: string;
  regionCode?: string;
  category?: string;
  granularity?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}
