import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public systemAPI = {
    Login: 'login',
    Regsiter: 'regsiter',
    Downloadlog: 'downloadlog',
    ContactUs: 'ContactUs',
    // AcceptAgreement: 'AcceptAgreement',
    sendmail: 'sendmail',
    loginpost: 'api/system/loginpost',
    ContactMail: 'contactMail',
    ForgotPassword: 'forgotPassword',
    UpdatePassword: 'UpdatePassword',
    admindashboard: 'admindashboard',
    UserInfo: 'userInfo',
  };
  public paymentAPI = {
    checkout_square: 'checkout_square',
    Pay: "Pay",
  };
}
