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
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css'],
})
export class AdminloginComponent implements OnInit {
  frmLogin: FormGroup;
  submitted = false;
  loading = false;
  hide = true;

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
    private readonly storageService: StorageService,
    private readonly routeConstantsService: RouteConstantsService
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

  ngOnInit(): void {}

  get frmCtrl() {
    return this.frmLogin.controls;
  }

  async loginsumbit2() {
    try {
      this.submitted = true;
      if (this.frmLogin.invalid) {
        return;
      }
      this.loading = true;
      const formVal = this.frmLogin.value;
      if (
        formVal['email'] == 'tomtoggas@gmail.com' &&
        formVal['password'] == 'Olivia01!'
      ) {
        this.router.navigate(['admin/dashboard']);
      } else {
        this.toastr.error('Login details are wrong', '');
      }
    } catch (error) {
      this.toastr.error(
        'Apologies for the inconvenience.The error is recorded.',
        ''
      );
      this.loading = false;
    }
  }

  loginsumbit() {
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
        (adminSigninSucRes: any) => {
          const decodedJwt = Jwt.parseJwt(adminSigninSucRes.accessToken);
          console.log({ siginSucRes: adminSigninSucRes, decodedJwt });
          this.storageService.saveAccessToken(adminSigninSucRes.accessToken);
          this.storageService.saveUserId(decodedJwt.id);
          this.router.navigate([
            this.routeConstantsService.ROUTES_PATH.HOME_PAGE,
          ]);
          this.router.navigate(['admin/dashboard']);
        },
        (adminSigninErrRes) => {
          this.toastr.error(
            adminSigninErrRes?.error?.message || 'Login Failed!'
          );
        }
      );
  }
}
