import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  hideSideNav: boolean = false;
 
  constructor() { }
 
  toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
    console.log("connected!")
  }
}
