import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TcmkCallsRoutingModule} from './tcmk-calls-routing.module';
import {TcmkCallsComponent} from './components/tcmk-calls/tcmk-calls.component';
import {AviationRequestsComponent} from './components/aviation-requests/aviation-requests.component';
import {AviationCallsService} from './services/aviation-calls.service';
import {CallsService} from '../calls/services/calls.service';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {CallsSharedModule} from '../calls/calls-shared/calls-shared.module';
import { TcmkCallsContainerComponent } from './components/tcmk-calls-container/tcmk-calls-container.component';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    TcmkCallsComponent,
    AviationRequestsComponent,
    TcmkCallsContainerComponent
  ],
  imports: [
    CommonModule,
    TcmkCallsRoutingModule,
    CallsSharedModule,
    LightResizerModule,
    SimpleControlModule,
    CheckboxModule,
    FormsModule,
    NgbModule
  ],
  providers: [
    {provide: CallsService, useClass: AviationCallsService}
  ]
})
export class TcmkCallsModule {
}
