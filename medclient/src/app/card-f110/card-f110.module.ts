import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardF110RoutingModule } from './card-f110-routing.module';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {InfoPlateModule} from '../shared/info-plate/info-plate.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from '../shared/modal/modal.module';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CardSideTwoComponent} from './components/card-side-two/card-side-two.component';
import {F110Component} from './components/f110/f110.component';
import {CardSideOnePatientComponent} from './components/card-side-one-patient/card-side-one-patient.component';
import {CardSideOneComponent} from './components/card-side-one/card-side-one.component';
import {CardAnamnesisComponent} from './components/card-anamnesis/card-anamnesis.component';
import {CardResultComponent} from './components/card-result/card-result.component';
import {CardProtocolComponent} from './components/card-protocol/card-protocol.component';
import {ModalMkb10DiagnosisComponent} from './components/modal-mkb10-diagnosis/modal-mkb10-diagnosis.component';
import {ModalAddDrugsComponent} from './components/modal-add-drugs/modal-add-drugs.component';
import {ModalCardResultTherapyComponent} from './components/modal-card-result-therapy/modal-card-result-therapy.component';
import {TreeTableModule} from 'primeng/primeng';
import {CardItemResolverService} from './services/resolvers/card-item-resolver.service';

@NgModule({
  declarations: [
    F110Component,
    CardSideOneComponent,
    CardSideTwoComponent,
    CardResultComponent,
    CardProtocolComponent,
    CardSideOnePatientComponent,
    CardAnamnesisComponent,
    ModalAddDrugsComponent,
    ModalMkb10DiagnosisComponent,
    ModalCardResultTherapyComponent,
  ],
  imports: [
    CommonModule,
    CardF110RoutingModule,
    GridTableModule,
    SimpleControlModule,
    InfoPlateModule,
    NgbModule,
    ModalModule,
    SimpleNotificationsModule,
    FormsModule,
    ReactiveFormsModule,
    TreeTableModule,
  ],
  providers: [
    CardItemResolverService
  ],
  entryComponents: [
    ModalMkb10DiagnosisComponent,
    ModalCardResultTherapyComponent,
    ModalAddDrugsComponent,
    ModalAddDrugsComponent,
  ]
})
export class CardF110Module { }
