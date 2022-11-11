import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthRestService {
  constructor(private readonly httpClient: HttpClient) {}

  signup(postBody: any) {
    const url = `${environment.apiBaseUrl}/auth/signup/profile`;
    return this.httpClient.post(url, postBody);
  }

  sigin(postBody: any) {
    const url = `${environment.apiBaseUrl}/auth/signin`;
    return this.httpClient.post(url, postBody);
  }
}
