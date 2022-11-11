import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ISubscriptionPlan } from '../../models/subscription-plans.model';
import { SubscriptionPlansRestService } from '../../services/subscription-plans-rest/subscription-plans-rest.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPlansService {
  private readonly loadedSub$ = new BehaviorSubject<boolean>(false);
  public readonly loaded$ = this.loadedSub$.asObservable();

  private readonly loadingSub$ = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSub$.asObservable();

  private readonly errorSub$ = new BehaviorSubject<any>(null);
  public readonly error$ = this.loadingSub$.asObservable();

  private readonly subscriptionPlansSub$ = new BehaviorSubject<
    ISubscriptionPlan[]
  >([]);

  public readonly subscriptionPlans$ =
    this.subscriptionPlansSub$.asObservable();

  constructor(
    private readonly subscriptionPlansRestService: SubscriptionPlansRestService
  ) {}

  loadSubscriptionPlans(hardReload = false) {
    if (
      this.loadedSub$.value === false &&
      (hardReload === true || this.loadedSub$.value === false)
    ) {
      this.loadedSub$.next(false);
      this.loadingSub$.next(true);
      this.errorSub$.next(null);

      this.subscriptionPlansRestService
        .getSubscriptionPlans()
        .pipe(
          finalize(() => {
            this.loadingSub$.next(false);
          })
        )
        .subscribe(
          (getsubscriptionPlansSucRes) => {
            this.subscriptionPlansSub$.next(getsubscriptionPlansSucRes || []);
            this.loadedSub$.next(true);
            this.loadingSub$.next(false);
          },
          (getsubscriptionPlansErrRes) => {
            this.loadedSub$.next(false);
            this.errorSub$.next(getsubscriptionPlansErrRes.error.message);
          }
        );
    }
  }
}
