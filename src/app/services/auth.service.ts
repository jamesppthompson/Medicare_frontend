import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private commonservice : CommonService) { }

  public storeTokens(jwt : any) {
     localStorage.setItem('access_token', jwt);
     this.commonservice.setIsLoggedIn(true);
   }
   public getJwtToken() {
    return localStorage.getItem('access_token');
  }
  public logout() {
    this.commonservice.setIsLoggedIn(false);
  }
}
