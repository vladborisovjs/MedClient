import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScheduleComponent} from './components/schedule/schedule.component';
import {ScheduleRoutingModule} from './schedule-routing.module';
import {NavigationModule} from '../navigation/navigation.module';
import { EmployeesComponent } from './components/employees/employees.component';
import { BrigadesComponent } from './components/brigades/brigades.component';
import { ScheduleTableComponent } from './components/schedule-table/schedule-table.component';
import {ScheduleService} from './services/schedule.service';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import { ModalAddPerformerScheduleComponent } from './components/modal-add-performer-schedule/modal-add-performer-schedule.component';
import { ModalPerformerScheduleListComponent } from './components/modal-performer-schedule-list/modal-performer-schedule-list.component';
import { ModalBrigadeScheduleItemComponent } from './components/modal-brigade-schedule-item/modal-brigade-schedule-item.component';
import { ModalAddBrigadeScheduleComponent } from './components/modal-add-brigade-schedule/modal-add-brigade-schedule.component';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import { ModalAddPerformerToBrigadeComponent } from './components/modal-add-performer-to-brigade/modal-add-performer-to-brigade.component';
import { ModalAddTransportToBrigadeComponent } from './components/modal-add-transport-to-brigade/modal-add-transport-to-brigade.component';
import { ModalProlongationComponent } from './components/modal-prolongation/modal-prolongation.component';
import {ModalModule} from '../shared/modal/modal.module';
import { ModalEditPerformerInBrigadeComponent } from './components/modal-edit-performer-in-brigade/modal-edit-performer-in-brigade.component';
import { ModalEditTransportInBrigadeComponent } from './components/modal-edit-transport-in-brigade/modal-edit-transport-in-brigade.component';
import { BrigadesControlComponent } from './components/brigades-control/brigades-control.component';
import {DictionariesModule} from '../dictionaries/dictionaries.module';
import { ModalConfirmCutTimeComponent } from './components/modal-confirm-cut-time/modal-confirm-cut-time.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    EmployeesComponent,
    BrigadesComponent,
    ScheduleTableComponent,
    ModalAddPerformerScheduleComponent,
    ModalPerformerScheduleListComponent,
    ModalBrigadeScheduleItemComponent,
    ModalAddBrigadeScheduleComponent,
    ModalAddPerformerToBrigadeComponent,
    ModalAddTransportToBrigadeComponent,
    ModalProlongationComponent,
    ModalEditPerformerInBrigadeComponent,
    ModalEditTransportInBrigadeComponent,
    BrigadesControlComponent,
    ModalConfirmCutTimeComponent
  ],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    NavigationModule,
    SimpleControlModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    GridTableModule,
    ModalModule,
    DictionariesModule
  ],
  providers: [
    ScheduleService,
  ],
  entryComponents: [
    ModalAddPerformerScheduleComponent,
    ModalPerformerScheduleListComponent,
    ModalBrigadeScheduleItemComponent,
    ModalAddBrigadeScheduleComponent,
    ModalAddPerformerToBrigadeComponent,
    ModalAddTransportToBrigadeComponent,
    ModalProlongationComponent,
    ModalEditPerformerInBrigadeComponent,
    ModalEditTransportInBrigadeComponent,
    ModalConfirmCutTimeComponent
  ]
})
export class ScheduleModule {
}
