import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { EmailRestService } from 'src/app/services/email-rest/email-rest.service';
import { Call, Device } from '@twilio/voice-sdk'

@Component({
  selector: 'app-contact',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.css'],
})
export class CallComponent implements OnInit {
  Regform: FormGroup;
  submitted = false;
  loading = false;
  padNum = <any>[];
  phoneNumber: String;
  device: any;


  constructor(
    public commonservice: CommonService,
    private api: ApiService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    private readonly emailRestService: EmailRestService,
  ) {
    this.Regform = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      npn: ['', [Validators.required, Validators.minLength(7)]],
      phone: ['', Validators.required],
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
    this.padNum = [
      [
        { number: '1', alpha: "" },
        { number: '2', alpha: "a b c" },
        { number: '3', alpha: "d e f" },
      ],
      [
        { number: '4', alpha: "g h i" },
        { number: '5', alpha: "j k l" },
        { number: '6', alpha: "m n o" },
      ],
      [
        { number: '7', alpha: "p q r s" },
        { number: '8', alpha: "t u v" },
        { number: '9', alpha: "w x y z" },
      ],
      [
        { number: '*', alpha: "" },
        { number: '0', alpha: "" },
        { number: '#', alpha: "" },
      ]
    ];
    this.phoneNumber = '+1';
    // let profile = JSON.parse(localStorage.getItem('profile') as string);
    // this.device = new Device(profile.access_token, {
    //   logLevel: 1,
    //   // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
    //   // providing better audio quality in restrained network conditions.
    //   codecPreferences: ["opus" as Call.Codec, "pcmu" as Call.Codec],
    // })
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      npn: [''],
      phone: ['', Validators.required],
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

  handleChange(event: any) {
    this.phoneNumber = event.target.value;
  }

  dialPadClick(number: string) {
    this.phoneNumber = this.phoneNumber + number;
  }

  dial() {
    console.log("dial clicked", this.phoneNumber);
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
        this.toastr.error(resInfo.message, '', { timeOut: 3000 });
        this.loading = false;
        return;
      }
      this.submitted = false;
      this.ValidateForm();

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

  async SubmitFunction_new() {
    this.submitted = true;
    if (this.Regform.invalid) {
      return;
    }

    const {
      firstName: firstName,
      lastName: lastName,
      email,
      phone: phoneNo,
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
            timeOut: 3000,
          });
        },
        (err) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            '',
            { timeOut: 3000 }
          );
        }
      );
  }
}
