import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { SidenavService } from './services/sidenav.service';
import { StorageService } from './services/storage/storage.service';
import { Jwt } from './utils/jwt.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'med';
  hideSideNav: boolean = false;

  constructor(
    public sideNavService: SidenavService,
    private readonly storageService: StorageService
  ) {}

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

    this.validateAccessInit();
  }

  toggleSideNav() {
    this.hideSideNav = !this.hideSideNav;
  }

  validateAccessInit() {
    const accessToken = this.storageService.getAccessToken();
    if (!accessToken) {
      return;
    }

    const decodedAccessToken = Jwt.parseJwt(accessToken);
    if (Date.now() >= decodedAccessToken.exp * 1000) {
      this.storageService.clearStorage();
      window.location.reload();
    }
  }
}
