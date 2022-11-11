import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public api_end_point = environment.API_END_POINT;

  public is_loggedin = new BehaviorSubject<boolean>(false);
  onis_loggedin = this.is_loggedin.asObservable();

  public is_ChatClick = new BehaviorSubject<boolean>(false);
  onis_ChatClick = this.is_ChatClick.asObservable();

  private options: any;
  constructor(public http: HttpClient) {}

  public async SubmitPostFormData(
    url: string,
    body: any,
    options: any
  ): Promise<any> {
    try {
      const PostResponse = await this.http
        .post(this.api_end_point + url, body, options)
        .toPromise();
      return this.extractData(PostResponse);
    } catch (error) {
      return error;
    }
  }
  private extractData(response: any) {
    return response;
  }
  public async SubmitGetFormData(url: string): Promise<any> {
    try {
      const GetResponse = await this.http
        .get(this.api_end_point + url)
        .toPromise();
      return this.extractData(GetResponse);
    } catch (error) {
      return this.handleError(error);
    }
  }
  handleError(error: any): any {
    throw new Error('Method not implemented.');
  }

  public generateRequestHeaders(
    headers_para: object[] = [],
    params_para: object = {},
    reportprogress_para: boolean = false,
    responsetype_para: string = 'json',
    withCredentials_para: boolean = false
  ) {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json, multipart/form-data');
    headers.append('Cache-Control', 'no-cache');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    headers.append(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );

    this.options = {
      headers: headers,
    };
    return this.options;
  }

  setIsLoggedIn(value: boolean) {
    this.is_loggedin.next(value);
    localStorage.setItem('is_loggedin', value.toString());
  }

  ChatClick(value: boolean) {
    this.is_ChatClick.next(value);
  }
}
