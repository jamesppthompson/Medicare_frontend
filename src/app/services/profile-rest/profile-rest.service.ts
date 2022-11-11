import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMedicareMagicianProfile } from 'src/app/models/medicare-magician-profile.model';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileRestService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly storageService: StorageService
  ) {}

  createProfile(
    postBody: Omit<IMedicareMagicianProfile, 'id' | 'userId'>,
    accessToken: string
  ) {
    const url = `${environment.apiBaseUrl}/medicare-magician-profile`;
    return this.httpClient.post(url, postBody, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  getProfile(): Observable<IMedicareMagicianProfile> {
    const userId = this.storageService.getUserId();
    const accessToken = this.storageService.getAccessToken();
    const url = `${environment.apiBaseUrl}/medicare-magician-profile/filters?userId=${userId}`;

    return this.httpClient.get<IMedicareMagicianProfile>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
}
