import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { EmailRestService } from 'src/app/services/email-rest/email-rest.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  Regform: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    public commonservice: CommonService,
    private api: ApiService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    private readonly emailRestService: EmailRestService
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
      message: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.ValidateForm();
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

  ValidateForm() {
    this.Regform = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      npn: [''],
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
      message: ['', [Validators.required]],
    });
  }

  get frmCtrl() {
    return this.Regform.controls;
  }

  chatclick() {
    this.commonservice.ChatClick(true);
  }

  async SubmitFunction() {
    try {
      this.submitted = true;
      if (this.Regform.invalid) {
        return;
      }

      const body = this.Regform.value;
      this.loading = true;
      const headers: object[] = [];
      const options = this.commonservice.generateRequestHeaders(headers);
      const resInfo = await this.commonservice.SubmitPostFormData(
        this.api.systemAPI.ContactMail,
        body,
        options
      );
      if (resInfo.status != '1') {
        this.toastr.error(resInfo.message, '');
        this.loading = false;
        return;
      }
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

  async SubmitFunction_new() {
    this.submitted = true;
    if (this.Regform.invalid) {
      return;
    }

    const {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_no: phoneNo,
      message,
    } = this.Regform.value;
    this.loading = true;

    this.emailRestService
      .sendContactUsEmail({ firstName, lastName, email, phoneNo, message })
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.ValidateForm();

          this.loading = false;
        })
      )
      .subscribe(
        () => {
          this.toastr.success('Thanks for contacting us.', '', {
            timeOut: 1000,
          });
        },
        (err) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            '',
            { timeOut: 5000 }
          );
        }
      );
  }
}
