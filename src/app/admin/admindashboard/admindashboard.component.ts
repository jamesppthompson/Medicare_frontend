import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AllUserDetailService } from 'src/app/+state/all-user-detail/all-user-detail.service';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
})
export class AdmindashboardComponent implements OnInit, OnDestroy {
  loading = false;
  searchText: any;
  page = 1;
  pageSize = 20;
  listCustomers: any[] = [];
  subscriptions = new Subscription();

  constructor(
    public commonservice: CommonService,
    private api: ApiService,
    private router: Router,
    public toastr: ToastrService,
    public readonly allUserDetailService: AllUserDetailService
  ) {}

  ngOnInit(): void {
    // this.GetRegsiterCustomers();

    this.initAllUserDetail();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async GetRegsiterCustomers() {
    try {
      this.loading = true;
      const res = await this.commonservice.SubmitGetFormData(
        this.api.systemAPI.admindashboard
      );
      if (res.status != '1') {
        this.toastr.error(res.message, '');
        this.listCustomers = [];
        return;
      }
      this.listCustomers = JSON.parse(res.data);
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  initAllUserDetail() {
    this.subscriptions.add(
      this.allUserDetailService.allUserDetail$.subscribe(
        (allUserDetail: any[]) => {
          this.listCustomers = allUserDetail;
        }
      )
    );
  }

  isSubscriptionExpired(subscriptionEndDate: string) {
    return moment(subscriptionEndDate) >= moment() ? 'No' : 'Yes';
  }
}
