import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { IndexComponent } from './index/index.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PricingComponent } from './pricing/pricing.component';
import { WorksComponent } from './works/works.component';
import { PaymentComponent } from '../payment/payment/payment.component'
import { CallComponent } from './call/call.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'home', component: IndexComponent },
  { path: 'about', component: AboutComponent },
  { path: 'works', component: WorksComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'call', component: CallComponent },
  { path: 'users', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
