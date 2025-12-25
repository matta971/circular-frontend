import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import {
  GlobalDashboard,
  PartnerSummary,
  PartnerDetail,
  RepComplianceReport,
  DeviceFlows,
  Co2Impact,
  TerritorialImpact,
  MaterialRecovery,
  MarketTrends,
  CollectionVolumes,
  PartnerApiPlan,
  AnalyticsRequest
} from '../models/partner-analytics.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerAnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/analytics`;

  // ==================== Dashboard Global ====================

  getGlobalDashboard(request?: AnalyticsRequest): Observable<GlobalDashboard> {
    const params = this.buildParams(request);
    return this.http.get<ApiResponse<GlobalDashboard>>(`${this.baseUrl}/dashboard`, { params })
      .pipe(map(res => res.data));
  }

  // ==================== Partenaires ====================

  getPartnersList(page = 0, size = 20, type?: string, active?: boolean): Observable<PageResponse<PartnerSummary>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (type) params = params.set('type', type);
    if (active !== undefined) params = params.set('active', active.toString());

    return this.http.get<ApiResponse<PageResponse<PartnerSummary>>>(`${this.baseUrl}/partners`, { params })
      .pipe(map(res => res.data));
  }

  getPartnerDetail(partnerId: number): Observable<PartnerDetail> {
    return this.http.get<ApiResponse<PartnerDetail>>(`${this.baseUrl}/partners/${partnerId}`)
      .pipe(map(res => res.data));
  }

  getPartnerFullAnalytics(partnerId: number, request?: AnalyticsRequest): Observable<any> {
    const params = this.buildParams(request);
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/partners/${partnerId}/full-analytics`, { params })
      .pipe(map(res => res.data));
  }

  // ==================== Données Globales ====================

  getGlobalRepCompliance(request?: AnalyticsRequest): Observable<RepComplianceReport> {
    const params = this.buildParams(request);
    return this.http.get<ApiResponse<RepComplianceReport>>(`${this.baseUrl}/rep-compliance`, { params })
      .pipe(map(res => res.data));
  }

  getGlobalDeviceFlows(request?: AnalyticsRequest): Observable<DeviceFlows> {
    const params = this.buildParams(request);
    return this.http.get<ApiResponse<DeviceFlows>>(`${this.baseUrl}/device-flows`, { params })
      .pipe(map(res => res.data));
  }

  getGlobalCo2Impact(request?: AnalyticsRequest): Observable<Co2Impact> {
    const params = this.buildParams(request);
    return this.http.get<ApiResponse<Co2Impact>>(`${this.baseUrl}/co2-impact`, { params })
      .pipe(map(res => res.data));
  }

  getGlobalTerritorialImpact(request?: AnalyticsRequest): Observable<TerritorialImpact> {
    const params = this.buildParams(request);
    return this.http.get<ApiResponse<TerritorialImpact>>(`${this.baseUrl}/territorial-impact`, { params })
      .pipe(map(res => res.data));
  }

  getGlobalMaterialRecovery(request?: AnalyticsRequest): Observable<MaterialRecovery> {
    const params = this.buildParams(request);
    return this.http.get<ApiResponse<MaterialRecovery>>(`${this.baseUrl}/material-recovery`, { params })
      .pipe(map(res => res.data));
  }

  getGlobalMarketTrends(): Observable<MarketTrends> {
    return this.http.get<ApiResponse<MarketTrends>>(`${this.baseUrl}/market-trends`)
      .pipe(map(res => res.data));
  }

  getGlobalCollectionVolumes(request?: AnalyticsRequest): Observable<CollectionVolumes> {
    const params = this.buildParams(request);
    return this.http.get<ApiResponse<CollectionVolumes>>(`${this.baseUrl}/collection-volumes`, { params })
      .pipe(map(res => res.data));
  }

  // ==================== Plans ====================

  getPlans(): Observable<PartnerApiPlan[]> {
    return this.http.get<ApiResponse<PartnerApiPlan[]>>(`${this.baseUrl}/plans`)
      .pipe(map(res => res.data));
  }

  // ==================== Helpers ====================

  private buildParams(request?: AnalyticsRequest): HttpParams {
    let params = new HttpParams();
    if (request) {
      if (request.startDate) params = params.set('startDate', request.startDate);
      if (request.endDate) params = params.set('endDate', request.endDate);
      if (request.regionCode) params = params.set('regionCode', request.regionCode);
      if (request.category) params = params.set('category', request.category);
      if (request.granularity) params = params.set('granularity', request.granularity);
    }
    return params;
  }
}
