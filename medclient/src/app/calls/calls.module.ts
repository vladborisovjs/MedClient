import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CallsComponent} from './components/calls/calls.component';
import {CallsRoutingModule} from './calls-routing.module';
import {MatExpansionModule} from '@angular/material';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {AccordionModule} from 'primeng/primeng';
import {CallsListComponent} from './components/calls-list/calls-list.component';
import {BrigagesListComponent} from './components/brigages-list/brigages-list.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CallItemComponent} from './components/call-item/call-item.component';
import {CallItemService} from './services/call-item.service';
import {CallsService} from './services/calls.service';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {InfoPlateModule} from '../shared/info-plate/info-plate.module';
import {ModalCallUpdateGeneralComponent} from './components/modal-call-update-general/modal-call-update-general.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalDeclarantUpdateComponent} from './components/modal-declarant-update/modal-declarant-update.component';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {ModalCallPatientsUpdateComponent} from './components/modal-call-patients-update/modal-call-patients-update.component';
import {ModalModule} from '../shared/modal/modal.module';
import { ModalPatientChronologyComponent } from './components/modal-patient-chronology/modal-patient-chronology.component';
import { ModalCallAppointBrigageComponent } from './components/modal-call-appoint-brigage/modal-call-appoint-brigage.component';
import {ModalAddressUpdateComponent} from './components/modal-address-update/modal-address-update.component';

@NgModule({
  declarations: [
    CallsComponent,
    CallsListComponent,
    BrigagesListComponent,
    CallItemComponent,
    ModalCallUpdateGeneralComponent,
    ModalDeclarantUpdateComponent,
    ModalAddressUpdateComponent,
    ModalCallPatientsUpdateComponent,
    ModalPatientChronologyComponent,
    ModalCallAppointBrigageComponent
  ],
  imports: [
    CommonModule,
    CallsRoutingModule,
    MatExpansionModule,
    GridTableModule,
    AccordionModule,
    HttpClientModule,
    SimpleControlModule,
    InfoPlateModule,
    NgbModule,
    ModalModule,
    SimpleNotificationsModule
  ],
  providers: [
    CallsService,
    CallItemService,
    CallsRoutingModule,
  ],
  entryComponents: [
    ModalCallUpdateGeneralComponent,
    ModalDeclarantUpdateComponent,
    ModalCallPatientsUpdateComponent,
    ModalAddressUpdateComponent,
    // ModalUpdateDeclarantComponent,
    ModalCallPatientsUpdateComponent,
    ModalPatientChronologyComponent
  ]
})
export class CallsModule {
}
