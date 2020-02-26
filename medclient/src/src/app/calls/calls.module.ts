import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CallsComponent} from './components/calls/calls.component';
import {CallsRoutingModule} from './calls-routing.module';
import {MatExpansionModule} from '@angular/material';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {AccordionModule, CheckboxModule, TreeTableModule} from 'primeng/primeng';
import {BrigagesListComponent} from './components/brigages-list/brigages-list.component';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {InfoPlateModule} from '../shared/info-plate/info-plate.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {ModalModule} from '../shared/modal/modal.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalCallConfirmBrigadeComponent} from './components/modal-call-confirm-brigade/modal-call-confirm-brigade.component';
import {ModalProtocolComponent} from './components/modal-protocol/modal-protocol.component';
import {ModalSimilarCallsComponent} from './components/modal-similar-calls/modal-similar-calls.component';
import {BestMapModule} from '../shared/best-map/best-map.module';;
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {FullAddressModule} from '../shared/full-address/full-address.module';
import {CallsSharedModule} from './calls-shared/calls-shared.module';

@NgModule({
  declarations: [
    CallsComponent,
    ModalCallConfirmBrigadeComponent,
    ModalProtocolComponent,
    ModalSimilarCallsComponent,
    BrigagesListComponent

  ],
  imports: [
    CommonModule,
    CallsRoutingModule,
    MatExpansionModule,
    GridTableModule,
    AccordionModule,
    SimpleControlModule,
    InfoPlateModule,
    NgbModule,
    ModalModule,
    SimpleNotificationsModule,
    FormsModule,
    ReactiveFormsModule,
    BestMapModule,
    LightResizerModule,
    FullAddressModule,
    BestMapModule,
    CallsSharedModule,

  ],
  entryComponents: [
    ModalCallConfirmBrigadeComponent,
    ModalProtocolComponent,
    ModalSimilarCallsComponent,

  ]
})
export class CallsModule {
}
