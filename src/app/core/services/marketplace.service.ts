import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';
import {
  P2PListing,
  CreateListingRequest,
  ListingSearchParams,
  P2POrder,
  CreateOrderRequest,
  PaymentTransaction,
  Shipment,
  P2PDispute,
  CreateDisputeRequest,
  SellerStats,
  ListingStatus,
  OrderStatus
} from '../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private readonly apiUrl = `${environment.apiUrl}/marketplace`;
  private readonly paymentsUrl = `${environment.apiUrl}/marketplace/payments`;
  private readonly shipmentsUrl = `${environment.apiUrl}/marketplace/shipments`;
  private readonly disputesUrl = `${environment.apiUrl}/marketplace/disputes`;

  constructor(private http: HttpClient) {}

  // ============ LISTINGS ============

  searchListings(params: ListingSearchParams): Observable<{ content: P2PListing[]; totalElements: number; totalPages: number }> {
    let httpParams = new HttpParams();
    if (params.query) httpParams = httpParams.set('query', params.query);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.condition) httpParams = httpParams.set('condition', params.condition);
    if (params.minPrice) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params.brand) httpParams = httpParams.set('brand', params.brand);
    if (params.shippingAvailable !== undefined) httpParams = httpParams.set('shippingAvailable', params.shippingAvailable.toString());
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params.size) httpParams = httpParams.set('size', params.size.toString());

    return this.http.get<{ content: any[]; totalElements: number; totalPages: number }>(
      `${this.apiUrl}/listings`,
      { params: httpParams }
    ).pipe(
      map(response => ({
        content: response.content.map(this.mapListing),
        totalElements: response.totalElements,
        totalPages: response.totalPages
      })),
      catchError(() => of({ content: [], totalElements: 0, totalPages: 0 }))
    );
  }

  getListing(id: number): Observable<P2PListing | null> {
    return this.http.get<any>(`${this.apiUrl}/listings/${id}`).pipe(
      map(response => this.mapListing(response)),
      catchError(() => of(null))
    );
  }

  createListing(data: CreateListingRequest): Observable<P2PListing> {
    return this.http.post<ApiResponse<P2PListing>>(`${this.apiUrl}/listings`, data).pipe(
      map(response => response.data)
    );
  }

  updateListing(id: number, data: Partial<CreateListingRequest>): Observable<P2PListing> {
    return this.http.put<ApiResponse<P2PListing>>(`${this.apiUrl}/listings/${id}`, data).pipe(
      map(response => response.data)
    );
  }

  publishListing(id: number): Observable<P2PListing> {
    return this.http.post<ApiResponse<P2PListing>>(`${this.apiUrl}/listings/${id}/publish`, {}).pipe(
      map(response => response.data)
    );
  }

  cancelListing(id: number): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/listings/${id}/cancel`, {}).pipe(
      map(() => undefined)
    );
  }

  getMyListings(status?: ListingStatus): Observable<P2PListing[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponse<P2PListing[]>>(`${this.apiUrl}/listings/my`, { params }).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  getFavoriteListings(): Observable<P2PListing[]> {
    return this.http.get<ApiResponse<P2PListing[]>>(`${this.apiUrl}/listings/favorites`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  addToFavorites(listingId: number): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/listings/${listingId}/favorite`, {}).pipe(
      map(() => undefined)
    );
  }

  removeFromFavorites(listingId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/listings/${listingId}/favorite`).pipe(
      map(() => undefined)
    );
  }

  // ============ ORDERS ============

  createOrder(data: CreateOrderRequest): Observable<P2POrder> {
    return this.http.post<any>(`${this.apiUrl}/orders`, data).pipe(
      map(response => this.mapOrder(response))
    );
  }

  getOrder(id: number): Observable<P2POrder | null> {
    return this.http.get<any>(`${this.apiUrl}/orders/${id}`).pipe(
      map(response => this.mapOrder(response)),
      catchError(() => of(null))
    );
  }

  getMyOrders(role: 'buyer' | 'seller' = 'buyer', status?: OrderStatus): Observable<P2POrder[]> {
    let params = new HttpParams().set('role', role);
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponse<P2POrder[]>>(`${this.apiUrl}/orders/my`, { params }).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  cancelOrder(id: number, reason?: string): Observable<P2POrder> {
    return this.http.post<ApiResponse<P2POrder>>(`${this.apiUrl}/orders/${id}/cancel`, { reason }).pipe(
      map(response => response.data)
    );
  }

  confirmDelivery(id: number): Observable<P2POrder> {
    return this.http.post<ApiResponse<P2POrder>>(`${this.apiUrl}/orders/${id}/confirm-delivery`, {}).pipe(
      map(response => response.data)
    );
  }

  // ============ PAYMENTS ============

  payOrder(orderId: number): Observable<P2POrder> {
    return this.http.post<any>(`${this.apiUrl}/orders/${orderId}/pay`, {}).pipe(
      map(response => this.mapOrder(response))
    );
  }

  initiatePayment(orderId: number): Observable<PaymentTransaction> {
    return this.http.post<ApiResponse<PaymentTransaction>>(`${this.paymentsUrl}/initiate/${orderId}`, {}).pipe(
      map(response => response.data)
    );
  }

  confirmPayment(transactionRef: string): Observable<PaymentTransaction> {
    return this.http.post<ApiResponse<PaymentTransaction>>(`${this.paymentsUrl}/${transactionRef}/confirm`, {}).pipe(
      map(response => response.data)
    );
  }

  getPaymentByOrder(orderId: number): Observable<PaymentTransaction | null> {
    return this.http.get<ApiResponse<PaymentTransaction>>(`${this.paymentsUrl}/orders/${orderId}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  getEscrowPayments(): Observable<PaymentTransaction[]> {
    return this.http.get<ApiResponse<PaymentTransaction[]>>(`${this.paymentsUrl}/escrow`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  // ============ SHIPMENTS ============

  createShipment(orderId: number): Observable<Shipment> {
    return this.http.post<ApiResponse<Shipment>>(`${this.shipmentsUrl}/orders/${orderId}`, {}).pipe(
      map(response => response.data)
    );
  }

  getShipment(id: number): Observable<Shipment | null> {
    return this.http.get<ApiResponse<Shipment>>(`${this.shipmentsUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  getShipmentByOrder(orderId: number): Observable<Shipment | null> {
    return this.http.get<ApiResponse<Shipment>>(`${this.shipmentsUrl}/orders/${orderId}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  trackShipment(trackingNumber: string): Observable<Shipment | null> {
    return this.http.get<ApiResponse<Shipment>>(`${this.shipmentsUrl}/tracking/${trackingNumber}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  generateLabel(shipmentId: number): Observable<Shipment> {
    return this.http.post<ApiResponse<Shipment>>(`${this.shipmentsUrl}/${shipmentId}/label`, {}).pipe(
      map(response => response.data)
    );
  }

  markAsShipped(shipmentId: number): Observable<Shipment> {
    return this.http.post<ApiResponse<Shipment>>(`${this.shipmentsUrl}/${shipmentId}/in-transit`, {}).pipe(
      map(response => response.data)
    );
  }

  // ============ DISPUTES ============

  createDispute(data: CreateDisputeRequest): Observable<P2PDispute> {
    return this.http.post<ApiResponse<P2PDispute>>(`${this.disputesUrl}/orders/${data.orderId}`, data).pipe(
      map(response => response.data)
    );
  }

  getDispute(id: number): Observable<P2PDispute | null> {
    return this.http.get<ApiResponse<P2PDispute>>(`${this.disputesUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  getDisputeByOrder(orderId: number): Observable<P2PDispute | null> {
    return this.http.get<ApiResponse<P2PDispute>>(`${this.disputesUrl}/orders/${orderId}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  getMyDisputes(): Observable<P2PDispute[]> {
    return this.http.get<ApiResponse<P2PDispute[]>>(`${this.disputesUrl}/my`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  respondToDispute(id: number, response: string, evidenceUrls?: string[]): Observable<P2PDispute> {
    return this.http.post<ApiResponse<P2PDispute>>(`${this.disputesUrl}/${id}/respond`, { response, evidenceUrls }).pipe(
      map(res => res.data)
    );
  }

  escalateDispute(id: number): Observable<P2PDispute> {
    return this.http.post<ApiResponse<P2PDispute>>(`${this.disputesUrl}/${id}/escalate`, {}).pipe(
      map(response => response.data)
    );
  }

  // ============ SELLER STATS ============

  getSellerStats(sellerId?: number): Observable<SellerStats | null> {
    const url = sellerId ? `${this.apiUrl}/sellers/${sellerId}/stats` : `${this.apiUrl}/sellers/me/stats`;
    return this.http.get<ApiResponse<SellerStats>>(url).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  // ============ MAPPING ============

  private mapListing = (data: any): P2PListing => ({
    id: data.id,
    sellerId: data.sellerId,
    deviceId: data.deviceId,
    title: data.title,
    description: data.description,
    category: data.category || 'OTHER',
    brand: data.brand,
    model: data.model,
    condition: data.condition,
    price: data.priceEur || data.price || 0,
    negotiable: data.negotiable || false,
    images: data.imageUrls ? data.imageUrls.split(',') : [],
    status: this.mapStatus(data.status),
    viewCount: data.viewCount || 0,
    favoriteCount: data.favoriteCount || 0,
    location: data.location,
    shippingAvailable: data.shippingAvailable || false,
    shippingCost: data.shippingCost,
    meetupAvailable: data.meetupAvailable || false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    expiresAt: data.expiresAt
  });

  private mapStatus(backendStatus: string): ListingStatus {
    const statusMap: Record<string, ListingStatus> = {
      'DRAFT': ListingStatus.DRAFT,
      'PUBLISHED': ListingStatus.ACTIVE,
      'ACTIVE': ListingStatus.ACTIVE,
      'RESERVED': ListingStatus.RESERVED,
      'SOLD': ListingStatus.SOLD,
      'EXPIRED': ListingStatus.EXPIRED,
      'CANCELLED': ListingStatus.CANCELLED
    };
    return statusMap[backendStatus] || ListingStatus.DRAFT;
  }

  private mapOrder = (data: any): P2POrder => ({
    id: data.id,
    orderNumber: data.orderRef,
    listingId: data.listingId,
    buyerId: data.buyerId,
    sellerId: data.sellerId,
    price: data.itemPriceEur,
    shippingCost: data.shippingCostEur,
    totalAmount: data.totalAmountEur,
    status: data.status as OrderStatus,
    deliveryMethod: data.deliveryMethod || 'SHIPPING',
    createdAt: data.createdAt,
    paidAt: data.paidAt,
    shippedAt: data.shippedAt,
    deliveredAt: data.deliveredAt,
    completedAt: data.completedAt
  });
}
