import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ProfileRestService } from 'src/app/services/profile-rest/profile-rest.service';
import { RouteConstantsService } from 'src/app/services/route-constants/route-constants.service';
import { Jwt } from 'src/app/utils/jwt.utils';
import { AuthRestService } from '../../services/auth-rest/auth-rest.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  submitted = false;
  loading = false;
  Regform: FormGroup;

  constructor(
    public commonservice: CommonService,
    private api: ApiService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    private readonly authRestService: AuthRestService,
    private readonly profileRestService: ProfileRestService,
    private readonly routeConstantService: RouteConstantsService
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

  ngOnInit() {
    this.ValidateForm();
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
      this.toastr.info('Thanks for registration', '');
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

  SubmitFunction_new2() {
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
      .signup({ username: body.email, password: body.password })
      .pipe(
        catchError((signupErrRes) => {
          this.toastr.error(signupErrRes.error.message, '', { timeOut: 10000 });
          return throwError(signupErrRes);
        }),
        switchMap((signupSucRes: any) => {
          const decodedJwt = Jwt.parseJwt(signupSucRes.accessToken);
          console.log({ signupSucRes, decodedJwt });
          return this.profileRestService.createProfile(
            {
              email: body.username,
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
            },
            signupSucRes.accessToken
          );
        }),
        //TODO: Vivek: To implement send email logic here
        finalize(() => (this.loading = false))
      )
      .subscribe(() => {
        this.router.navigate([
          this.routeConstantService.ROUTES_PATH.LOGIN_PAGE,
        ]);
      });
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
          this.router.navigate([
            this.routeConstantService.ROUTES_PATH.LOGIN_PAGE,
          ]);
        },
        (signupErrRes) => {
          this.toastr.error(signupErrRes.error.message, '', { timeOut: 10000 });
          return throwError(signupErrRes);
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
      this.router.navigate(['system/login']);
    } catch (error) {
      this.router.navigate(['system/login']);
      this.loading = false;
    }
  }
}
