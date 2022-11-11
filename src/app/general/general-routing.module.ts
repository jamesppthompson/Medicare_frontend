import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadProfileGuard } from '../guards/load-profile/load-profile.guard';
import { LoadSubscriptionPlansGuard } from '../guards/load-subscription-plans/load-subscription-plans.guard';
import { AgreementComponent } from './agreement/agreement.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' },
    canActivate: [LoadProfileGuard, LoadSubscriptionPlansGuard],
  },
  {
    path: 'agreement',
    component: AgreementComponent,
    data: { title: 'Home' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}
