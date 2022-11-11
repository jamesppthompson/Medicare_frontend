import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IPayment } from '../../models/payment.model';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentRestService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly storageService: StorageService
  ) {}

  initiatePayment(subscribedPlanId: number): Observable<IPayment> {
    const url = `${environment.apiBaseUrl}/payments/initiate-payment`;
    const accessToken = this.storageService.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return this.httpClient.post<IPayment>(
      url,
      { subscribedPlanId },
      {
        headers,
      }
    );
  }

  confirmPayment(paymentGatewayRes: any) {
    const url = `${environment.apiBaseUrl}/payments/client-confirmation`;
    const accessToken = this.storageService.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return this.httpClient.put(
      url,
      { paymentGatewayRes },
      {
        headers,
      }
    );
  }
}
