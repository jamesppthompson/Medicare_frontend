import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.css'],
})
export class LandingHeaderComponent implements OnInit {
  Is_Login = false;
  constructor(
    public commonservice: CommonService,
    private api: ApiService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    public authService: AuthService
  ) {
    this.commonservice.is_loggedin.subscribe((res) => {
      this.Is_Login = res;
    });
  }

  ngOnInit(): void {
    jQuery(function ($) {
      $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
      });
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['main/index']);
  }
  chatclick() {
    this.commonservice.ChatClick(true);
  }
}
