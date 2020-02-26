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
import {ModalAddDrugsComponent} from './components/modal-add-drugs/modal-add-drugs.component';
import {ModalCardResultTherapyComponent} from './components/modal-card-result-therapy/modal-card-result-therapy.component';
import {TreeTableModule} from 'primeng/primeng';
import {CardItemResolverService} from './services/resolvers/card-item-resolver.service';
import { ModalAddPatientToCardComponent } from './components/modal-add-patient-to-card/modal-add-patient-to-card.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ModalCardResultTherapyWithBagComponent} from './components/modal-card-result-therapy-with-bag/modal-card-result-therapy-with-bag.component';
import {ModalMkb10DiagnosisModule} from '../shared/modal-mkb10-diagnosis/modal-mkb10-diagnosis.module';
import {LOCK_CONF, TeldaNgLocksService} from "telda-ng-locks";
import {API_BASE_URL} from "../../../swagger/med-api.service";
import {CardItemService} from "./services/card-item.service";
import {MedPipesModule} from "../shared/med-pipes/med-pipes.module";
import { ModalCardValidWarnComponent } from './components/modal-card-valid-warn/modal-card-valid-warn.component';

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
    ModalCardResultTherapyComponent,
    ModalAddPatientToCardComponent,
    ModalCardResultTherapyWithBagComponent,
    ModalCardValidWarnComponent,
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
    NgSelectModule,
    ModalMkb10DiagnosisModule,
    MedPipesModule
  ],
  providers: [
    CardItemResolverService,
    CardItemService,
    TeldaNgLocksService,
    {
      provide: LOCK_CONF,
      useFactory: (url) => {
        return {
          name: `card`,
          url: `${url}/api/locks/card`
        };
      },
      deps: [API_BASE_URL]
    },
  ],
  entryComponents: [
    ModalCardResultTherapyComponent,
    ModalCardResultTherapyWithBagComponent,
    ModalAddDrugsComponent,
    ModalAddDrugsComponent,
    ModalAddPatientToCardComponent,
    ModalCardValidWarnComponent
  ]
})
export class CardF110Module { }
