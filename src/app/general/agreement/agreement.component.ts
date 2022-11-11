import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css'],
})
export class AgreementComponent implements OnInit {
  pname = '';
  address = '';
  by1 = '';
  name1 = '';
  title1 = '';
  by2 = '';
  name2 = '';
  title2 = '';

  loading = false;
  constructor(
    public commonservice: CommonService,
    private api: ApiService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}
  async agree() {
    if (this.pname == '') {
      return;
    }
    if (this.address == '') {
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
      this.modalService.dismissAll();
      // window.open(
      //   'https://medicaremagiciansoftware.s3.amazonaws.com/MedicareMagician.exe',
      //   '_blank'
      // );
    } catch (error) {
      this.loading = false;
    }
  }
}
