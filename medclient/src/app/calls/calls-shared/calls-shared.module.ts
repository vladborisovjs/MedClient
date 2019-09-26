import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CallsListComponent} from './calls-list/calls-list.component';
import {GridTableModule} from '../../shared/grid-table/grid-table.module';
import {SimpleControlModule} from '../../shared/simple-control/simple-control.module';
import {CardListComponent} from './card-list/card-list.component';
import {LightResizerModule} from '../../shared/light-resizer/light-resizer.module';
import {CallItemComponent} from './call-item/call-item.component';
import {FullAddressModule} from '../../shared/full-address/full-address.module';
import {BestMapModule} from '../../shared/best-map/best-map.module';
import {CallItemBrigadesComponent} from './call-item-brigades/call-item-brigades.component';
import { CallItemArmBrigadeComponent } from './call-item-arm-brigade/call-item-arm-brigade.component';
import {ModalCallBrigadeStatusesComponent} from './modal-call-brigade-statuses/modal-call-brigade-statuses.component';
import {ModalCallAppointBrigadeComponent} from './modal-call-appoint-brigade/modal-call-appoint-brigade.component';
import {ModalCallF110Component} from './modal-call-f110/modal-call-f110.component';
import { ModalAviationRequestComponent } from './modal-aviation-request/modal-aviation-request.component';
import {NewCallComponent} from './new-call/new-call.component';
import {RouterModule} from '@angular/router';
import {ModalCallInquirerComponent} from './modal-call-inquirer/modal-call-inquirer.component';

@NgModule({
  declarations: [
    CallsListComponent,
    CardListComponent,
    CallItemComponent,
    CallItemBrigadesComponent,
    CallItemArmBrigadeComponent,
    ModalCallBrigadeStatusesComponent,
    ModalCallAppointBrigadeComponent,
    NewCallComponent,
    ModalCallF110Component,
    ModalAviationRequestComponent,
    ModalCallInquirerComponent
  ],
  imports: [
    CommonModule,
    GridTableModule,
    SimpleControlModule,
    LightResizerModule,
    FullAddressModule,
    BestMapModule,
    RouterModule
  ],
  exports: [
    CallsListComponent,
    CardListComponent
  ],
  entryComponents: [
    ModalCallBrigadeStatusesComponent,
    ModalCallAppointBrigadeComponent,
    ModalCallF110Component,
    ModalAviationRequestComponent,
    ModalCallInquirerComponent,
  ]
})
export class CallsSharedModule { }
