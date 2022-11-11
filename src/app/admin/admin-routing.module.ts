import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadAllUserDetailGuard } from '../guards/load-all-user-detail/load-all-user-detail.guard';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';

const routes: Routes = [
  { path: '', component: AdminloginComponent },
  {
    path: 'dashboard',
    component: AdmindashboardComponent,
    canActivate: [LoadAllUserDetailGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
