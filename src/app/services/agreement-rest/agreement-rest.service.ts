import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAgreement } from '../../models/agreement.model';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AgreementRestService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly storageService: StorageService
  ) {}

  createAgreement(
    agreementPostBody: Omit<IAgreement, 'userId'>
  ): Observable<IAgreement> {
    const userId = this.storageService.getUserId();
    const accessToken = this.storageService.getAccessToken();
    const url = `${environment.apiBaseUrl}/medicare-magician-agreement`;
    const headers = { Authorization: `Bearer ${accessToken}` };

    return this.httpClient.post<IAgreement>(url, agreementPostBody, {
      headers,
    });
  }
}
