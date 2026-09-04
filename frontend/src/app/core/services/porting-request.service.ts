import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreatePortingRequestDto, PortingRequestResponseDto } from '../../models/porting-request.model';
import { PagedResponseDto } from '../../models/paged-response.model';
import { PhoneStatusResponseDto } from '../../models/phone-status.model';

@Injectable({ providedIn: 'root' })
export class PortingRequestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/porting-requests`;
  private readonly phoneNumbersUrl = `${environment.apiUrl}/phone-numbers`;

  create(dto: CreatePortingRequestDto): Observable<PortingRequestResponseDto> {
    return this.http.post<PortingRequestResponseDto>(this.baseUrl, dto);
  }

  accept(id: number): Observable<PortingRequestResponseDto> {
    return this.http.post<PortingRequestResponseDto>(`${this.baseUrl}/${id}/accept`, {});
  }

  reject(id: number): Observable<PortingRequestResponseDto> {
    return this.http.post<PortingRequestResponseDto>(`${this.baseUrl}/${id}/reject`, {});
  }

  list(page: number = 0, size: number = 20): Observable<PagedResponseDto<PortingRequestResponseDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponseDto<PortingRequestResponseDto>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<PortingRequestResponseDto> {
    return this.http.get<PortingRequestResponseDto>(`${this.baseUrl}/${id}`);
  }

  getPhoneStatus(phoneNumber: string): Observable<PhoneStatusResponseDto> {
    return this.http.get<PhoneStatusResponseDto>(`${this.phoneNumbersUrl}/${phoneNumber}/status`);
  }
}
