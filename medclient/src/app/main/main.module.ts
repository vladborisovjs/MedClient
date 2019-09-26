import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StartComponent} from './components/start/start.component';
import {MainComponent} from './components/main/main.component';
import {MainRoutingModule} from './main-routing.module';
import {NavigationModule} from '../navigation/navigation.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import {AngularFireMessaging, AngularFireMessagingModule} from '@angular/fire/messaging';
import {FireMessagingService} from './services/fire-messaging.service';
import { PushControlComponent } from './components/push-control/push-control.component';

@NgModule({
  declarations: [StartComponent, MainComponent, PushControlComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    NgbModule,
    NavigationModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBb27pf4sKWwbw5TogB_M5Tk38F_kwphM4",
      authDomain: "tcmk-push.firebaseapp.com",
      databaseURL: "https://tcmk-push.firebaseio.com",
      projectId: "tcmk-push",
      storageBucket: "",
      messagingSenderId: "26442951170",
      appId: "1:26442951170:web:dbe7e128f0f529be"
    }),


  ],
  providers: [
    AngularFireMessaging,
    FireMessagingService
  ]
})
export class MainModule {
}
