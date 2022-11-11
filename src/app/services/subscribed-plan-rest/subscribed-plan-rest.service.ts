import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubscribedPlan } from 'src/app/models/subscribed-plans.model';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SubscribedPlanRestService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly storageService: StorageService
  ) {}

  createSubscribedPlan(subscriptionPlanId: number): Observable<ISubscribedPlan> {
    const userId = this.storageService.getUserId();
    const accessToken = this.storageService.getAccessToken();
    const url = `${environment.apiBaseUrl}/subscribed-plans`;
    const headers = { Authorization: `Bearer ${accessToken}` };

    return this.httpClient.post<ISubscribedPlan>(
      url,
      { subscriptionPlanId },
      {
        headers,
      }
    );
  }

  getSubscribedPlans(): Observable<ISubscribedPlan[]> {
    const userId = this.storageService.getUserId() || '';
    const accessToken = this.storageService.getAccessToken();
    const url = `${environment.apiBaseUrl}/subscribed-plans/find`;
    const headers = { Authorization: `Bearer ${accessToken}` };
    const params = new HttpParams().append('userId', userId);

    return this.httpClient.get<ISubscribedPlan[]>(url, {
      headers,
      params,
    });
  }
}
