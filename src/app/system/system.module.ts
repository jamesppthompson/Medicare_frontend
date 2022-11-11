import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { PhoneMaskDirective } from '../phone-mask.directive';
import { MainModule } from '../main/main.module';

@NgModule({
  declarations: [SignupComponent, LoginComponent, PhoneMaskDirective],
  imports: [
    CommonModule,
    SystemRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot({ timeOut: 900, positionClass: 'toast-top-center' }),
    MainModule,
  ],
  exports: [PhoneMaskDirective, SignupComponent],
})
export class SystemModule {}
