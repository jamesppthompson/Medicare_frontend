import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-mobilenav',
  templateUrl: './mobilenav.component.html',
  styleUrls: ['./mobilenav.component.css'],
})
export class MobilenavComponent implements OnInit {
  Is_Login = false;
  constructor(
    public sideNavService: SidenavService,
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

  ngOnInit(): void {}
  logout() {
    this.authService.logout();
    this.router.navigate(['main/home']);
  }
}
