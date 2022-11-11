import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { IndexComponent } from './index/index.component';
import { AboutComponent } from './about/about.component';
import { WorksComponent } from './works/works.component';
import { PricingComponent } from './pricing/pricing.component';
import { ContactComponent } from './contact/contact.component';
import { MenutopComponent } from './menutop/menutop.component';
import { MobilenavComponent } from './mobilenav/mobilenav.component';
import { SystemRoutingModule } from '../system/system-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { FooterComponent } from './footer/footer.component';
import { LivechatWidgetModule } from '@livechat/angular-widget';
import { LandingHeaderComponent } from './landing-header/landing-header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainPhoneMaskDirective } from './main-phone-mask.directive';
import { PaymentModule } from '../payment/payment.module';

@NgModule({
  declarations: [
    IndexComponent,
    AboutComponent,
    WorksComponent,
    PricingComponent,
    ContactComponent,
    MenutopComponent,
    MobilenavComponent,
    FooterComponent,
    LandingHeaderComponent,
    LandingPageComponent,
    MainPhoneMaskDirective,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SystemRoutingModule,
    LivechatWidgetModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot({ timeOut: 900, positionClass: 'toast-top-center' }),
    PaymentModule,
  ],
  exports: [
    MainPhoneMaskDirective,
    MenutopComponent,
    MobilenavComponent,
    FooterComponent,
  ],
})
export class MainModule {}
