import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  Evaluation,
  EvaluationWithDevice,
  BuybackOffer,
  CreateEvaluationRequest,
  EvaluationScoreComponent
} from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/evaluation`;
  private buybackUrl = `${environment.apiUrl}/buyback/offers`;

  /**
   * Crée une nouvelle évaluation pour un device.
   */
  createEvaluation(request: CreateEvaluationRequest): Observable<Evaluation> {
    return this.http.post<ApiResponse<Evaluation>>(`${this.apiUrl}/evaluate`, request)
      .pipe(map(res => res.data));
  }

  /**
   * Récupère une évaluation par ID.
   */
  getEvaluation(id: number): Observable<Evaluation> {
    return this.http.get<ApiResponse<Evaluation>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  /**
   * Récupère les composantes détaillées d'une évaluation.
   */
  getEvaluationComponents(id: number): Observable<EvaluationScoreComponent[]> {
    return this.http.get<ApiResponse<EvaluationScoreComponent[]>>(`${this.apiUrl}/${id}/components`)
      .pipe(map(res => res.data));
  }

  /**
   * Récupère toutes les évaluations d'un device.
   */
  getDeviceEvaluations(deviceId: number): Observable<Evaluation[]> {
    return this.http.get<ApiResponse<Evaluation[]>>(`${this.apiUrl}/device/${deviceId}`)
      .pipe(map(res => res.data));
  }

  /**
   * Récupère toutes les évaluations de l'utilisateur connecté.
   */
  getMyEvaluations(): Observable<EvaluationWithDevice[]> {
    return this.http.get<ApiResponse<EvaluationWithDevice[]>>(`${this.apiUrl}/my-evaluations`)
      .pipe(map(res => res.data));
  }

  /**
   * Génère une offre ferme pour une évaluation.
   */
  generateFirmOffer(evaluationId: number): Observable<BuybackOffer> {
    return this.http.post<ApiResponse<BuybackOffer>>(`${this.apiUrl}/${evaluationId}/firm-offer`, {})
      .pipe(map(res => res.data));
  }

  /**
   * Récupère une offre par sa référence.
   */
  getOffer(offerRef: string): Observable<BuybackOffer> {
    return this.http.get<ApiResponse<BuybackOffer>>(`${this.buybackUrl}/${offerRef}`)
      .pipe(map(res => res.data));
  }

  /**
   * Récupère les offres d'un device.
   */
  getDeviceOffers(deviceId: number): Observable<BuybackOffer[]> {
    return this.http.get<ApiResponse<BuybackOffer[]>>(`${this.buybackUrl}/device/${deviceId}`)
      .pipe(map(res => res.data));
  }

  /**
   * Accepte une offre.
   */
  acceptOffer(offerRef: string): Observable<BuybackOffer> {
    return this.http.post<ApiResponse<BuybackOffer>>(`${this.buybackUrl}/${offerRef}/accept`, {})
      .pipe(map(res => res.data));
  }

  /**
   * Refuse une offre.
   */
  refuseOffer(offerRef: string, reason?: string): Observable<BuybackOffer> {
    return this.http.post<ApiResponse<BuybackOffer>>(`${this.buybackUrl}/${offerRef}/refuse`, { reason })
      .pipe(map(res => res.data));
  }
}
