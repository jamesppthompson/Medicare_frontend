import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, finalize, map, shareReplay } from 'rxjs/operators';
import { ISubscribedPlan } from 'src/app/models/subscribed-plans.model';
import { SubscribedPlanRestService } from 'src/app/services/subscribed-plan-rest/subscribed-plan-rest.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class SubscribedPlanService {
  private readonly loadedSub$ = new BehaviorSubject<boolean>(false);
  public readonly loaded$ = this.loadedSub$.asObservable();

  private readonly loadingSub$ = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSub$.asObservable();

  private readonly errorSub$ = new BehaviorSubject<any>(null);
  public readonly error$ = this.loadingSub$.asObservable();

  private readonly subscribedPlanSub$ = new BehaviorSubject<ISubscribedPlan[]>(
    []
  );
  public readonly subscribedPlan$ = this.subscribedPlanSub$.asObservable();

  private readonly subscribedPlanForProcessingPaymentSub$ =
    new BehaviorSubject<ISubscribedPlan | null>(null);
  public readonly subscribedPlanForProcessingPayment$ =
    this.subscribedPlanForProcessingPaymentSub$.asObservable();

  /* public readonly subscribedPlanForProcessingPayment$ =
    this.subscribedPlan$.pipe(
      map((subscribedPlans) => subscribedPlans[0]),
      filter(
        (subscribedPlan) =>
          subscribedPlan.subscriptionStartDate === null &&
          subscribedPlan.subscriptionEndDate == null
      )
    ); */

  private readonly selectedSubscribedPlanSub$ =
    new BehaviorSubject<ISubscribedPlan | null>(null);
  public readonly selectedSubscribedPlan$ =
    this.selectedSubscribedPlanSub$.asObservable();

  public validSubscribedPlan$ = this.subscribedPlan$.pipe(
    map((sps) => {
      return sps
        .filter((sp) => sp.subscriptionEndDate && sp.subscriptionStartDate)
        .filter((sp) => moment(sp.subscriptionEndDate) >= moment());
    })
  );

  constructor(
    private readonly subscribedPlanRestService: SubscribedPlanRestService
  ) {}

  loadSubscribedPlans(hardReload = false) {
    if (
      hardReload === true ||
      (!this.loadedSub$.value === false && this.loadingSub$.value === false)
    ) {
      this.loadedSub$.next(false);
      this.loadingSub$.next(true);
      this.errorSub$.next(null);

      this.subscribedPlanRestService
        .getSubscribedPlans()
        .pipe(
          finalize(() => {
            this.loadingSub$.next(false);
          })
        )
        .subscribe(
          (getsubscribedPlanSucRes) => {
            this.subscribedPlanSub$.next(getsubscribedPlanSucRes || []);
            this.loadedSub$.next(true);
            this.loadingSub$.next(false);
          },
          (getsubscribedPlanErrRes) => {
            this.loadedSub$.next(false);
            this.errorSub$.next(getsubscribedPlanErrRes.error.message);
          }
        );
    }
  }

  setSubscribedPlanForProcessingPayment(
    subscribedPlanForProcessingPayment: ISubscribedPlan | null
  ) {
    this.subscribedPlanForProcessingPaymentSub$.next(
      subscribedPlanForProcessingPayment
    );
  }
}
