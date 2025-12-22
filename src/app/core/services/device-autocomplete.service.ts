import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceAutocompleteService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/evaluation/devices`;

  /**
   * Get all supported device types
   */
  getDeviceTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/types`).pipe(
      catchError(() => of(['SMARTPHONE', 'LAPTOP', 'TABLET', 'DESKTOP', 'SMARTWATCH', 'CONSOLE', 'OTHER']))
    );
  }

  /**
   * Get brands for a device type with optional search query
   */
  getBrands(type: string, query?: string): Observable<string[]> {
    const params: any = { type };
    if (query && query.length >= 1) {
      params.q = query;
    }
    return this.http.get<string[]>(`${this.baseUrl}/brands`, { params }).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Get models for a brand with optional search query
   */
  getModels(type: string, brand: string, query?: string): Observable<string[]> {
    const params: any = { type, brand };
    if (query && query.length >= 1) {
      params.q = query;
    }
    return this.http.get<string[]>(`${this.baseUrl}/models`, { params }).pipe(
      map(models => models.map(m => m.startsWith('_') ? m.substring(1) : m)), // Remove leading underscores
      catchError(() => of([]))
    );
  }

  /**
   * Record device selection to improve ranking
   */
  recordSelection(type: string, brand: string, model: string): Observable<void> {
    const params = { type, brand, model };
    return this.http.post<void>(`${this.baseUrl}/select`, null, { params }).pipe(
      catchError(() => of(undefined))
    );
  }

  /**
   * Get cache statistics
   */
  getStats(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/stats`).pipe(
      catchError(() => of({}))
    );
  }
}
