import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { GeneralModule } from './general/general.module';
import { MainModule } from './main/main.module';
import { SystemModule } from './system/system.module';

export function getSystemModule() {
  return SystemModule;
}
export function getMainModule() {
  return MainModule;
}
export function getGeneralModule() {
  return GeneralModule;
}
export function getAdminModule() {
  return AdminModule;
}
const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    redirectTo: 'main/home',
    pathMatch: 'full',
  },
  {
    path: 'main',
    children: [
      {
        path: '',
        loadChildren: getMainModule,
      },
    ],
  },
  {
    path: 'system',
    children: [
      {
        path: '',
        loadChildren: getSystemModule,
      },
    ],
  },
  {
    path: 'general',
    children: [
      {
        path: '',
        loadChildren: getGeneralModule,
      },
    ],
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        loadChildren: getAdminModule,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'main/home',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
