import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserFullDetail } from 'src/app/models/users-full-detail.model';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AdminRestService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly storageService: StorageService
  ) {}

  getAllUserDetails() {
    const url = `${environment.apiBaseUrl}/admin/all-users`;
    const accessToken = this.storageService.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return this.httpClient.get<IUserFullDetail[]>(url, { headers });
  }
}
