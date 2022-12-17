import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { MainModule } from '../main/main.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentModule } from '../payment/payment.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot({ timeOut: 900, positionClass: 'toast-top-right' }),
    MainModule,
    NgbModule,
    PaymentModule,
  ],
})
export class GeneralModule {}
