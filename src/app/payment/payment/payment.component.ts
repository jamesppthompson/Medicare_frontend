import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, of, Subscription } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { IPayment } from '../../models/payment.model';
import { ProfileService } from '../../+state/profile/profile.service';
import { SubscribedPlanService } from '../../+state/subscribed-plan/subscribed-plan.service';
import { PaymentRestService } from '../../services/payment-rest/payment-rest.service';
import { ISubscribedPlan } from 'src/app/models/subscribed-plans.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  @Input() openAsModal = true;

  _showPaymentIframe = false;

  @Input()
  get showPaymentIframe() {
    return this._showPaymentIframe;
  }

  set showPaymentIframe(show: boolean) {
    this.paymentStatus = false;
    this._showPaymentIframe = show;
    if (this._showPaymentIframe === true) {
      this.openPaymentIframeModal();
    } else {
      this.closePaymentIframeModal();
    }
  }

  @Output() closed = new EventEmitter<any>();

  @ViewChild('paymentTemplate')
  paymentTemplate: ElementRef;

  paymentIframeUrl: SafeResourceUrl = '';

  modal?: NgbModalRef = undefined;

  private subscriptions = new Subscription();

  private ongoingPayment: IPayment | null = null;
  private ongoingSubscribedPlan: ISubscribedPlan | null = null;
  private paymentStatus = false;

  constructor(
    private readonly modalService: NgbModal,
    private readonly domSanitizer: DomSanitizer,
    private readonly profileService: ProfileService,
    private readonly subscribedPlansService: SubscribedPlanService,
    private readonly paymentRestService: PaymentRestService
  ) {}

  ngOnInit(): void {
    this.addChargeAnywareListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.removeChargeAnywhereListener();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openPaymentIframeModal() {
    this.subscriptions.add(
      combineLatest([
        this.profileService.medicareMagicianProfile$,
        this.subscribedPlansService.subscribedPlanForProcessingPayment$,
      ])
        .pipe(
          take(1),
          filter(
            ([userProfile, subscribedPlanForProcessingPayment]) =>
              !!subscribedPlanForProcessingPayment
          ),
          switchMap(([userProfile, subscribedPlanForProcessingPayment]) =>
            this.paymentRestService
              .initiatePayment(subscribedPlanForProcessingPayment!.id)
              .pipe(
                tap((payment) => {
                  this.ongoingPayment = payment;
                  this.ongoingSubscribedPlan =
                    subscribedPlanForProcessingPayment;
                }),
                map((payment) => ({
                  userProfile,
                  subscribedPlanForProcessingPayment,
                  payment,
                }))
              )
          )
        )
        .subscribe(
          ({ userProfile, subscribedPlanForProcessingPayment, payment }) => {
            if (
              !subscribedPlanForProcessingPayment ||
              !payment ||
              !userProfile ||
              !userProfile.npn ||
              !userProfile.firstName ||
              !userProfile.lastName ||
              !userProfile.email
            ) {
              return this.closePaymentIframeModal();
            }

            // const npn = userProfile.npn;
            const customerNumber = userProfile.userId;
            const purchaseCode = subscribedPlanForProcessingPayment.id;
            this.paymentIframeUrl =
              this.domSanitizer.bypassSecurityTrustResourceUrl(
                `https://www.chargeanywhere.com/APIs/PayOnline.aspx?Version=2.0&MerchantId=153615&TerminalId=0003&Mode=0&Amount=1.00&CustomerNumber=${customerNumber}&PurchaseCode=${purchaseCode}`
              );

            if (this.openAsModal) {
              this.modal = this.modalService.open(this.paymentTemplate, {
                keyboard: false,
                scrollable: false,
                size: 'lg',
              });

              this.modal?.result.then(
                (result) => {
                  console.log(`Closed with: ${result}`);
                },
                (reason) => {
                  console.log(`Dismissed ${this.getDismissReason(reason)}`);
                }
              );
            }
          }
        )
    );
  }

  closePaymentIframeModal() {
    if (this.openAsModal) {
      this.modal?.dismiss('Cross click');
    }
    this.closed.next(this.paymentStatus);
  }

  handleChareAnywhereMessage(event: any) {

    if (event.origin !== 'https://www.chargeanywhere.com') {
      return;
    }
    console.log("handle charge anywhere message----");
    this.paymentStatus = true;
    const customData = event.data;
    this.paymentRestService
      .confirmPayment({
        ...event.data,
        paymentId: this.ongoingPayment?.id,
        subscribedPlanId: this.ongoingSubscribedPlan?.id,
      })
      .subscribe(() => {
        this.subscribedPlansService.loadSubscribedPlans(true);
      });
  }

  addChargeAnywareListener() {
    window.addEventListener(
      'message',
      (event) => this.handleChareAnywhereMessage(event),
      false
    );
  }

  removeChargeAnywhereListener() {
    window.removeEventListener(
      'message',
      (event) => this.handleChareAnywhereMessage(event),
      false
    );
  }

  getUserProfile() {
    let userProfile = null;
    const userProfileString = window.localStorage.getItem('profile');
    if (userProfileString) {
      try {
        userProfile = JSON.parse(userProfileString);
      } catch (e) {}
    }

    return userProfile;
  }
}
