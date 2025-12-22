import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface VolumeSummary {
  totalEvaluations: number;
  evaluationsTrend: number;
  activeDevices: number;
  devicesTrend: number;
  activeUsers: number;
  usersTrend: number;
  collections: number;
  collectionsTrend: number;
}

export interface RevenueSummary {
  marketplaceRevenue: number;
  revenueTrend: number;
  buybackValue: number;
  buybackTrend: number;
  commissions: number;
  commissionsTrend: number;
  avgWalletBalance: number;
  walletTrend: number;
}

export interface QualitySummary {
  avgProcessingTimeHours: number;
  processingTrend: number;
  conversionRate: number;
  conversionTrend: number;
  disputeRate: number;
  disputeTrend: number;
  satisfactionScore: number;
  satisfactionTrend: number;
}

export interface DashboardSummary {
  volume: VolumeSummary;
  revenue: RevenueSummary;
  quality: QualitySummary;
}

export interface VolumeMetrics {
  summary: VolumeSummary;
  evaluationsTimeSeries: TimeSeriesData[];
  devicesTimeSeries: TimeSeriesData[];
  usersTimeSeries: TimeSeriesData[];
  byDeviceType: Record<string, number>;
  byBrand: Record<string, number>;
}

export interface RevenueMetrics {
  summary: RevenueSummary;
  revenueTimeSeries: TimeSeriesData[];
  buybackTimeSeries: TimeSeriesData[];
  byCategory: Record<string, number>;
  topSellingDevices: Array<{ name: string; revenue: number; count: number }>;
}

export interface ConversionFunnel {
  evaluations: number;
  offers: number;
  acceptedOffers: number;
  completedTransactions: number;
}

export interface DisputeStats {
  total: number;
  resolved: number;
  pending: number;
  byReason: Record<string, number>;
}

export interface QualityMetrics {
  summary: QualitySummary;
  processingTimeTimeSeries: TimeSeriesData[];
  conversionTimeSeries: TimeSeriesData[];
  conversionFunnel: ConversionFunnel;
  disputeStats: DisputeStats;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  period?: { start: string; end: string };
}

@Injectable({ providedIn: 'root' })
export class KpiAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/kpis`;

  private buildParams(range?: DateRange): HttpParams {
    let params = new HttpParams();
    if (range?.startDate) params = params.set('startDate', range.startDate);
    if (range?.endDate) params = params.set('endDate', range.endDate);
    return params;
  }

  getDashboardSummary(range?: DateRange): Observable<DashboardSummary> {
    return this.http.get<ApiResponse<DashboardSummary>>(
      `${this.apiUrl}/dashboard`,
      { params: this.buildParams(range) }
    ).pipe(
      map(response => response.data),
      catchError(() => of(this.getDefaultDashboardSummary()))
    );
  }

  getVolumeMetrics(range?: DateRange): Observable<VolumeMetrics> {
    return this.http.get<ApiResponse<VolumeMetrics>>(
      `${this.apiUrl}/volume`,
      { params: this.buildParams(range) }
    ).pipe(
      map(response => response.data),
      catchError(() => of(this.getDefaultVolumeMetrics()))
    );
  }

  getRevenueMetrics(range?: DateRange): Observable<RevenueMetrics> {
    return this.http.get<ApiResponse<RevenueMetrics>>(
      `${this.apiUrl}/revenue`,
      { params: this.buildParams(range) }
    ).pipe(
      map(response => response.data),
      catchError(() => of(this.getDefaultRevenueMetrics()))
    );
  }

  getQualityMetrics(range?: DateRange): Observable<QualityMetrics> {
    return this.http.get<ApiResponse<QualityMetrics>>(
      `${this.apiUrl}/quality`,
      { params: this.buildParams(range) }
    ).pipe(
      map(response => response.data),
      catchError(() => of(this.getDefaultQualityMetrics()))
    );
  }

  private getDefaultDashboardSummary(): DashboardSummary {
    return {
      volume: { totalEvaluations: 0, evaluationsTrend: 0, activeDevices: 0, devicesTrend: 0, activeUsers: 0, usersTrend: 0, collections: 0, collectionsTrend: 0 },
      revenue: { marketplaceRevenue: 0, revenueTrend: 0, buybackValue: 0, buybackTrend: 0, commissions: 0, commissionsTrend: 0, avgWalletBalance: 0, walletTrend: 0 },
      quality: { avgProcessingTimeHours: 0, processingTrend: 0, conversionRate: 0, conversionTrend: 0, disputeRate: 0, disputeTrend: 0, satisfactionScore: 0, satisfactionTrend: 0 }
    };
  }

  private getDefaultVolumeMetrics(): VolumeMetrics {
    return {
      summary: this.getDefaultDashboardSummary().volume,
      evaluationsTimeSeries: [],
      devicesTimeSeries: [],
      usersTimeSeries: [],
      byDeviceType: {},
      byBrand: {}
    };
  }

  private getDefaultRevenueMetrics(): RevenueMetrics {
    return {
      summary: this.getDefaultDashboardSummary().revenue,
      revenueTimeSeries: [],
      buybackTimeSeries: [],
      byCategory: {},
      topSellingDevices: []
    };
  }

  private getDefaultQualityMetrics(): QualityMetrics {
    return {
      summary: this.getDefaultDashboardSummary().quality,
      processingTimeTimeSeries: [],
      conversionTimeSeries: [],
      conversionFunnel: { evaluations: 0, offers: 0, acceptedOffers: 0, completedTransactions: 0 },
      disputeStats: { total: 0, resolved: 0, pending: 0, byReason: {} }
    };
  }
}
