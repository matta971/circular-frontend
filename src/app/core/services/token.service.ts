import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  TokenBalance,
  TokenTransaction,
  Voucher,
  VoucherTemplate,
  TokenStatistics,
  PagedResponse
} from '../models/token.model';

/**
 * Service de gestion des tokens Circular.
 *
 * Les tokens sont une unité de valeur circulaire non-spéculative.
 * Ils permettent de débloquer des avantages chez les partenaires
 * via un système de vouchers.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private http = inject(HttpClient);
  private tokenUrl = `${environment.apiUrl}/tokens`;
  private voucherUrl = `${environment.apiUrl}/vouchers`;

  /**
   * Subject pour notifier les composants d'un changement de solde.
   * Les composants peuvent s'abonner à balanceChanged$ pour se rafraîchir.
   */
  private balanceChangedSubject = new Subject<void>();
  readonly balanceChanged$ = this.balanceChangedSubject.asObservable();

  /**
   * Notifie les composants abonnés qu'un changement de solde a eu lieu.
   */
  notifyBalanceChanged(): void {
    this.balanceChangedSubject.next();
  }

  // ==================== Token Balance ====================

  /**
   * Récupère le solde de tokens de l'utilisateur connecté.
   */
  getMyBalance(): Observable<TokenBalance> {
    return this.http.get<TokenBalance>(`${this.tokenUrl}/balance`);
  }

  /**
   * Récupère le solde de tokens d'un utilisateur (admin).
   */
  getBalanceForUser(userId: number): Observable<TokenBalance> {
    return this.http.get<TokenBalance>(`${this.tokenUrl}/balance/${userId}`);
  }

  // ==================== Token Transactions ====================

  /**
   * Récupère l'historique des transactions de l'utilisateur connecté.
   */
  getMyTransactions(page = 0, size = 20): Observable<PagedResponse<TokenTransaction>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<TokenTransaction>>(`${this.tokenUrl}/transactions`, { params });
  }

  /**
   * Récupère les 10 dernières transactions.
   */
  getRecentTransactions(): Observable<TokenTransaction[]> {
    return this.http.get<TokenTransaction[]>(`${this.tokenUrl}/transactions/recent`);
  }

  /**
   * Récupère les transactions d'un utilisateur (admin).
   */
  getTransactionsForUser(userId: number, page = 0, size = 20): Observable<PagedResponse<TokenTransaction>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<TokenTransaction>>(`${this.tokenUrl}/transactions/${userId}`, { params });
  }

  // ==================== Token Statistics (Admin) ====================

  /**
   * Récupère les statistiques globales des tokens.
   */
  getStatistics(): Observable<TokenStatistics> {
    return this.http.get<TokenStatistics>(`${this.tokenUrl}/statistics`);
  }

  // ==================== Voucher Templates ====================

  /**
   * Récupère tous les templates de vouchers disponibles.
   */
  getVoucherTemplates(): Observable<VoucherTemplate[]> {
    return this.http.get<VoucherTemplate[]>(`${this.voucherUrl}/templates`);
  }

  /**
   * Récupère les templates échangeables par l'utilisateur.
   */
  getRedeemableTemplates(): Observable<VoucherTemplate[]> {
    return this.http.get<VoucherTemplate[]>(`${this.voucherUrl}/templates/redeemable`);
  }

  // ==================== Vouchers ====================

  /**
   * Échange des tokens contre un voucher.
   * Notifie les composants du changement de solde après l'opération.
   */
  redeemVoucher(templateId: number): Observable<Voucher> {
    return this.http.post<Voucher>(`${this.voucherUrl}/redeem/${templateId}`, {}).pipe(
      tap(() => this.notifyBalanceChanged())
    );
  }

  /**
   * Récupère les vouchers de l'utilisateur connecté.
   */
  getMyVouchers(page = 0, size = 20): Observable<PagedResponse<Voucher>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<Voucher>>(this.voucherUrl, { params });
  }

  /**
   * Récupère les vouchers actifs de l'utilisateur connecté.
   */
  getActiveVouchers(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(`${this.voucherUrl}/active`);
  }

  /**
   * Récupère un voucher par son code.
   */
  getVoucherByCode(code: string): Observable<Voucher> {
    return this.http.get<Voucher>(`${this.voucherUrl}/code/${code}`);
  }

  /**
   * Annule un voucher et récupère les tokens.
   * Notifie les composants du changement de solde après l'opération.
   */
  cancelVoucher(voucherId: number): Observable<Voucher> {
    return this.http.delete<Voucher>(`${this.voucherUrl}/${voucherId}`).pipe(
      tap(() => this.notifyBalanceChanged())
    );
  }

  /**
   * Récupère les vouchers utilisables chez un partenaire.
   */
  getVouchersForPartner(partnerId: number): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(`${this.voucherUrl}/partner/${partnerId}`);
  }

  // ==================== Admin Voucher Templates ====================

  /**
   * Crée un nouveau template de voucher (admin).
   */
  createVoucherTemplate(template: Partial<VoucherTemplate>): Observable<VoucherTemplate> {
    return this.http.post<VoucherTemplate>(`${this.voucherUrl}/admin/templates`, template);
  }

  /**
   * Met à jour un template de voucher (admin).
   */
  updateVoucherTemplate(id: number, template: Partial<VoucherTemplate>): Observable<VoucherTemplate> {
    return this.http.put<VoucherTemplate>(`${this.voucherUrl}/admin/templates/${id}`, template);
  }

  /**
   * Active ou désactive un template (admin).
   */
  setTemplateActive(id: number, active: boolean): Observable<void> {
    const params = new HttpParams().set('active', active.toString());
    return this.http.patch<void>(`${this.voucherUrl}/admin/templates/${id}/active`, null, { params });
  }

  /**
   * Récupère les statistiques des vouchers (admin).
   */
  getVoucherStatistics(): Observable<any> {
    return this.http.get<any>(`${this.voucherUrl}/admin/statistics`);
  }
}
