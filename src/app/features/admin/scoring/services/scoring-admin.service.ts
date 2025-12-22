import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface ScoringWeight {
  id?: number;
  componentType: string;
  weight: number;
  description?: string;
}

export interface ScoringParam {
  id?: number;
  paramKey: string;
  paramValue: string;
  description?: string;
}

export interface ScoringRuleSet {
  id: number;
  version: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  weights: ScoringWeight[];
  params: ScoringParam[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRuleSetRequest {
  name: string;
  version: string;
  description?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ScoringAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/scoring/admin`;

  // CRUD
  getAll(): Observable<ScoringRuleSet[]> {
    return this.http.get<ApiResponse<ScoringRuleSet[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  getById(id: number): Observable<ScoringRuleSet | null> {
    return this.http.get<ApiResponse<ScoringRuleSet>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  getActive(): Observable<ScoringRuleSet | null> {
    return this.http.get<ApiResponse<ScoringRuleSet>>(`${this.apiUrl}/active`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  create(request: CreateRuleSetRequest): Observable<ScoringRuleSet | null> {
    return this.http.post<ApiResponse<ScoringRuleSet>>(this.apiUrl, request).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  update(id: number, request: Partial<CreateRuleSetRequest>): Observable<ScoringRuleSet | null> {
    return this.http.put<ApiResponse<ScoringRuleSet>>(`${this.apiUrl}/${id}`, request).pipe(
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

  // Activation
  activate(id: number): Observable<ScoringRuleSet | null> {
    return this.http.post<ApiResponse<ScoringRuleSet>>(`${this.apiUrl}/${id}/activate`, {}).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  deactivate(id: number): Observable<ScoringRuleSet | null> {
    return this.http.post<ApiResponse<ScoringRuleSet>>(`${this.apiUrl}/${id}/deactivate`, {}).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  // Clone
  clone(id: number, newVersion: string): Observable<ScoringRuleSet | null> {
    return this.http.post<ApiResponse<ScoringRuleSet>>(
      `${this.apiUrl}/${id}/clone`,
      null,
      { params: { newVersion } }
    ).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  // Weights
  getWeights(id: number): Observable<ScoringWeight[]> {
    return this.http.get<ApiResponse<ScoringWeight[]>>(`${this.apiUrl}/${id}/weights`).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  updateWeights(id: number, weights: ScoringWeight[]): Observable<ScoringWeight[]> {
    return this.http.put<ApiResponse<ScoringWeight[]>>(`${this.apiUrl}/${id}/weights`, { weights }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  // Params
  getParams(id: number): Observable<ScoringParam[]> {
    return this.http.get<ApiResponse<ScoringParam[]>>(`${this.apiUrl}/${id}/params`).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  updateParams(id: number, params: ScoringParam[]): Observable<ScoringParam[]> {
    return this.http.put<ApiResponse<ScoringParam[]>>(`${this.apiUrl}/${id}/params`, { params }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }
}
