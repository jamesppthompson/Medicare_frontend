import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/+state/profile/profile.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Jwt } from 'src/app/utils/jwt.utils';

@Component({
  selector: 'app-menutop',
  templateUrl: './menutop.component.html',
  styleUrls: ['./menutop.component.css'],
})
export class MenutopComponent implements OnInit {
  Is_Login = false;

  constructor(
    public sideNavService: SidenavService,
    public commonservice: CommonService,
    private api: ApiService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    private readonly storageService: StorageService,
    private readonly profileService: ProfileService
  ) {
    /* this.commonservice.is_loggedin.subscribe((res) => {
      this.Is_Login = res;
    }); */
  }

  ngOnInit(): void {
    // $(document).ready(function () {
    //   $('#dismiss, .overlay').on('click', function () {
    //     $('#sidebar').removeClass('active');
    //     $('.overlay').removeClass('active');
    //   });
    //   $('#sidebarCollapse').on('click', function () {
    //     $('#sidebar').addClass('active');
    //     $('.overlay').addClass('active');
    //     $('.collapse.in').toggleClass('in');
    //     $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    //   });
    // });
  }

  logout() {
    this.authService.logout();
    this.storageService.clearStorage();
    this.router.navigate(['main/home']);
  }

  opensigup() {
    if (this.router.url === '/system/pricing') {
      window.location.reload();
    } else {
      this.router.navigate(['system/pricing']);
    }
  }
}
