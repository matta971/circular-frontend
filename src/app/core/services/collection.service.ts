import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  CollectionRequest,
  CreateCollectionRequest,
  CollectionItem,
  DropOffPoint,
  DropOff,
  CreateDropOffRequest,
  CollectionStatus
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private readonly apiUrl = `${environment.apiUrl}/collections`;
  private readonly depositsUrl = `${environment.apiUrl}/deposits`;

  constructor(private http: HttpClient) {}

  // Collections
  createCollection(data: CreateCollectionRequest): Observable<CollectionRequest> {
    return this.http.post<ApiResponse<CollectionRequest>>(this.apiUrl, data).pipe(
      map(response => response.data),
      catchError(() => {
        // Mock response for development
        return of({
          id: Math.floor(Math.random() * 10000),
          userId: 1,
          addressId: 1,
          status: CollectionStatus.REQUESTED,
          plannedDate: data.preferredDate,
          plannedTimeStart: data.preferredTimeStart,
          plannedTimeEnd: data.preferredTimeEnd,
          notes: data.notes,
          items: data.items,
          requestedAt: new Date().toISOString()
        } as CollectionRequest);
      })
    );
  }

  getCollection(id: number): Observable<CollectionRequest> {
    return this.http.get<ApiResponse<CollectionRequest>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(() => {
        // Mock response for development
        return of({
          id: id,
          userId: 1,
          addressId: 1,
          address: {
            line1: '15 rue de Paris',
            postalCode: '75001',
            city: 'Paris',
            country: 'France'
          },
          status: CollectionStatus.PLANNED,
          plannedDate: new Date().toISOString().split('T')[0],
          plannedTimeStart: '14:00',
          plannedTimeEnd: '18:00',
          notes: 'Code porte: 1234',
          items: [
            { id: 1, deviceType: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 12', condition: 'GOOD' },
            { id: 2, deviceType: 'LAPTOP', brand: 'Dell', model: 'XPS 15', condition: 'FAIR' }
          ],
          requestedAt: new Date().toISOString()
        } as CollectionRequest);
      })
    );
  }

  getMyCollections(page = 0, size = 10): Observable<CollectionRequest[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<{ content: CollectionRequest[] }>>(`${this.apiUrl}/my`, { params }).pipe(
      map(response => response.data.content),
      catchError(() => {
        // Mock response for development
        return of([
          {
            id: 1,
            userId: 1,
            addressId: 1,
            address: { line1: '15 rue de Paris', postalCode: '75001', city: 'Paris', country: 'France' },
            status: CollectionStatus.REQUESTED,
            plannedDate: new Date().toISOString().split('T')[0],
            plannedTimeStart: '14:00',
            plannedTimeEnd: '18:00',
            items: [{ id: 1, deviceType: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 12', condition: 'GOOD' }],
            requestedAt: new Date().toISOString()
          },
          {
            id: 2,
            userId: 1,
            addressId: 1,
            address: { line1: '8 avenue des Champs', postalCode: '75008', city: 'Paris', country: 'France' },
            status: CollectionStatus.COMPLETED,
            plannedDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
            plannedTimeStart: '08:00',
            plannedTimeEnd: '12:00',
            items: [
              { id: 2, deviceType: 'LAPTOP', brand: 'Dell', model: 'XPS 15', condition: 'FAIR' },
              { id: 3, deviceType: 'TABLET', brand: 'Samsung', model: 'Galaxy Tab S7', condition: 'GOOD' }
            ],
            requestedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            completedAt: new Date(Date.now() - 86400000 * 3).toISOString()
          }
        ] as CollectionRequest[]);
      })
    );
  }

  cancelCollection(id: number): Observable<CollectionRequest> {
    return this.http.post<ApiResponse<CollectionRequest>>(`${this.apiUrl}/${id}/cancel`, {}).pipe(
      map(response => response.data),
      catchError(() => {
        return of({
          id: id,
          userId: 1,
          status: CollectionStatus.CANCELLED
        } as CollectionRequest);
      })
    );
  }

  startCollection(id: number): Observable<CollectionRequest> {
    return this.http.post<ApiResponse<CollectionRequest>>(`${this.apiUrl}/${id}/start`, {}).pipe(
      map(response => response.data)
    );
  }

  completeCollection(id: number): Observable<CollectionRequest> {
    return this.http.post<ApiResponse<CollectionRequest>>(`${this.apiUrl}/${id}/complete`, {}).pipe(
      map(response => response.data)
    );
  }

  scanItem(collectionId: number, itemId: number, data: Partial<CollectionItem>): Observable<CollectionItem> {
    return this.http.post<ApiResponse<CollectionItem>>(`${this.apiUrl}/${collectionId}/items/${itemId}/scan`, data).pipe(
      map(response => response.data)
    );
  }

  addItem(collectionId: number, item: CollectionItem): Observable<CollectionItem> {
    return this.http.post<ApiResponse<CollectionItem>>(`${this.apiUrl}/${collectionId}/items`, item).pipe(
      map(response => response.data)
    );
  }

  // Drop-off points
  getDropOffPoints(): Observable<DropOffPoint[]> {
    return this.http.get<ApiResponse<DropOffPoint[]>>(`${this.depositsUrl}/points`).pipe(
      map(response => response.data),
      catchError(() => of([
        { id: 1, name: 'Fnac Châtelet', address: '1 rue Pierre Lescot', postalCode: '75001', city: 'Paris', openingHours: 'Lun-Sam: 10h-20h' },
        { id: 2, name: 'Darty Beaubourg', address: '15 rue du Temple', postalCode: '75004', city: 'Paris', openingHours: 'Lun-Sam: 9h30-19h30' },
        { id: 3, name: 'Eco-systèmes Paris Centre', address: '50 rue de Rivoli', postalCode: '75004', city: 'Paris', openingHours: 'Lun-Ven: 8h-18h' }
      ] as DropOffPoint[]))
    );
  }

  getDropOffPointsByCity(city: string): Observable<DropOffPoint[]> {
    return this.http.get<ApiResponse<DropOffPoint[]>>(`${this.depositsUrl}/points/city/${city}`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  // Drop-offs
  createDropOff(data: CreateDropOffRequest): Observable<DropOff> {
    return this.http.post<ApiResponse<DropOff>>(this.depositsUrl, data).pipe(
      map(response => response.data)
    );
  }

  getDropOffByCode(code: string): Observable<DropOff> {
    return this.http.get<ApiResponse<DropOff>>(`${this.depositsUrl}/code/${code}`).pipe(
      map(response => response.data)
    );
  }

  getMyDropOffs(): Observable<DropOff[]> {
    return this.http.get<ApiResponse<DropOff[]>>(`${this.depositsUrl}/my`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  completeDropOff(code: string, actualItemCount: number): Observable<DropOff> {
    return this.http.post<ApiResponse<DropOff>>(`${this.depositsUrl}/code/${code}/complete?actualItemCount=${actualItemCount}`, {}).pipe(
      map(response => response.data)
    );
  }
}
