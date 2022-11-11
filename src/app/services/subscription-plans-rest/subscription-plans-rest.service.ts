import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ISubscriptionPlan } from '../../models/subscription-plans.model';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPlansRestService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly storageService: StorageService
  ) {}

  getSubscriptionPlans(): Observable<ISubscriptionPlan[]> {
    const userId = this.storageService.getUserId();
    const accessToken = this.storageService.getAccessToken();
    const url = `${environment.apiBaseUrl}/subscription-plans/all`;

    return this.httpClient.get<ISubscriptionPlan[]>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
}
