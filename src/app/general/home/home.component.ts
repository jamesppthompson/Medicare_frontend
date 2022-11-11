import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { concat, Subscription, throwError } from 'rxjs';
import { ISubscriptionPlan } from '../../models/subscription-plans.model';
import { ProfileService } from '../../+state/profile/profile.service';
import { SubscriptionPlansService } from '../../+state/subscription-plans/subscription-plans.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { RouteConstantsService } from '../../services/route-constants/route-constants.service';
import { StorageService } from '../../services/storage/storage.service';
import { AgreementRestService } from '../../services/agreement-rest/agreement-rest.service';
import { catchError, filter, finalize, map, take, tap } from 'rxjs/operators';
import { SubscribedPlanRestService } from 'src/app/services/subscribed-plan-rest/subscribed-plan-rest.service';
import { SubscribedPlanService } from 'src/app/+state/subscribed-plan/subscribed-plan.service';
import { ISubscribedPlan } from 'src/app/models/subscribed-plans.model';
declare const Square: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  submitted = false;
  loading = false;
  square: any;
  card: any;
  lastname = '';
  firstname = '';
  npn = '';
  email = '';
  profile_json: any;
  plan_amt: any;
  plan_name = '';
  payment_status = '';
  _id: any;
  pname = '';
  address = '';
  by1 = '';
  name1 = '';
  title1 = '';
  by2 = '';
  name2 = '';
  title2 = '';
  crDate: any;

  showPaymentIframe = false;

  subscriptions = new Subscription();

  subscriptionPlans: ISubscriptionPlan[] = [];
  selectedSubscriptionPlan: ISubscriptionPlan | null = null;

  validSubscribedPlans: ISubscribedPlan[] = [];

  constructor(
    public commonservice: CommonService,
    private api: ApiService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    private vcr: ViewContainerRef,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private readonly storageService: StorageService,
    private readonly RouteConstantsService: RouteConstantsService,
    private readonly profileService: ProfileService,
    private readonly subscriptionPlansService: SubscriptionPlansService,
    private readonly subscribedPlanRestService: SubscribedPlanRestService,
    private readonly subscribedPlanService: SubscribedPlanService,
    private readonly agreementRestService: AgreementRestService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.subscriptions.add(
      this.profileService.medicareMagicianProfile$.subscribe(
        (medicareMagicianProfile) => {
          this.profile_json = medicareMagicianProfile;
          this.firstname = medicareMagicianProfile?.firstName || '';
          this.lastname = medicareMagicianProfile?.lastName || '';
          this.npn = medicareMagicianProfile?.npn || '';
          this.email = medicareMagicianProfile?.email || '';
          // TODO: Vivek: To get payment status flag here.
          // this.payment_status = profile[0].pstatus;
          this._id = medicareMagicianProfile?.userId;
          this.pname = this.by1 = this.firstname + ' ' + this.lastname;
          this.address =
            (medicareMagicianProfile?.street || '') +
            ' ' +
            (medicareMagicianProfile?.state || '') +
            ' ' +
            (medicareMagicianProfile?.zip || '');
          this.crDate = new Date();
        }
      )
    );
    // this.profile_json = localStorage.getItem('profile');
    // let profile = JSON.parse(this.profile_json);
    // this.firstname = profile[0].first_name;
    // this.lastname = profile[0].last_name;
    // this.npn = profile[0].npn;
    // this.email = profile[0].email;
    // this.payment_status = profile[0].pstatus;
    // this._id = profile[0]._id.toString();
    // this.pname = profile[0].first_name + ' ' + profile[0].last_name;
    // this.address =
    //   profile[0].street + ' ' + profile[0].state + ' ' + profile[0].zip;
    // this.by1 = profile[0].first_name + ' ' + profile[0].last_name;
    // this.crDate = new Date();
  }

  ngOnInit(): void {
    this.initSubscriptionPlans();

    this.subscribedPlanService.loadSubscribedPlans(true);

    this.subscriptions.add(
      this.subscribedPlanService.validSubscribedPlan$.subscribe(
        (validSubscribedPlans) => {
          this.validSubscribedPlans = validSubscribedPlans || [];
        }
      )
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initSubscriptionPlans() {
    this.subscriptions.add(
      this.subscriptionPlansService.subscriptionPlans$.subscribe(
        (subscriptionPlans) => (this.subscriptionPlans = subscriptionPlans)
      )
    );
  }

  async main() {
    const APPLICATION_ID = 'sandbox-sq0idb-IBMmlwqNH4Cu1xSS4zkYBQ';
    const LOCATION_ID = 'L07YM6DY7HZYT';

    const payments = Square.payments(APPLICATION_ID, LOCATION_ID);
    this.card = await payments.card();
    await this.card.attach('#card-container');
  }

  async SquarePaymentProcess() {
    try {
      const result = await this.card.tokenize();
      if (result.status === 'OK') {
        this.ConfirmPayment(result.token);
      }
    } catch (e) {
      //this.toastr.error(e, '');
    }
  }

  async ConfirmPayment(token: any) {
    try {
      this.submitted = true;
      const body = {
        source_id: token,
        amount: this.plan_amt,
        UserUUID: localStorage.getItem('UserUUID'),
        planname: this.plan_name,
        id: this._id,
      };
      //localStorage.setItem("profile", JSON.stringify(loginInfo.data));
      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const loginInfo = await this.commonservice.SubmitPostFormData(
        this.api.paymentAPI.checkout_square,
        body,
        options
      );
      if (loginInfo.status != '1') {
        this.toastr.error(loginInfo.message, '');
      } else {
        if (loginInfo.status != '1') {
          this.toastr.error('Payment is not complete ', '');
        } else {
          this.toastr.info('Payment Successful', '');
          this.payment_status = 'Paid';
          window.open(
            'https://medicaremagiciansoftware.s3.amazonaws.com/MedicareMagician.exe',
            '_blank'
          );
        }
      }
      this.loading = false;
      this.modalService.dismissAll();
    } catch (error) {
      this.toastr.error(
        'Apologies for the inconvenience.The error is recorded.',
        ''
      );
      this.loading = false;
    }
  }

  Payment() {
    this.loading = true;
    this.SquarePaymentProcess();
  }

  async downloadlog() {
    try {
      this.loading = true;
      const body = {
        UserUUID: localStorage.getItem('UserUUID'),
      };
      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const loginInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.Downloadlog,
        body,
        options
      );
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  openPaymentPlanModal(paymentplanModal: any) {
    this.title1 = '';
    this.name1 = '';
    this.modalService.open(paymentplanModal, { centered: true });
  }

  openPaymentModal2(agreementModal: any, amt: any, planname: any) {
    this.plan_amt = amt;
    this.plan_name = planname;
    this.modalService.open(agreementModal, { scrollable: true, size: 'lg' });
  }

  openPaymentModal(
    agreementModal: any,
    selectedSubscriptionPlan: ISubscriptionPlan
  ) {
    this.selectedSubscriptionPlan = selectedSubscriptionPlan;
    this.modalService.open(agreementModal, { scrollable: true, size: 'lg' });
  }

  logout2() {
    this.authService.logout();
    this.router.navigate(['system/login']);
  }

  logout() {
    this.storageService.clearStorage();
    this.profileService.reset();
    this.router.navigate([this.RouteConstantsService.ROUTES_PATH.LOGIN_PAGE]);
  }

  openAgreementModal(agreementModal: any) {
    this.modalService.open(agreementModal, { scrollable: true, size: 'lg' });
  }

  async agree2(paymentModal: any) {
    if (this.pname == '') {
      return;
    }
    if (this.address == '') {
      return;
    }
    if (this.by1 == '') {
      return;
    }
    if (this.name1 == '') {
      return;
    }
    if (this.title1 == '') {
      return;
    }

    try {
      this.modalService.dismissAll();
      this.loading = true;
      const body = {
        pName: this.pname,
        address: this.address,
        by1: this.by1,
        name1: this.name1,
        title1: this.title1,
        by2: this.by2,
        name2: this.name2,
        title2: this.title2,
        useruuid: localStorage.getItem('UserUUID'),
      };

      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);

      const loginInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.AcceptAgreement,
        body,
        options
      );

      if (loginInfo.status != '1') {
        this.toastr.error(loginInfo.message, '');
      } else {
        this.downloadlog();
        // this.modalService.open(paymentModal, { centered: true });
        // this.main();

        this.showPaymentIframe = true;
      }
      this.loading = false;
    } catch (error) {
      this.toastr.error(
        'Apologies for the inconvenience.The error is recorded.',
        ''
      );
      this.loading = false;
    }
  }

  agree(paymentModal: any) {
    if (!this.pname) {
      this.toastr.error('Please fill the name in the agreement.', '', {
        timeOut: 10000,
      });
      return;
    }

    if (!this.address) {
      this.toastr.error('Please fill the address in the agreement.', '', {
        timeOut: 10000,
      });
      return;
    }

    if (!this.by1) {
      return;
    }

    if (!this.name1) {
      return;
    }

    if (!this.title1) {
      this.toastr.error('Please fill the Title in the agreement.', '', {
        timeOut: 10000,
      });
      return;
    }

    this.modalService.dismissAll();
    this.loading = true;

    const body = {
      pname: this.pname,
      address: this.address,
      by1: this.by1,
      name1: this.name1,
      title1: this.title1,
      by2: this.by2 || null,
      name2: this.name2 || null,
      title2: this.title2 || null,
    };

    this.loading = true;

    const agreementApi$ = this.agreementRestService.createAgreement(body).pipe(
      catchError((createAgreementErrRes) => {
        this.toastr.error(createAgreementErrRes.error.message, '', {
          timeOut: 10000,
        });
        return throwError(createAgreementErrRes);
      })
    );

    const createSubscribedPlanApi$ = this.subscribedPlanRestService
      .createSubscribedPlan(this.selectedSubscriptionPlan!.id)
      .pipe(
        tap((d) =>
          this.subscribedPlanService.setSubscribedPlanForProcessingPayment(d)
        )
      );

    /* const waitForSubcribedPlanLoaded$ = this.subscribedPlanService.loaded$.pipe(
      filter((item) => item),
      take(1)
    ); */

    concat(
      agreementApi$,
      createSubscribedPlanApi$ /* , waitForSubcribedPlanLoaded$ */
    )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => {},
        () => {},
        () => (this.showPaymentIframe = true)
      );
  }

  getSubscriptionPlanName() {
    const subscriptionPlan = this.subscriptionPlans.find(
      (s) => s.id === this.validSubscribedPlans[0].subscriptionPlanId
    );
    return subscriptionPlan ? subscriptionPlan.name : '';
  }
}
