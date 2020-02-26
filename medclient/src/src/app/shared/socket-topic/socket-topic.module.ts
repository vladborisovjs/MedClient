import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SocketControlComponent} from "./components/socket-control/socket-control.component";
import {IncommingCallComponent} from "./components/modal-incoming-call/incomming-call.component";
import {ModalUkioIncomingComponent} from "./components/modal-ukio-incoming/modal-ukio-incoming.component";
import {ModalIncomingAviationComponent} from "./components/modal-incoming-aviation/modal-incoming-aviation.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ModalBrigadeOverdueComponent} from './components/modal-brigade-overdue/modal-brigade-overdue.component';

@NgModule({
  declarations: [
    SocketControlComponent,
    IncommingCallComponent,
    ModalUkioIncomingComponent,
    ModalIncomingAviationComponent,
    ModalBrigadeOverdueComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
  ],
  entryComponents: [
    SocketControlComponent,
    IncommingCallComponent,
    ModalUkioIncomingComponent,
    ModalIncomingAviationComponent,
    ModalBrigadeOverdueComponent
  ],
  exports: [
    SocketControlComponent,
  ],

})
export class SocketTopicModule {
}
