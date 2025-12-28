import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PagedResponse } from '../../../core/models';
import {
  PartnerOpsDashboard,
  OpsCollection,
  OpsDropOff,
  OpsDevice,
  OpsDeviceStats,
  DeviceFinalization,
  FinalizeDeviceRequest,
  ReceiveCollectionRequest,
  ReceiveDropOffRequest,
  DiagnosisUpdateRequest,
  DecisionDraftRequest,
  CloseExecutionRequest,
  PrepareTransferRequest,
  MarkSentRequest,
  MarkReceivedRequest,
  AttachProofRequest,
  OpenDisputeRequest,
  ResolveDisputeRequest,
  DeviceDispute,
  ThirdPartyTransfer
} from '../models/partner-ops.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerOpsService {
  private readonly opsUrl = `${environment.apiUrl}/ops`;
  private readonly devicesUrl = `${environment.apiUrl}/ops/devices`;

  constructor(private http: HttpClient) {}

  // ========== Dashboard ==========

  getDashboard(): Observable<ApiResponse<PartnerOpsDashboard>> {
    return this.http.get<ApiResponse<PartnerOpsDashboard>>(`${this.opsUrl}/dashboard`);
  }

  // ========== Collections ==========

  getCollections(page = 0, size = 20, statuses?: string[]): Observable<ApiResponse<PagedResponse<OpsCollection>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (statuses && statuses.length > 0) {
      statuses.forEach(s => params = params.append('statuses', s));
    }

    return this.http.get<ApiResponse<PagedResponse<OpsCollection>>>(`${this.opsUrl}/collections`, { params });
  }

  getCollectionsPending(): Observable<ApiResponse<OpsCollection[]>> {
    return this.http.get<ApiResponse<OpsCollection[]>>(`${this.opsUrl}/collections/pending`);
  }

  receiveCollection(id: number, request?: ReceiveCollectionRequest): Observable<ApiResponse<OpsCollection>> {
    return this.http.post<ApiResponse<OpsCollection>>(`${this.opsUrl}/collections/${id}/receive`, request || {});
  }

  // ========== Drop-offs ==========

  getDropOffs(page = 0, size = 20, statuses?: string[]): Observable<ApiResponse<PagedResponse<OpsDropOff>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (statuses && statuses.length > 0) {
      statuses.forEach(s => params = params.append('statuses', s));
    }

    return this.http.get<ApiResponse<PagedResponse<OpsDropOff>>>(`${this.opsUrl}/dropoffs`, { params });
  }

  getDropOffsPending(): Observable<ApiResponse<OpsDropOff[]>> {
    return this.http.get<ApiResponse<OpsDropOff[]>>(`${this.opsUrl}/dropoffs/pending`);
  }

  receiveDropOff(id: number, request?: ReceiveDropOffRequest): Observable<ApiResponse<OpsDropOff>> {
    return this.http.post<ApiResponse<OpsDropOff>>(`${this.opsUrl}/dropoffs/${id}/receive`, request || {});
  }

  // ========== Devices ==========

  getDevices(page = 0, size = 20, statuses?: string[]): Observable<ApiResponse<PagedResponse<OpsDevice>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (statuses && statuses.length > 0) {
      statuses.forEach(s => params = params.append('statuses', s));
    }

    return this.http.get<ApiResponse<PagedResponse<OpsDevice>>>(`${this.devicesUrl}`, { params });
  }

  getDevicesPending(): Observable<ApiResponse<OpsDevice[]>> {
    return this.http.get<ApiResponse<OpsDevice[]>>(`${this.devicesUrl}/pending`);
  }

  getDevice(id: number): Observable<ApiResponse<OpsDevice>> {
    return this.http.get<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}`);
  }

  receiveDevice(id: number): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/receive`, {});
  }

  finalizeDevice(id: number, request: FinalizeDeviceRequest): Observable<ApiResponse<DeviceFinalization>> {
    return this.http.post<ApiResponse<DeviceFinalization>>(`${this.devicesUrl}/${id}/finalize`, request);
  }

  getDeviceStats(): Observable<ApiResponse<OpsDeviceStats>> {
    return this.http.get<ApiResponse<OpsDeviceStats>>(`${this.devicesUrl}/stats`);
  }

  // ========== Device Workflow ==========

  // Hold management
  putOnHold(id: number, reason: string): Observable<ApiResponse<OpsDevice>> {
    return this.http.put<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/hold`, { reason });
  }

  resumeFromHold(id: number): Observable<ApiResponse<OpsDevice>> {
    return this.http.delete<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/hold`);
  }

  // Review & Diagnosis
  startReview(id: number): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/review/start`, {});
  }

  undoReview(id: number): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/review/undo`, {});
  }

  updateDiagnosis(id: number, request: DiagnosisUpdateRequest): Observable<ApiResponse<OpsDevice>> {
    return this.http.put<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/diagnosis`, request);
  }

  confirmDiagnosis(id: number): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/diagnosis/confirm`, {});
  }

  reopenReview(id: number): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/diagnosis/reopen`, {});
  }

  // Decision
  draftDecision(id: number, request: DecisionDraftRequest): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/decision`, request);
  }

  editDecision(id: number, request: DecisionDraftRequest): Observable<ApiResponse<OpsDevice>> {
    return this.http.put<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/decision`, request);
  }

  confirmDecision(id: number): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/decision/confirm`, {});
  }

  // Execution
  startExecution(id: number): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/execution/start`, {});
  }

  closeExecution(id: number, request: CloseExecutionRequest): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/execution/close`, request);
  }

  // Third-party transfer
  getTransfer(id: number): Observable<ApiResponse<ThirdPartyTransfer>> {
    return this.http.get<ApiResponse<ThirdPartyTransfer>>(`${this.devicesUrl}/${id}/transfer`);
  }

  prepareTransfer(id: number, request: PrepareTransferRequest): Observable<ApiResponse<ThirdPartyTransfer>> {
    return this.http.post<ApiResponse<ThirdPartyTransfer>>(`${this.devicesUrl}/${id}/transfer/prepare`, request);
  }

  markTransferSent(id: number, request: MarkSentRequest): Observable<ApiResponse<ThirdPartyTransfer>> {
    return this.http.post<ApiResponse<ThirdPartyTransfer>>(`${this.devicesUrl}/${id}/transfer/send`, request);
  }

  markTransferReceived(id: number, request: MarkReceivedRequest): Observable<ApiResponse<ThirdPartyTransfer>> {
    return this.http.post<ApiResponse<ThirdPartyTransfer>>(`${this.devicesUrl}/${id}/transfer/receive`, request);
  }

  markThirdPartyProcessing(id: number): Observable<ApiResponse<ThirdPartyTransfer>> {
    return this.http.post<ApiResponse<ThirdPartyTransfer>>(`${this.devicesUrl}/${id}/transfer/processing`, {});
  }

  closeTransfer(id: number, request: AttachProofRequest): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/transfer/close`, request);
  }

  // Disputes
  getDeviceDisputes(id: number): Observable<ApiResponse<DeviceDispute[]>> {
    return this.http.get<ApiResponse<DeviceDispute[]>>(`${this.devicesUrl}/${id}/disputes`);
  }

  openDispute(id: number, request: OpenDisputeRequest): Observable<ApiResponse<DeviceDispute>> {
    return this.http.post<ApiResponse<DeviceDispute>>(`${this.devicesUrl}/${id}/disputes`, request);
  }

  getDisputes(): Observable<ApiResponse<DeviceDispute[]>> {
    return this.http.get<ApiResponse<DeviceDispute[]>>(`${this.opsUrl}/disputes`);
  }

  getActiveDisputes(): Observable<ApiResponse<DeviceDispute[]>> {
    return this.http.get<ApiResponse<DeviceDispute[]>>(`${this.opsUrl}/disputes/active`);
  }

  resolveDispute(disputeId: number, request: ResolveDisputeRequest): Observable<ApiResponse<DeviceDispute>> {
    return this.http.put<ApiResponse<DeviceDispute>>(`${this.opsUrl}/disputes/${disputeId}/resolve`, request);
  }

  // Cancel
  cancelDevice(id: number, reason: string): Observable<ApiResponse<OpsDevice>> {
    return this.http.post<ApiResponse<OpsDevice>>(`${this.devicesUrl}/${id}/cancel`, { reason });
  }
}
