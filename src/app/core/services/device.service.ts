import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  Device,
  DeviceDraft,
  CreateDeviceDraftRequest,
  DevicePrediction,
  DeviceCondition,
  RepairabilityAssessment,
  RepairabilityRequest,
  VisionAnalysisResult,
  MaterialValueResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private readonly apiUrl = `${environment.apiUrl}/devices`;
  private readonly aiUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  // Device drafts (evaluation)
  createDraft(data: CreateDeviceDraftRequest): Observable<DeviceDraft> {
    return this.http.post<ApiResponse<DeviceDraft>>(`${this.apiUrl}/draft`, data).pipe(
      map(response => response.data),
      catchError(() => {
        // Mock response with AI estimation
        return of({
          id: Math.floor(Math.random() * 10000),
          userId: 1,
          type: data.type,
          brand: data.brand,
          model: data.model,
          condition: data.condition,
          description: data.description,
          estimatedValueMin: 50,
          estimatedValueMax: 150,
          imageUrl: data.imageUrl,
          converted: false,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        } as DeviceDraft);
      })
    );
  }

  getMyDrafts(): Observable<DeviceDraft[]> {
    return this.http.get<ApiResponse<DeviceDraft[]>>(`${this.apiUrl}/draft`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  getDraft(id: number): Observable<DeviceDraft | null> {
    return this.http.get<ApiResponse<DeviceDraft>>(`${this.apiUrl}/draft/${id}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  deleteDraft(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/draft/${id}`).pipe(
      map(() => undefined)
    );
  }

  // Devices
  getDevice(id: number): Observable<Device | null> {
    return this.http.get<ApiResponse<Device>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  getDevicesByCollection(collectionId: number): Observable<Device[]> {
    return this.http.get<ApiResponse<Device[]>>(`${this.apiUrl}/collection/${collectionId}`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  getDevicesByUser(userId: number): Observable<Device[]> {
    return this.http.get<ApiResponse<Device[]>>(`${this.apiUrl}/user/${userId}`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  createDevice(device: Partial<Device>): Observable<Device> {
    return this.http.post<ApiResponse<Device>>(this.apiUrl, device).pipe(
      map(response => response.data)
    );
  }

  markAsAnalysed(id: number): Observable<Device> {
    return this.http.post<ApiResponse<Device>>(`${this.apiUrl}/${id}/analyse`, {}).pipe(
      map(response => response.data)
    );
  }

  markAsProcessed(id: number): Observable<Device> {
    return this.http.post<ApiResponse<Device>>(`${this.apiUrl}/${id}/process`, {}).pipe(
      map(response => response.data)
    );
  }

  // AI endpoints
  predictDevice(data: { imageUrl?: string; type?: string; brand?: string; model?: string; condition?: string }): Observable<DevicePrediction | null> {
    return this.http.post<ApiResponse<DevicePrediction>>(`${this.aiUrl}/device-predict`, data).pipe(
      map(response => response.data),
      catchError(() => {
        // Mock AI prediction
        return of({
          predictedType: data.type || 'SMARTPHONE',
          predictedBrand: data.brand,
          predictedModel: data.model,
          predictedCondition: data.condition || 'GOOD',
          typeConfidence: 0.85,
          conditionConfidence: 0.75,
          estimatedValueMin: 80,
          estimatedValueMax: 150,
          refurbishable: true,
          refurbishProbability: 0.7
        } as DevicePrediction);
      })
    );
  }

  performOcr(imageUrl: string): Observable<{ text: string; confidence: number; brand?: string; model?: string } | null> {
    return this.http.post<ApiResponse<any>>(`${this.aiUrl}/ocr`, { imageUrl }).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  // Repairability assessment
  getRepairabilityAssessment(request: RepairabilityRequest): Observable<RepairabilityAssessment> {
    return this.http.post<ApiResponse<RepairabilityAssessment>>(`${this.aiUrl}/repairability`, request).pipe(
      map(response => response.data),
      catchError(() => {
        // Mock repairability assessment
        return of({
          repairabilityIndex: 6.5,
          repairabilityGrade: 'B',
          details: {
            documentationScore: 1.0,
            documentationComment: 'Documentation partielle disponible',
            disassemblyScore: 1.4,
            disassemblyComment: 'Démontage possible mais nécessite des outils spécifiques',
            sparePartsScore: 1.2,
            sparePartsComment: 'Pièces disponibles via revendeurs tiers',
            sparePartsAvailabilityYears: 5,
            sparePartsPriceScore: 1.4,
            sparePartsPriceComment: 'Prix variables selon les fournisseurs',
            specificCriteriaScore: 1.5,
            specificCriteriaComment: 'Critères spécifiques évalués'
          },
          faultDiagnoses: [
            {
              faultType: 'BATTERY',
              faultName: 'Usure de la batterie',
              description: 'Capacité réduite, autonomie diminuée',
              probability: 0.6,
              severity: 'MEDIUM',
              estimatedRepairCost: 49.90,
              estimatedRepairTimeMinutes: 45,
              selfRepairable: true,
              repairDifficulty: 'MEDIUM'
            }
          ],
          repairPartners: [
            {
              id: 1,
              name: 'iFixit Store Paris',
              type: 'SELF_REPAIR',
              address: '15 Rue de la Réparation',
              city: 'Paris',
              postalCode: '75011',
              latitude: 48.8566,
              longitude: 2.3522,
              distanceKm: 2.5,
              rating: 4.8,
              reviewCount: 342,
              estimatedCostMin: 30,
              estimatedCostMax: 150,
              estimatedDelayDays: 1,
              certifications: ['iFixit Certified'],
              warrantyProvided: true,
              phoneNumber: '01 23 45 67 89',
              website: 'https://ifixit-store.fr'
            }
          ],
          recommendation: {
            action: 'REPAIR',
            reason: "L'appareil a un bon indice de réparabilité.",
            repairCostEstimate: 49.90,
            valueAfterRepair: 150,
            valueWithoutRepair: 50,
            repairProfitability: 2.0,
            environmentallyRecommended: true,
            co2SavedKg: 45
          }
        } as RepairabilityAssessment);
      })
    );
  }

  // Vision AI analysis - upload images and analyze device condition
  analyzeDeviceImages(
    files: File[],
    options?: {
      deviceId?: number;
      expectedDeviceType?: string;
      expectedBrand?: string;
      scope?: 'FULL' | 'IDENTIFICATION_ONLY' | 'DAMAGE_ONLY' | 'CONDITION_ONLY';
    }
  ): Observable<VisionAnalysisResult> {
    const formData = new FormData();

    files.forEach(file => formData.append('files', file));

    if (options?.deviceId) {
      formData.append('deviceId', options.deviceId.toString());
    }
    if (options?.expectedDeviceType) {
      formData.append('expectedDeviceType', options.expectedDeviceType);
    }
    if (options?.expectedBrand) {
      formData.append('expectedBrand', options.expectedBrand);
    }
    if (options?.scope) {
      formData.append('scope', options.scope);
    }
    formData.append('includeDetailedReport', 'true');

    return this.http.post<VisionAnalysisResult>(`${this.aiUrl}/vision/analyze-upload`, formData).pipe(
      catchError(() => {
        // Mock vision analysis for fallback
        return of(this.getMockVisionAnalysis(files.length, options));
      })
    );
  }

  private getMockVisionAnalysis(
    fileCount: number,
    options?: { expectedDeviceType?: string; expectedBrand?: string }
  ): VisionAnalysisResult {
    return {
      analysisId: `mock-${Date.now()}`,
      analyzedAt: new Date().toISOString(),
      imageUrls: Array(fileCount).fill('').map((_, i) => `mock-image-${i}.jpg`),
      identification: {
        deviceType: options?.expectedDeviceType || 'SMARTPHONE',
        deviceTypeConfidence: 0.85,
        brand: options?.expectedBrand || 'Unknown',
        brandConfidence: 0.75,
        model: 'Unknown Model',
        modelConfidence: 0.6,
        estimatedReleaseYear: 2022
      },
      condition: {
        overallCondition: 'GOOD',
        conditionConfidence: 0.8,
        cosmeticGrade: 'B',
        powersOnDetected: true,
        powersOnConfidence: 0.7,
        screenState: 'INTACT',
        screenConfidence: 0.85,
        waterDamageIndicators: false,
        waterDamageConfidence: 0.9,
        estimatedBatteryHealthPct: 80,
        cosmeticDefects: ['Légères micro-rayures'],
        detailedNotes: 'Appareil en bon état général avec traces d\'usure mineures.'
      },
      damageReport: {
        damages: [],
        severityLevel: 'MINOR',
        estimatedRepairCost: 0,
        isRefurbishable: true
      },
      components: [
        { componentType: 'SCREEN', status: 'PRESENT', confidence: 0.95 },
        { componentType: 'CAMERA', status: 'PRESENT', confidence: 0.9 },
        { componentType: 'PORTS', status: 'PRESENT', confidence: 0.85 }
      ],
      overallConfidence: 0.8,
      processingTimeMs: 1500,
      manualReviewRequired: false
    };
  }

  // Material value calculation
  getMaterialValue(deviceType: string, brand?: string, model?: string): Observable<MaterialValueResponse> {
    const params: Record<string, string> = { deviceType };
    if (brand) params['brand'] = brand;
    if (model) params['model'] = model;

    return this.http.get<MaterialValueResponse>(`${environment.apiUrl}/market-price/material-value`, { params }).pipe(
      catchError(() => {
        // Mock material value response
        return of(this.getMockMaterialValue(deviceType));
      })
    );
  }

  private getMockMaterialValue(deviceType: string): MaterialValueResponse {
    const weights: Record<string, number> = {
      'SMARTPHONE': 175,
      'LAPTOP': 2200,
      'TABLET': 450,
      'DESKTOP': 8500,
      'TV': 12000,
      'CONSOLE': 3200,
      'PERIPHERAL': 150,
      'OTHER': 500
    };

    const weight = weights[deviceType] || 500;
    const totalFloorValue = weight * 0.015; // ~1.5 cents per gram average

    return {
      totalFloorValue,
      theoreticalTotalValue: totalFloorValue * 1.8,
      recoveryRate: 0.55,
      deviceType,
      totalWeightGrams: weight,
      source: 'ESTIMATE',
      confidence: 0.7,
      pricesFetchedAt: new Date().toISOString(),
      materialBreakdown: [
        {
          material: 'Copper',
          symbol: 'Cu',
          weightGrams: weight * 0.15,
          percentageOfDevice: 15,
          pricePerGram: 0.008,
          grossValue: weight * 0.15 * 0.008,
          recoveryRate: 0.9,
          recoverableValue: weight * 0.15 * 0.008 * 0.9,
          priceSource: 'LME'
        },
        {
          material: 'Aluminium',
          symbol: 'Al',
          weightGrams: weight * 0.12,
          percentageOfDevice: 12,
          pricePerGram: 0.002,
          grossValue: weight * 0.12 * 0.002,
          recoveryRate: 0.95,
          recoverableValue: weight * 0.12 * 0.002 * 0.95,
          priceSource: 'LME'
        },
        {
          material: 'Gold',
          symbol: 'Au',
          weightGrams: weight * 0.0003,
          percentageOfDevice: 0.03,
          pricePerGram: 65,
          grossValue: weight * 0.0003 * 65,
          recoveryRate: 0.95,
          recoverableValue: weight * 0.0003 * 65 * 0.95,
          priceSource: 'KITCO'
        },
        {
          material: 'Cobalt',
          symbol: 'Co',
          weightGrams: weight * 0.02,
          percentageOfDevice: 2,
          pricePerGram: 0.03,
          grossValue: weight * 0.02 * 0.03,
          recoveryRate: 0.8,
          recoverableValue: weight * 0.02 * 0.03 * 0.8,
          priceSource: 'LME'
        },
        {
          material: 'Lithium',
          symbol: 'Li',
          weightGrams: weight * 0.01,
          percentageOfDevice: 1,
          pricePerGram: 0.07,
          grossValue: weight * 0.01 * 0.07,
          recoveryRate: 0.5,
          recoverableValue: weight * 0.01 * 0.07 * 0.5,
          priceSource: 'ESTIMATE'
        }
      ],
      environmentalImpact: {
        co2SavedKg: weight * 0.05,
        waterSavedLiters: weight * 2,
        energySavedKwh: weight * 0.03,
        rawMaterialsPreservedKg: weight * 0.6 / 1000,
        landfillAvoided: weight / 1000
      },
      warnings: []
    };
  }
}
