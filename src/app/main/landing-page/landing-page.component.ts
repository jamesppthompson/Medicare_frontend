import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  constructor(public commonservice: CommonService) {}

  ngOnInit(): void {}

  chatclick() {
    this.commonservice.ChatClick(true);
  }
}
