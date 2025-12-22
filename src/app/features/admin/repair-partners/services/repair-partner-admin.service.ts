import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface RepairPartner {
  id: number;
  name: string;
  legalName?: string;
  siret?: string;
  partnerType: string;
  status: string;
  isEss: boolean;
  hasQualiReparLabel: boolean;
  acceptsBonusReparation: boolean;
  address: string;
  postalCode: string;
  city: string;
  department?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  supportedDeviceTypes: string[];
  supportedBrands: string[];
  certifications: string[];
  estimatedCostMin?: number;
  estimatedCostMax?: number;
  estimatedDelayDays?: number;
  providesWarranty: boolean;
  warrantyDurationMonths?: number;
  rating: number;
  reviewCount: number;
  contractNumber?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  commissionRate?: number;
  totalRepairs: number;
  repairsThisMonth: number;
  dataSource: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerSearchParams {
  query?: string;
  status?: string;
  partnerType?: string;
  city?: string;
  hasQualiReparLabel?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface PartnerStatistics {
  total: number;
  active: number;
  pending: number;
  byType: { [key: string]: number };
  byCity: { [key: string]: number };
  withQualiRepar: number;
  withContracts: number;
}

export interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class RepairPartnerAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/repair-partners/admin`;

  // CRUD
  getAll(params: PartnerSearchParams = {}): Observable<{ data: RepairPartner[]; total: number }> {
    let httpParams = new HttpParams();
    if (params.query) httpParams = httpParams.set('query', params.query);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.partnerType) httpParams = httpParams.set('partnerType', params.partnerType);
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);

    return this.http.get<ApiResponse<RepairPartner[]>>(this.apiUrl, { params: httpParams }).pipe(
      map(response => ({
        data: response.data || [],
        total: response.totalElements || response.count || 0
      })),
      catchError(() => of({ data: [], total: 0 }))
    );
  }

  getById(id: number): Observable<RepairPartner | null> {
    return this.http.get<ApiResponse<RepairPartner>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  create(partner: Partial<RepairPartner>): Observable<RepairPartner | null> {
    return this.http.post<ApiResponse<RepairPartner>>(this.apiUrl, partner).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  update(id: number, partner: Partial<RepairPartner>): Observable<RepairPartner | null> {
    return this.http.put<ApiResponse<RepairPartner>>(`${this.apiUrl}/${id}`, partner).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  updateStatus(id: number, status: string): Observable<RepairPartner | null> {
    return this.http.patch<ApiResponse<RepairPartner>>(
      `${this.apiUrl}/${id}/status`,
      null,
      { params: { status } }
    ).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  // Statistics
  getStatistics(): Observable<PartnerStatistics> {
    return this.http.get<ApiResponse<PartnerStatistics>>(`${this.apiUrl}/statistics`).pipe(
      map(response => response.data),
      catchError(() => of({
        total: 0,
        active: 0,
        pending: 0,
        byType: {},
        byCity: {},
        withQualiRepar: 0,
        withContracts: 0
      }))
    );
  }

  getPending(): Observable<RepairPartner[]> {
    return this.http.get<ApiResponse<RepairPartner[]>>(`${this.apiUrl}/pending`).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  getExpiringContracts(daysAhead: number = 30): Observable<RepairPartner[]> {
    return this.http.get<ApiResponse<RepairPartner[]>>(
      `${this.apiUrl}/expiring-contracts`,
      { params: { daysAhead: daysAhead.toString() } }
    ).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  getNeedingGeocoding(): Observable<RepairPartner[]> {
    return this.http.get<ApiResponse<RepairPartner[]>>(`${this.apiUrl}/needing-geocoding`).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  // Import
  importPartners(partners: Partial<RepairPartner>[], source: string = 'CSV_IMPORT'): Observable<ImportResult> {
    return this.http.post<ApiResponse<ImportResult>>(
      `${this.apiUrl}/import`,
      partners,
      { params: { source } }
    ).pipe(
      map(response => response.data || { created: 0, updated: 0, skipped: 0, errors: [] }),
      catchError(() => of({ created: 0, updated: 0, skipped: 0, errors: ['Import failed'] }))
    );
  }

  // Geolocation
  updateGeolocation(id: number, latitude: number, longitude: number, source: string = 'MANUAL'): Observable<RepairPartner | null> {
    return this.http.patch<ApiResponse<RepairPartner>>(
      `${this.apiUrl}/${id}/geolocation`,
      null,
      { params: { latitude: latitude.toString(), longitude: longitude.toString(), source } }
    ).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }
}
