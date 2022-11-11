import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RouteConstantsService {
  readonly ROUTES_PATH = {
    LOGIN_PAGE: 'system/login',
    HOME_PAGE: 'general/home',
    ADMIN_DASHBOARD_PAGE: 'admin/dashboard',
  };
}
