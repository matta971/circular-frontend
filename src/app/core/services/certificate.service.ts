import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';
import {
  Certificate,
  CertificateType,
  CertificateVerification,
  DeviceTraceability,
  TraceabilityEvent,
  IssueCertificateRequest
} from '../models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private readonly apiUrl = `${environment.apiUrl}/traceability`;

  constructor(private http: HttpClient) {}

  // ============ CERTIFICATES ============

  getMyCertificates(): Observable<Certificate[]> {
    return this.http.get<ApiResponse<Certificate[]>>(`${this.apiUrl}/certificates/my`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  getCertificate(certificateNumber: string): Observable<Certificate | null> {
    return this.http.get<ApiResponse<Certificate>>(`${this.apiUrl}/certificates/number/${certificateNumber}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  getCertificatesByDevice(deviceId: number): Observable<Certificate[]> {
    return this.http.get<ApiResponse<Certificate[]>>(`${this.apiUrl}/certificates/device/${deviceId}`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  getCertificatesByType(type: CertificateType): Observable<Certificate[]> {
    return this.http.get<ApiResponse<Certificate[]>>(`${this.apiUrl}/certificates/type/${type}`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  issueCertificate(request: IssueCertificateRequest): Observable<Certificate> {
    return this.http.post<ApiResponse<Certificate>>(`${this.apiUrl}/certificates`, request).pipe(
      map(response => response.data)
    );
  }

  downloadCertificatePdf(certificateNumber: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/certificates/${certificateNumber}/pdf`, {
      responseType: 'blob'
    });
  }

  verifyCertificate(certificateNumber: string): Observable<CertificateVerification> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/verify/${certificateNumber}`).pipe(
      map(response => {
        const data = response.data;
        // Map flat backend response to expected interface
        return {
          valid: data.valid,
          verifiedAt: data.issuedAt || new Date().toISOString(),
          blockchainVerified: false,
          message: data.verificationMessage || (data.valid ? 'Certificate verified' : 'Certificate not found'),
          certificate: data.valid ? {
            id: data.deviceId,
            certificateNumber: data.certificateNumber,
            type: data.type,
            deviceId: data.deviceId,
            issuedAt: data.issuedAt,
            status: 'ISSUED' as any,
            device: {
              id: data.deviceId,
              type: data.deviceDescription || 'Unknown',
              brand: data.deviceDescription?.split(' ')[0],
              model: data.deviceDescription?.split(' ').slice(1).join(' ')
            }
          } : undefined
        } as CertificateVerification;
      }),
      catchError(() => of({
        valid: false,
        verifiedAt: new Date().toISOString(),
        message: 'Unable to verify certificate'
      }))
    );
  }

  // ============ TRACEABILITY ============

  getDeviceTraceability(deviceId: number): Observable<DeviceTraceability | null> {
    return this.http.get<ApiResponse<DeviceTraceability>>(`${this.apiUrl}/devices/${deviceId}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  getDeviceEvents(deviceId: number): Observable<TraceabilityEvent[]> {
    return this.http.get<ApiResponse<TraceabilityEvent[]>>(`${this.apiUrl}/devices/${deviceId}/events`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  addTraceabilityEvent(deviceId: number, event: Partial<TraceabilityEvent>): Observable<TraceabilityEvent> {
    return this.http.post<ApiResponse<TraceabilityEvent>>(`${this.apiUrl}/devices/${deviceId}/events`, event).pipe(
      map(response => response.data)
    );
  }

  // ============ PUBLIC VERIFICATION ============

  /**
   * Direct verification - returns raw API response for public verify page
   */
  verifyDirect(certificateNumber: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/verify/${certificateNumber}`).pipe(
      map(response => response.data),
      catchError(() => of({ valid: false }))
    );
  }
}
