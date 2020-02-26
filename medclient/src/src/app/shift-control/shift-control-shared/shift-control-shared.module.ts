import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShiftTableComponent} from './components/shift-table/shift-table.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ModalPerformerShiftListComponent} from './components/modal-performer-shift-list/modal-performer-shift-list.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {ModalPerformerUpdateShiftComponent} from './components/modal-performer-update-shift/modal-performer-update-shift.component';
import {SimpleControlModule} from "../../shared/simple-control/simple-control.module";
import {ShiftTableBrigadeComponent} from './components/shift-table-brigade/shift-table-brigade.component';
import {ModalBrigadeShiftListComponent} from './components/modal-brigade-shift-list/modal-brigade-shift-list.component';
import {ModalBrigadeUpdateShiftComponent} from './components/modal-brigade-update-shift/modal-brigade-update-shift.component';
import {ModalBrigadeAddPerformerComponent} from './components/modal-brigade-add-performer/modal-brigade-add-performer.component';
import {ModalBrigadeAddTransportComponent} from './components/modal-brigade-add-transport/modal-brigade-add-transport.component';
import { ModalPerformerProlongationComponent } from './components/modal-performer-prolongation/modal-performer-prolongation.component';
import { ModalPerformerProlongationDeleteComponent } from './components/modal-performer-prolongation-delete/modal-performer-prolongation-delete.component';
import {DictionariesModule} from "../../dictionaries/dictionaries.module";
import {DictionaryModule} from "../../shared/dictionary/dictionary.module";
import {ModalReportOptionsComponent} from '../../reports/components/modal-report-options/modal-report-options.component';
import {ReportsModule} from '../../reports/reports.module';
import {VirtualScrollerModule} from "ngx-virtual-scroller";

@NgModule({
  declarations:
    [
      ShiftTableComponent,
      ModalPerformerShiftListComponent,
      ModalPerformerUpdateShiftComponent,
      ShiftTableBrigadeComponent,
      ModalBrigadeShiftListComponent,
      ModalBrigadeUpdateShiftComponent,
      ModalBrigadeAddPerformerComponent,
      ModalBrigadeAddTransportComponent,
      ModalPerformerProlongationComponent,
      ModalPerformerProlongationDeleteComponent,

    ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    SimpleControlModule,
    DictionariesModule,
    DictionaryModule,
    ReportsModule,
    VirtualScrollerModule
  ],
  entryComponents: [
    ModalPerformerShiftListComponent,
    ModalPerformerUpdateShiftComponent,
    ModalBrigadeShiftListComponent,
    ModalBrigadeUpdateShiftComponent,
    ModalBrigadeAddPerformerComponent,
    ModalBrigadeAddTransportComponent,
    ModalPerformerProlongationComponent,
    ModalPerformerProlongationDeleteComponent,
    ModalReportOptionsComponent,
  ]
})
export class ShiftControlSharedModule {
}
