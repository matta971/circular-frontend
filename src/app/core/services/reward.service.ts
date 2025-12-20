import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';

export interface RewardTransaction {
  id: number;
  userId: number;
  deviceId?: number;
  amount: number;
  currency: string;
  reason: string;
  status: 'PENDING' | 'PROCESSED' | 'CANCELLED';
  createdAt: Date;
  processedAt?: Date;
}

export interface PagedRewards {
  content: RewardTransaction[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private readonly apiUrl = `${environment.apiUrl}/rewards`;

  constructor(private http: HttpClient) {}

  getUserRewards(userId: number, page = 0, size = 10): Observable<PagedRewards> {
    return this.http.get<ApiResponse<PagedRewards>>(`${this.apiUrl}/user/${userId}?page=${page}&size=${size}`).pipe(
      map(response => response.data),
      catchError(() => {
        // Mock data for development
        return of({
          content: this.getMockTransactions(),
          totalElements: 6,
          totalPages: 1,
          page: 0,
          size: 10
        });
      })
    );
  }

  getTotalRewards(userId: number): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/user/${userId}/total`).pipe(
      map(response => response.data),
      catchError(() => of(127.50)) // Mock total
    );
  }

  private getMockTransactions(): RewardTransaction[] {
    return [
      {
        id: 1,
        userId: 1,
        deviceId: 1,
        amount: 85.00,
        currency: 'EUR',
        reason: 'Recyclage iPhone 12 Pro',
        status: 'PROCESSED',
        createdAt: new Date(2024, 11, 5),
        processedAt: new Date(2024, 11, 6)
      },
      {
        id: 2,
        userId: 1,
        amount: -50.00,
        currency: 'EUR',
        reason: 'Retrait bancaire',
        status: 'PROCESSED',
        createdAt: new Date(2024, 11, 1),
        processedAt: new Date(2024, 11, 2)
      },
      {
        id: 3,
        userId: 1,
        deviceId: 2,
        amount: 45.00,
        currency: 'EUR',
        reason: 'Recyclage MacBook Pro 2019',
        status: 'PENDING',
        createdAt: new Date(2024, 10, 28)
      },
      {
        id: 4,
        userId: 1,
        deviceId: 3,
        amount: 42.50,
        currency: 'EUR',
        reason: 'Recyclage Samsung Galaxy S21',
        status: 'PROCESSED',
        createdAt: new Date(2024, 10, 20),
        processedAt: new Date(2024, 10, 21)
      },
      {
        id: 5,
        userId: 1,
        amount: -120.00,
        currency: 'EUR',
        reason: 'Retrait bancaire',
        status: 'PROCESSED',
        createdAt: new Date(2024, 10, 15),
        processedAt: new Date(2024, 10, 16)
      },
      {
        id: 6,
        userId: 1,
        deviceId: 4,
        amount: 35.00,
        currency: 'EUR',
        reason: 'Recyclage iPad Air 4',
        status: 'PROCESSED',
        createdAt: new Date(2024, 10, 10),
        processedAt: new Date(2024, 10, 11)
      }
    ];
  }
}
