import { Component, OnInit, ViewChild } from '@angular/core';
import {
  LiveChatWidgetModel,
  LiveChatWidgetApiModel,
} from '@livechat/angular-widget';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  public visitor: { name: string; email: string };
  lic = 13286154;
  public isLiveChatWidgetLoaded: boolean = false;
  public liveChatApi: LiveChatWidgetApiModel | any;
  licenseId = 13286154;
  Is_Login = false;
  @ViewChild('liveChatWidget', { static: false }) public liveChatWidget:
    | LiveChatWidgetModel
    | any;
  constructor(public commonservice: CommonService) {
    this.visitor = {
      name: ' ',
      email: ' ',
    };
    this.commonservice.is_ChatClick.subscribe((res) => {
      if (res === true) {
        this.openChatWindow();
      }
    });
  }

  ngOnInit(): void {}
  onChatLoaded(api: LiveChatWidgetApiModel): void {
    this.liveChatApi = api;
    this.isLiveChatWidgetLoaded = true;

    // Sometimes it can happen that LC_Invite is is still being loaded when onChatLoaded is called. To ensure that LC_Invite is loaded you can give additional check to onChatLoaded function:
    // api.on_after_load = () => {
    //   this.liveChatApi = api;
    //   this.isLiveChatWidgetLoaded = true;
    // };
  }
  openChatWindow(): void {
    if (this.isLiveChatWidgetLoaded) {
      this.liveChatWidget.openChatWindow();

      // You can also use methods directly on liveChatApi instance
      // for more details plese read our documentation
      // https://developers.livechatinc.com/docs/extending-ui/extending-chat-widget/javascript-api/#methods
      // this.liveChatApi.open_chat_window();
    }
  }
  onChatWindowOpened() {
    console.log('opened');
  }
  onChatWindowMinimized() {
    console.log('minimized');
  }
  hideChatWindow() {
    if (this.isLiveChatWidgetLoaded) {
      this.liveChatWidget.minimizeChatWindow();

      // You can also use methods directly on liveChatApi instance
      // for more details plese read our documentation
      // https://developers.livechatinc.com/docs/extending-ui/extending-chat-widget/javascript-api/#methods
      // this.liveChatApi.minimize_chat_window();
    }
  }
}
