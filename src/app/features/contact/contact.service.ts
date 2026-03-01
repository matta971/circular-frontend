import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/models/api-response.model';

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  phone?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/contact`;

  submitContactForm(data: ContactFormData): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.apiUrl, data);
  }
}
