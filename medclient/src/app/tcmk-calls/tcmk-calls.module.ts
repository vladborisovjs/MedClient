import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TcmkCallsRoutingModule} from './tcmk-calls-routing.module';
import {TcmkCallsComponent} from './components/tcmk-calls/tcmk-calls.component';
import {AviationRequestsComponent} from './components/aviation-requests/aviation-requests.component';
import {AviationCallsService} from './services/aviation-calls.service';
import {CallsService} from '../calls/services/calls.service';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {CallsSharedModule} from '../calls/calls-shared/calls-shared.module';

@NgModule({
  declarations: [TcmkCallsComponent, AviationRequestsComponent],
  imports: [
    CommonModule,
    TcmkCallsRoutingModule,
    CallsSharedModule,
    LightResizerModule
  ],
  providers: [
    {provide: CallsService, useClass: AviationCallsService}
  ]
})
export class TcmkCallsModule {
}
