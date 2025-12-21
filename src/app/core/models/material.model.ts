export interface MaterialValueResponse {
  totalFloorValue: number;
  theoreticalTotalValue: number;
  recoveryRate: number;
  deviceType: string;
  totalWeightGrams: number;
  source: string;
  confidence: number;
  pricesFetchedAt: string;
  materialBreakdown: MaterialBreakdown[];
  environmentalImpact: MaterialEnvironmentalImpact;
  warnings: string[];
}

export interface MaterialBreakdown {
  material: string;
  symbol: string;
  weightGrams: number;
  percentageOfDevice: number;
  pricePerGram: number;
  grossValue: number;
  recoveryRate: number;
  recoverableValue: number;
  priceSource: string;
}

export interface MaterialEnvironmentalImpact {
  co2SavedKg: number;
  waterSavedLiters: number;
  energySavedKwh: number;
  rawMaterialsPreservedKg: number;
  landfillAvoided: number;
}
