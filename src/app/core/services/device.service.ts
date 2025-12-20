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
  RepairabilityRequest
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
}
