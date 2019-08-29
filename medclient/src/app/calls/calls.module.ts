import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CallsComponent} from './components/calls/calls.component';
import {CallsRoutingModule} from './calls-routing.module';
import {MatExpansionModule} from '@angular/material';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {AccordionModule, TreeTableModule} from 'primeng/primeng';
import {CallsListComponent} from './components/calls-list/calls-list.component';
import {BrigagesListComponent} from './components/brigages-list/brigages-list.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CallItemComponent} from './components/call-item/call-item.component';
import {CallItemService} from './services/call-item.service';
import {CallsService} from './services/calls.service';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {InfoPlateModule} from '../shared/info-plate/info-plate.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {ModalCallPatientsUpdateComponent} from './components/modal-call-patients-update/modal-call-patients-update.component';
import {ModalModule} from '../shared/modal/modal.module';
import { ModalPatientChronologyComponent } from './components/modal-patient-chronology/modal-patient-chronology.component';
import { ModalCallAppointBrigadeComponent } from './components/modal-call-appoint-brigade/modal-call-appoint-brigade.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ModalCallConfirmBrigadeComponent } from './components/modal-call-confirm-brigade/modal-call-confirm-brigade.component';
import { ModalProtocolComponent } from './components/modal-protocol/modal-protocol.component';
import { F110Component } from './components/f110/f110.component';
import { ModalCallF110Component } from './components/modal-call-f110/modal-call-f110.component';
import { CardSideOneComponent } from './components/card-side-one/card-side-one.component';
import { CardSideTwoComponent } from './components/card-side-two/card-side-two.component';
import { CardResultComponent } from './components/card-result/card-result.component';
import { CardProtocolComponent } from './components/card-protocol/card-protocol.component';
import {CallItemResolverService} from './services/resolvers/call-item-resolver.service';
import {CardItemResolverService} from './services/resolvers/card-item-resolver.service';
import {CardItemService} from './services/card-item.service';
import { CardSideOnePatientComponent } from './components/card-side-one-patient/card-side-one-patient.component';
import { CardAnamnesisComponent } from './components/card-anamnesis/card-anamnesis.component';
import { ModalAddTherapyComponent } from './components/modal-add-therapy/modal-add-therapy.component';
import { ModalAddDrugsComponent } from './components/modal-add-drugs/modal-add-drugs.component';
import {BrigadeDutyService} from './services/brigade-duty.service';
import { ModalCallBrigadeStatusesComponent } from './components/modal-call-brigade-statuses/modal-call-brigade-statuses.component';
import { ModalF110Component } from './components/modal-f110/modal-f110.component';
import { ModalCallJournalComponent } from './components/modal-call-journal/modal-call-journal.component';
import { ModalCallTransferComponent } from './components/modal-call-transfer/modal-call-transfer.component';
import { ModalCallTransferAvailableComponent } from './components/modal-call-transfer-available/modal-call-transfer-available.component';
import { ModalCreateCallComponent } from './components/modal-create-call/modal-create-call.component';
import { ModalSimilarCallsComponent } from './components/modal-similar-calls/modal-similar-calls.component';
import { ModalCallInquirerComponent } from './components/modal-call-inquirer/modal-call-inquirer.component';
import {BestMapModule} from '../shared/best-map/best-map.module';
import { CardListComponent } from './components/card-list/card-list.component';
import { CallItemBrigadesComponent } from './components/call-item-brigades/call-item-brigades.component';
import { CallItemMapComponent } from './components/call-item-map/call-item-map.component';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {FullAddressModule} from '../shared/full-address/full-address.module';
import { ModalMkb10DiagnosisComponent } from './components/modal-mkb10-diagnosis/modal-mkb10-diagnosis.component';

@NgModule({
  declarations: [
    CallsComponent,
    CallsListComponent,
    BrigagesListComponent,
    CallItemComponent,
    ModalCallPatientsUpdateComponent,
    ModalPatientChronologyComponent,
    ModalCallAppointBrigadeComponent,
    ModalCallConfirmBrigadeComponent,
    ModalProtocolComponent,
    F110Component,
    ModalCallF110Component,
    CardSideOneComponent,
    CardSideTwoComponent,
    CardResultComponent,
    CardProtocolComponent,
    CardSideOnePatientComponent,
    CardAnamnesisComponent,
    ModalAddTherapyComponent,
    ModalAddDrugsComponent,
    ModalCallBrigadeStatusesComponent,
    ModalF110Component,
    ModalCallJournalComponent,
    ModalCallTransferComponent,
    ModalCallTransferAvailableComponent,
    ModalCreateCallComponent,
    ModalSimilarCallsComponent,
    ModalCallInquirerComponent,
    CardListComponent,
    CallItemBrigadesComponent,
    CallItemMapComponent,
    ModalMkb10DiagnosisComponent,

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
    SimpleNotificationsModule,
    FormsModule,
    ReactiveFormsModule,
    BestMapModule,
    LightResizerModule,
    FullAddressModule,
    BestMapModule,
    TreeTableModule,
  ],
  providers: [
    CallsService,
    CallItemService,
    CardItemService,
    CallsRoutingModule,
    CallItemResolverService,
    CardItemResolverService,
    BrigadeDutyService
  ],
  entryComponents: [
    ModalCallPatientsUpdateComponent,
    ModalCallPatientsUpdateComponent,
    ModalPatientChronologyComponent,
    ModalCallAppointBrigadeComponent,
    ModalCallConfirmBrigadeComponent,
    ModalProtocolComponent,
    ModalCallF110Component,
    ModalAddTherapyComponent,
    ModalAddDrugsComponent,
    ModalCallBrigadeStatusesComponent,
    ModalAddDrugsComponent,
    ModalF110Component,
    ModalCallJournalComponent,
    ModalCallTransferComponent,
    ModalCallTransferAvailableComponent,
    ModalCreateCallComponent,
    ModalSimilarCallsComponent,
    ModalCallInquirerComponent,
    ModalMkb10DiagnosisComponent
  ]
})
export class CallsModule {
}
