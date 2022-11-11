import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
@Injectable()
export class AuthInterceptorService  implements HttpInterceptor {
  constructor(public authService: AuthService){
    
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if( localStorage.getItem('is_loggedin') == 'true' ){
        req = req.clone({
          setHeaders: {
            'Content-Type' : 'application/json; charset=utf-8',
            'Accept'       : 'application/json',
            //'Authorization': `Bearer ${this.authService.getJwtToken()}`,
          },
        });
    }
    else{
      req = req.clone({
        setHeaders: {
          'Content-Type' : 'application/json; charset=utf-8',
          'Accept'       : 'application/json',
        },
      });
    }
    return next.handle(req);
  }
}
