import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { concat, Subscription, throwError } from 'rxjs';
import { catchError, filter, finalize, take, tap } from 'rxjs/operators';
import { ProfileService } from 'src/app/+state/profile/profile.service';
import { SubscribedPlanService } from 'src/app/+state/subscribed-plan/subscribed-plan.service';
import { SubscriptionPlansService } from 'src/app/+state/subscription-plans/subscription-plans.service';
import { ISubscribedPlan } from 'src/app/models/subscribed-plans.model';
import { ISubscriptionPlan } from 'src/app/models/subscription-plans.model';
import { AgreementRestService } from 'src/app/services/agreement-rest/agreement-rest.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthRestService } from 'src/app/services/auth-rest/auth-rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants/constants.service';
import { ProfileRestService } from 'src/app/services/profile-rest/profile-rest.service';
import { RouteConstantsService } from 'src/app/services/route-constants/route-constants.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { SubscribedPlanRestService } from 'src/app/services/subscribed-plan-rest/subscribed-plan-rest.service';
import { Jwt } from 'src/app/utils/jwt.utils';
declare const Square: any;

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
})
export class PricingComponent implements OnInit, OnDestroy {
  stepname = 'price';
  submitted = false;
  loading = false;
  Regform: FormGroup;
  pname = '';
  address = '';
  by1 = '';
  name1 = '';
  title1 = '';
  by2 = '';
  name2 = '';
  title2 = '';

  profile_json: any;
  plan_amt = 0;
  plan_name = 'Free';
  payment_status = '';
  _id: any;
  square: any;
  card: any;
  crDate: any;

  selectedSubscription = -1;
  subscriptions = new Subscription();
  subscriptionPlans: ISubscriptionPlan[] = [];
  selectedSubscriptionPlan: ISubscriptionPlan | null = null;
  validSubscribedPlans: ISubscribedPlan[] = [];
  showPaymentIframe = false;

  constructor(
    public commonservice: CommonService,
    private api: ApiService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    public readonly constantsService: ConstantsService,
    private readonly authRestService: AuthRestService,
    private readonly routeConstantService: RouteConstantsService,
    private readonly storageService: StorageService,
    private readonly profileService: ProfileService,
    private readonly subscriptionPlansService: SubscriptionPlansService,
    private readonly subscribedPlanRestService: SubscribedPlanRestService,
    private readonly subscribedPlanService: SubscribedPlanService,
    private readonly agreementRestService: AgreementRestService
  ) {
    this.Regform = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      npn: ['', [Validators.required, Validators.minLength(7)]],
      phone_no: ['', Validators.required],
      office_no: [''],
      fax_no: [''],
      email: ['', [Validators.required, Validators.email]],
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
      website: [''],
      agent: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.crDate = new Date();
  }

  ngOnInit() {
    this.ValidateForm();
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

  setStepName(e: any) {
    this.stepname = e;
  }

  ValidateForm() {
    this.Regform = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      npn: ['', [Validators.required, Validators.minLength(7)]],
      phone_no: ['', Validators.required],
      office_no: [''],
      fax_no: [''],
      email: ['', [Validators.required, Validators.email]],
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
      website: [''],
      agent: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    let frm = this.Regform.value;
    if (frm['npn'].length > 6) {
      return false;
    }
    return true;
  }

  get frmCtrl() {
    return this.Regform.controls;
  }

  async SubmitFunction() {
    try {
      this.submitted = true;
      if (this.Regform.invalid) {
        return;
      }

      const body = this.Regform.value;
      if (body['password'] != body['cpassword']) {
        this.toastr.error('Password is not match', '');
        return;
      }

      this.loading = true;
      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const resInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.Regsiter,
        body,
        options
      );
      if (resInfo.status != '1') {
        this.toastr.error(resInfo.message, '');
        this.loading = false;
        return;
      }
      await this.loginsumbit(body['email'], body['password']);
      await this.SendMail(body['email']);
      this.submitted = false;
      this.ValidateForm();

      this.loading = false;
    } catch (error) {
      this.toastr.error(
        'Apologies for the inconvenience.The error is recorded.',
        ''
      );
      this.loading = false;
    }
  }

