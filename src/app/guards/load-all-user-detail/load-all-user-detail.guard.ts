import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AllUserDetailService } from 'src/app/+state/all-user-detail/all-user-detail.service';

@Injectable({
  providedIn: 'root',
})
export class LoadAllUserDetailGuard implements CanActivate {
  constructor(private readonly allUserDetailService: AllUserDetailService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.allUserDetailService.loadAllUserDetails();
    return true;
  }
}
