import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailRestService {
  constructor(private readonly httpClient: HttpClient) {}

  sendContactUsEmail(postBody: any): Observable<any> {
    const url = `${environment.apiBaseUrl}/email/contact-us`;

    return this.httpClient.post(url, postBody);
  }
}
