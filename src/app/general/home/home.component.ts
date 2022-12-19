import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { concat, Subscription, throwError } from 'rxjs';
import { ProfileService } from '../../+state/profile/profile.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { RouteConstantsService } from '../../services/route-constants/route-constants.service';
import { StorageService } from '../../services/storage/storage.service';
import { AgreementRestService } from '../../services/agreement-rest/agreement-rest.service';
import { catchError, filter, finalize, map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
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

  lastName = '';
  firstName = '';
  npn = '';
  email = '';
  phone = '';
  street = '';
  state = '';
  zip = '';
  website = '';
  company = '';
  registrationDate = '';
  profile_json: any;
  userExpirationDate = "2022-01-01";

  amount: any;
  planName = '';
  payment_status = '';
  _id: any;

  enrollmentTableInfo = "";

  pName = '';
  address = '';
  by1 = '';
  name1 = '';
  title1 = '';
  crDate: any;

  cardNumber = '5379931012287767';
  expirationDate = '0326';
  cvv = '034';

  showPaymentIframe = false;
  playerData: any[];

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
  ) {

    this.setUserInfo(localStorage.getItem('UserID'));

    this.profile_json = localStorage.getItem('profile');
    let profile = JSON.parse(this.profile_json);
    console.log(profile);
    this.firstName = profile[0].firstName;
    this.lastName = profile[0].lastName;
    this.npn = profile[0].npn;
    this.phone = profile[0].phone;
    this.state = profile[0].state;
    this.street = profile[0].street;
    this.email = profile[0].email;
    this.website = profile[0].website;
    this.zip = profile[0].zip;
    this.company = profile[0].company;
    this.registrationDate = profile[0].registrationDate;

    // this.payment_status = profile[0].pstatus;
    this._id = profile[0]._id.toString();
    this.pName = profile[0].firstName + ' ' + profile[0].lastName;
    this.address =
      profile[0].street + ' ' + profile[0].state + ' ' + profile[0].zip;
    this.by1 = profile[0].firstName + ' ' + profile[0].lastName;
    this.crDate = new Date();
    this.playerData = [0, 1, 2]
    this.setPayListInfo(profile[0].enrollment)

    // agreement and pay info
  }

  ngOnInit(): void {
    $("#enrollmentTableInfo").html(this.enrollmentTableInfo);

  }
  ngOnDestroy(): void {
  }

  setPayListInfo(enrollmentInfo: any) {
    console.log(enrollmentInfo);
    this.enrollmentTableInfo = '';
    enrollmentInfo?.forEach((
      element: {
        enrollmentDate: string | number | Date;
        planName: string;
        name1: string;
        amount: string;
        paidStatus: string;
      }) => {
      let d = new Date(element.enrollmentDate);
      if (element.planName === "Freely") d.setDate(d.getDate() + 15);
      else if (element.planName === "Monthly") d.setMonth(d.getMonth() + 1);
      else if (element.planName === "Yearly") d.setMonth(d.getMonth() + 12);
      let enrollmentExpirationDate = d.toISOString().slice(0, 10)

      this.enrollmentTableInfo += "<tr><td>" + element.name1 + "</td><td>" + element.enrollmentDate + "</td><td>" + element.planName + "</td><td>$" + element.amount + "</td><td>" + enrollmentExpirationDate + "</td><td>" + element.paidStatus + "</td></tr>"

      const e = new Date(enrollmentExpirationDate);
      const f = new Date(this.userExpirationDate);
      if (f < e)
        this.userExpirationDate = enrollmentExpirationDate;
    });
  }

  async setUserInfo(userId: any) {
    try {
      const body = JSON.stringify({
        userId
      });

      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const loginInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.UserInfo,
        body,
        options
      );
      if (loginInfo.status != '1') {
        this.toastr.error(loginInfo.message, '', { timeOut: 3000 });
      } else {
        let tkn = loginInfo.access_token;
        this.authService.storeTokens(tkn);
        let h = JSON.parse(loginInfo.data);
        localStorage.setItem('profile', JSON.stringify(h));
        localStorage.setItem('UserID', h[0]._id);
      }
      this.loading = false;
    } catch (error) {
      this.toastr.error(
        'Apologies for the inconvenience.The error is recorded.',
        '',
        { timeOut: 3000 }
      );
      this.loading = false;
    }
  }

  openPaymentPlanModal(paymentPlanModal: any) {
    this.modalService.open(paymentPlanModal, { centered: true });
  }

  openAgreementModal(
    agreementModal: any,
    amount: any,
    planName: any
  ) {
    this.amount = amount;
    this.planName = planName;
    this.modalService.open(agreementModal, { scrollable: true, size: 'lg' });
  }

  openPaymentModel(paymentModel: any) {
    if (this.pName == '') {
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
    this.modalService.open(paymentModel, { scrollable: true, size: 'lg' });
  }



  async Pay() {
    if (!this.checkCanPay()) {
      return false;
      throw "error";
    }

    this.loading = true;
    try {
      const body = {
        pName: this.pName,
        address: this.address,
        by1: this.by1,
        name1: this.name1,
        title1: this.title1,

        amount: 1.00,
        userId: localStorage.getItem('UserID'),
        cardNumber: this.cardNumber,
        expirationDate: this.expirationDate,
        cvv: this.cvv,
        planName: this.planName,
      };

      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const payInfo = await this.commonservice.SubmitPostFormData(
        this.api.paymentAPI.Pay,
        body,
        options
      );

      this.loading = false;
      //this.modalService.dismissAll();
      if (payInfo.status != '1') {
        this.toastr.error(payInfo.message, '', { timeOut: 3000 });

      } else {
        this.toastr.info('Payment Successful', '', { timeOut: 3000 });
        this.payment_status = 'Paid';
        this.setPayListInfo(payInfo?.data?.enrollment);
        $("#enrollmentTableInfo").html(this.enrollmentTableInfo);
        this.submitted = true;
        this.modalService.dismissAll();
      }
      return false;
    } catch (error) {
      this.toastr.error(
        'Apologies for the inconvenience.The error is recorded.',
        '',
        { timeOut: 3000 }
      );
      this.loading = false;
      return false;
    }
  }

  logout() {
    this.storageService.clearStorage();
    this.profileService.reset();
    this.router.navigate([this.RouteConstantsService.ROUTES_PATH.LOGIN_PAGE]);
  }



  checkCanPay() {
    if (this.pName == '' || this.address == '' || this.by1 == '' || this.name1 == '' || this.title1 == '') {
      return false;
    }
    if (this.cardNumber == '' || this.cvv == '' || this.expirationDate == '')
      return false;

    return true;
  }

  // agree_new(paymentModal: any) {
  //   if (!this.pname) {
  //     this.toastr.error('Please fill the name in the agreement.', '', {
  //       timeOut: 10000,
  //     });
  //     return;
  //   }

  //   if (!this.address) {
  //     this.toastr.error('Please fill the address in the agreement.', '', {
  //       timeOut: 10000,
  //     });
  //     return;
  //   }

  //   if (!this.by1) {
  //     return;
  //   }

  //   if (!this.name1) {
  //     return;
  //   }

  //   if (!this.title1) {
  //     this.toastr.error('Please fill the Title in the agreement.', '', {
  //       timeOut: 10000,
  //     });
  //     return;
  //   }

  //   this.modalService.dismissAll();
  //   this.loading = true;

  //   const body = {
  //     pname: this.pname,
  //     address: this.address,
  //     by1: this.by1,
  //     name1: this.name1,
  //     title1: this.title1,
  //   };

  //   this.loading = true;

  //   const agreementApi$ = this.agreementRestService.createAgreement(body).pipe(
  //     catchError((createAgreementErrRes) => {
  //       this.toastr.error(createAgreementErrRes.error.message, '', {
  //         timeOut: 10000,
  //       });
  //       return throwError(createAgreementErrRes);
  //     })
  //   );

  //   const createSubscribedPlanApi$ = this.subscribedPlanRestService
  //     .createSubscribedPlan(this.selectedSubscriptionPlan!.id)
  //     .pipe(
  //       tap((d) =>
  //         this.subscribedPlanService.setSubscribedPlanForProcessingPayment(d)
  //       )
  //     );

  //   /* const waitForSubcribedPlanLoaded$ = this.subscribedPlanService.loaded$.pipe(
  //     filter((item) => item),
  //     take(1)
  //   ); */

  //   concat(
  //     agreementApi$,
  //     createSubscribedPlanApi$ /* , waitForSubcribedPlanLoaded$ */
  //   )
  //     .pipe(finalize(() => (this.loading = false)))
  //     .subscribe(
  //       () => {},
  //       () => {},
  //       () => (this.showPaymentIframe = true)
  //     );
  // }

}
