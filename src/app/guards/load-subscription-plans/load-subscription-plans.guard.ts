import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SubscriptionPlansService } from '../../+state/subscription-plans/subscription-plans.service';

@Injectable({
  providedIn: 'root',
})
export class LoadSubscriptionPlansGuard implements CanActivate {
  constructor(
    private readonly subscriptionPlansService: SubscriptionPlansService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.subscriptionPlansService.loadSubscriptionPlans();
    return true;
  }
}
