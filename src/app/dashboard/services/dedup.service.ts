import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerListResponse, CustomerByPhoneResponse } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class DedupService {
  private readonly apiUrl = 'http://localhost:3000/api/dedup';

  constructor(private http: HttpClient) {}

  /**
   * Get paginated customer/sales data list
   * @param limit - Number of items per page
   * @param offset - Offset (pageIndex × limit)
   * @param fromDate - Optional start date filter
   * @param toDate - Optional end date filter
   */
  getCustomerList(
    limit: number = 100,
    offset: number = 0,
    fromDate?: string,
    toDate?: string
  ): Observable<CustomerListResponse> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get<CustomerListResponse>(this.apiUrl, { params });
  }

  /**
   * Search customer by phone number
   * @param phone - Phone number to search
   */
  searchByPhone(phone: string): Observable<CustomerByPhoneResponse> {
    return this.http.get<CustomerByPhoneResponse>(`${this.apiUrl}/row/by-phone/${phone}`);
  }
}
