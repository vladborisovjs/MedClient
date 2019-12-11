import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StartComponent} from './components/start/start.component';
import {MainComponent} from './components/main/main.component';
import {MainRoutingModule} from './main-routing.module';
import {NavigationModule} from '../navigation/navigation.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SocketTopicModule} from "../shared/socket-topic/socket-topic.module";



@NgModule({
  declarations: [StartComponent, MainComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    NgbModule,
    NavigationModule,
    SocketTopicModule
  ],

})
export class MainModule {
}
