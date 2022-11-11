import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileService } from '../../+state/profile/profile.service';

@Injectable({
  providedIn: 'root',
})
export class LoadProfileGuard implements CanActivate {
  constructor(private readonly profileService: ProfileService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.profileService.loadProfile();
    return true;
  }
}
