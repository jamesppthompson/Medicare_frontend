import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthRestService } from 'src/app/services/auth-rest/auth-rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { RouteConstantsService } from 'src/app/services/route-constants/route-constants.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Jwt } from 'src/app/utils/jwt.utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  frmLogin: FormGroup;
  submitted = false;
  loading = false;
  fEmail = '';
  IsKeySend = false;
  pKey = '';
  newpassword = '';
  cfnewpassword = '';
  _id: any;
  hide = true;
  paymentForm: any;

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
    private readonly authRestService: AuthRestService,
    private readonly routeConstantsService: RouteConstantsService,
    private readonly storageService: StorageService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.frmLogin = fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{1,63}$'
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    localStorage.clear();
    this.authService.logout();
  }

  get frmCtrl() {
    return this.frmLogin.controls;
  }

  async loginsumbit() {
    try {
      this.submitted = true;
      if (this.frmLogin.invalid) {
        return;
      }
      this.loading = true;
      const formVal = this.frmLogin.value;
      const body = JSON.stringify({
        email: formVal['email'],
        password: formVal['password'],
      });

      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const loginInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.Login,
        body,
        options
      );
      if (loginInfo.status != '1') {
        this.toastr.error(loginInfo.message, '', {timeOut: 3000});
      } else {
        let tkn = loginInfo.access_token;
        this.authService.storeTokens(tkn);
        let h = JSON.parse(loginInfo.data);
        localStorage.setItem('profile', JSON.stringify(h));
        localStorage.setItem('UserID', h[0]._id);
        this.router.navigate(['general/home']);
        //this.router.navigate(['main/agreement']);
      }
      this.loading = false;
    } catch (error) {
      this.toastr.error(
        'Apologies for the inconvenience.The error is recorded.',
        '',
        {timeOut: 3000}
      );
      this.loading = false;
    }
  }

  public loginsumbit_new() {
    this.submitted = true;
    if (this.frmLogin.invalid) {
      return;
    }
    this.loading = true;

    this.authRestService
      .sigin({
        username: this.frmLogin.value.email,
        password: this.frmLogin.value.password,
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
          this.router.navigate([
            this.routeConstantsService.ROUTES_PATH.HOME_PAGE,
          ]);
        },
        (signErrRes) => {
          this.toastr.error(signErrRes.error.message, '', {timeOut: 3000});
        }
      );
  }

  OpenForgotModal(fModal: any) {
    this.IsKeySend = false;
    this.fEmail = '';
    this.newpassword = '';
    this.pKey = '';
    this.cfnewpassword = '';
    this.modalService.open(fModal, { centered: true });
  }

  async SubmitForgot() {
    if (this.fEmail == '') {
      this.toastr.error('Email cannot be blank', '', {timeOut: 3000});
      return;
    }
    if (this.IsKeySend == true) {
      if (this.pKey == '') {
        this.toastr.error('Password key cannot be blank', '', {timeOut: 3000});
        return;
      }
      if (this.cfnewpassword != this.newpassword) {
        this.toastr.error('New password and confirm passowrd is not match', '', {timeOut: 3000});
        return;
      }
    }
    this.loading = true;
    if (this.IsKeySend == false) {
      const body = JSON.stringify({
        email: this.fEmail,
        password: '',
      });
      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const loginInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.ForgotPassword,
        body,
        options
      );
      if (loginInfo.status != '1') {
        this.toastr.error(loginInfo.message, '', {timeOut: 3000});
      } else {
        let h = JSON.parse(loginInfo.data);
        this._id = h[0]._id;
        this.toastr.success('Password key is sent on your registered mail', '', {timeOut: 3000});
        this.IsKeySend = true;
      }
      this.loading = false;
      return;
    }
    if (this.IsKeySend == true) {
      const body = JSON.stringify({
        _id: this._id.toString(),
        password: this.newpassword,
        pKey: this.pKey,
      });
      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const loginInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.UpdatePassword,
        body,
        options
      );
      if (loginInfo.status != '1') {
        this.toastr.error(loginInfo.message, '', {timeOut: 3000});
      } else {
        this.toastr.success('Update', '', {timeOut: 3000});
        this.IsKeySend = false;
        this.modalService.dismissAll();
      }
      this.loading = false;
      return;
    }
  }
}
