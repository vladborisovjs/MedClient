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
import {CheckboxModule} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from '../../shared/modal/modal.module';
import { ModalAviaRequestInfoComponent } from './modal-avia-request-info/modal-avia-request-info.component';
import {InfoPlateModule} from '../../shared/info-plate/info-plate.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {LogsModule} from "../../shared/logs/logs.module";
import {AudioPlayerModule} from "../../shared/audio-player/audio-player.module";
import {MedPipesModule} from "../../shared/med-pipes/med-pipes.module";
import { ModalCallBrigadeRemoveComponent } from './modal-call-brigade-remove/modal-call-brigade-remove.component';
import { ModalCallPatientArchiveComponent } from './modal-call-patient-archive/modal-call-patient-archive.component';
import { CallsContainerComponent } from './calls-container/calls-container.component';
import { CallsTableComponent } from './calls-table/calls-table.component';
import { CardTableComponent } from './card-table/card-table.component';
import { BriTableComponent } from './bri-table/bri-table.component';
import { CallInfoComponent } from './call-info/call-info.component';
import { BriInfoComponent } from './bri-info/bri-info.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { ModalOverdueCallComponent } from './modal-overdue-call/modal-overdue-call.component';

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
    ModalCallInquirerComponent,
    ModalAviaRequestInfoComponent,
    ModalCallBrigadeRemoveComponent,
    ModalCallPatientArchiveComponent,
    CallsContainerComponent,
    CallsTableComponent,
    CardTableComponent,
    BriTableComponent,
    CallInfoComponent,
    BriInfoComponent,
    ModalOverdueCallComponent
  ],
  imports: [
    CommonModule,
    GridTableModule,
    SimpleControlModule,
    LightResizerModule,
    FullAddressModule,
    BestMapModule,
    RouterModule,
    CheckboxModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    ModalModule,
    InfoPlateModule,
    LogsModule,
    AudioPlayerModule,
    MedPipesModule,
    LightResizerModule,
    NgbModule,
  ],
  exports: [
    CallsTableComponent,
    CardTableComponent,
    CallsListComponent,
    CardListComponent
  ],
  entryComponents: [
    ModalCallBrigadeStatusesComponent,
    ModalCallAppointBrigadeComponent,
    ModalCallF110Component,
    ModalAviationRequestComponent,
    ModalCallInquirerComponent,
    ModalAviaRequestInfoComponent,
    ModalCallBrigadeRemoveComponent,
    ModalCallPatientArchiveComponent,
    ModalOverdueCallComponent
  ]
})
export class CallsSharedModule { }