  SubmitFunction_new() {
    this.submitted = true;
    if (this.Regform.invalid) {
      return;
    }

    const body = this.Regform.value;
    if (body['password'] !== body['cpassword']) {
      this.toastr.error('Password is not match', '');
      return;
    }

    this.loading = true;

    this.authRestService
      .signup({
        username: body.email,
        password: body.password,
        firstName: body.first_name,
        lastName: body.last_name,
        phoneNo: body.phone_no,
        officeNo: body.office_no || null,
        faxNo: body.fax_no || null,
        npn: body.npn,
        street: body.street,
        city: body.city || null,
        state: body.state,
        zip: body.zip || null,
        website: body.website || null,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (signupSucRes) => {
          this.toastr.success(
            'You have signed up successfully, Login to Proceed',
            '',
            { timeOut: 10000 }
          );
          this.login();
        },
        (signupErrRes) => {
          this.toastr.error(signupErrRes.error.message, '', { timeOut: 10000 });
          return throwError(signupErrRes);
        }
      );
  }

  public login() {
    this.submitted = true;
    this.loading = true;

    this.authRestService
      .sigin({
        username: this.Regform.value.email,
        password: this.Regform.value.password,
      })
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (siginSucRes: any) => {
          const decodedJwt = Jwt.parseJwt(siginSucRes.accessToken);
          console.log({ siginSucRes, decodedJwt });
          this.storageService.saveAccessToken(siginSucRes.accessToken);
          this.storageService.saveUserId(decodedJwt.id);
          this.profileService.loadProfile(true);
          this.profileService.loaded$
            .pipe(filter((profileLoaded) => profileLoaded))
            .subscribe(() => this.setStepName('aggreement'));
        },
        (signErrRes) => {
          this.toastr.error(signErrRes.error.message, '');
        }
      );
  }

  agree_new() {
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
      .createSubscribedPlan(parseInt('' + this.selectedSubscription))
      .pipe(
        tap((d) =>
          this.subscribedPlanService.setSubscribedPlanForProcessingPayment(d)
        )
      );

    /*const waitForSubcribedPlanLoaded$ = this.subscribedPlanService.loaded$.pipe(
      filter((item) => item),
      take(1)
    );*/

    concat(
      agreementApi$,
      createSubscribedPlanApi$ /*, waitForSubcribedPlanLoaded$*/
    )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => { },
        () => { },
        () => {
          this.showPaymentIframe = true;
          this.setStepName('payment');
        }
      );
  }

  async SendMail(email = '') {
    try {
      var body = JSON.stringify({ yEmail: email });
      this.loading = true;
      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const resInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.sendmail,
        body,
        options
      );
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  async loginsumbit(email: any, password: any) {
    try {
      this.submitted = true;
      this.loading = true;
      const body = JSON.stringify({
        email: email,
        password: password,
      });

      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const loginInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.Login,
        body,
        options
      );
      if (loginInfo.status != '1') {
        this.toastr.error(loginInfo.message, '');
      } else {
        let tkn = loginInfo.access_token;
        //this.authService.storeTokens(tkn);
        let h = JSON.parse(loginInfo.data);
        console.log(h);
        localStorage.setItem('profile', JSON.stringify(h));
        localStorage.setItem('UserID', h[0]._id);
        this.profile_json = localStorage.getItem('profile');
        let profile = JSON.parse(this.profile_json);
        this.payment_status = profile[0].pstatus;
        this.pname = profile[0].first_name + ' ' + profile[0].last_name;
        this.address =
          profile[0].street + ' ' + profile[0].state + ' ' + profile[0].zip;
        this._id = profile[0]._id.toString();
        this.by1 = profile[0].first_name + ' ' + profile[0].last_name;
        this.name1 = '';
        this.title1 = '';
        this.setStepName('aggreement');
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

  async agree() {
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
        userid: localStorage.getItem('UserID'),
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
        if (this.plan_amt != 0) {
          this.setStepName('payment');
          this.main();
        } else {
          this.setStepName('thanks');
          this.downloadlog();
        }
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

  async downloadlog() {
    try {
      this.loading = true;
      const body = {
        UserID: localStorage.getItem('UserID'),
      };
      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const loginInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.Downloadlog,
        body,
        options
      );
      this.loading = false;
      // window.open(
      //   'https://medicaremagiciansoftware.s3.amazonaws.com/MedicareMagician.exe',
      //   '_blank'
      // );
    } catch (error) {
      this.loading = false;
    }
  }

  async main() {
    console.log("payment mail func:");
    const APPLICATION_ID = 'sandbox-sq0idb-IBMmlwqNH4Cu1xSS4zkYBQ';
    const LOCATION_ID = 'L07YM6DY7HZYT';

    const payments = Square.payments(APPLICATION_ID, LOCATION_ID);
    console.log("payments info:", payments);
    this.card = await payments.card();
    console.log("card:", this.card);
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
        UserID: localStorage.getItem('UserID'),
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
          this.setStepName('thanks');
          this.downloadlog();
        }
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

  Payment() {
    console.log("click pay button");
    this.loading = true;
    this.SquarePaymentProcess();
  }

  chooseplan(amt: any, pname: any, selectedSubscriptionPlan: number) {
    this.plan_amt = amt;
    this.plan_name = pname;
    this.selectedSubscription = selectedSubscriptionPlan;
  }

  paymentModalClosed(status: boolean) {
    if (status === true) {
      this.router.navigate([this.routeConstantService.ROUTES_PATH.HOME_PAGE]);
    }
  }
}
