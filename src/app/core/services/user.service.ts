import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, User, Address, WalletResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`);
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }

  getWallet(userId: number): Observable<ApiResponse<WalletResponse>> {
    return this.http.get<ApiResponse<WalletResponse>>(`${this.apiUrl}/${userId}/wallet`);
  }

  getAddresses(userId: number): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(`${this.apiUrl}/${userId}/addresses`);
  }

  addAddress(userId: number, address: Partial<Address>): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(`${this.apiUrl}/${userId}/addresses`, address);
  }

  updateAddress(userId: number, addressId: number, address: Partial<Address>): Observable<ApiResponse<Address>> {
    return this.http.put<ApiResponse<Address>>(`${this.apiUrl}/${userId}/addresses/${addressId}`, address);
  }

  deleteAddress(userId: number, addressId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${userId}/addresses/${addressId}`);
  }
}
