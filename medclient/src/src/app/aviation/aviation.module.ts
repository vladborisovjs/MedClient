import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AviationRoutingModule} from './aviation-routing.module';
import {AviationComponent} from './components/aviation/aviation.component';
import {NavigationModule} from '../navigation/navigation.module';
import {AviaRequetsComponent} from './components/avia-requets/avia-requets.component';
import {AviationScheduleComponent} from './components/aviation-schedule/aviation-schedule.component';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {ShiftControlSharedModule} from "../shift-control/shift-control-shared/shift-control-shared.module";
import {PerformerShiftService} from "../shift-control/shift-control-shared/services/performer-shift.service";
import {BrigadeShiftService} from "../shift-control/shift-control-shared/services/brigade-shift.service";
import {AviationPerformerShiftService} from "./services/aviation-performer-shift.service";
import {AviationBrigadeShiftService} from "./services/aviation-brigade-shift.service";
import { ModalRejectRequestComponent } from './components/modal-reject-request/modal-reject-request.component';

@NgModule({
  declarations: [AviationComponent, AviaRequetsComponent, AviationScheduleComponent, ModalRejectRequestComponent],
  imports: [
    CommonModule,
    AviationRoutingModule,
    NavigationModule,
    GridTableModule,
    LightResizerModule,
    SimpleControlModule,
    ShiftControlSharedModule,
  ],
  providers: [
    {provide: PerformerShiftService, useClass: AviationPerformerShiftService},
    {provide: BrigadeShiftService, useClass: AviationBrigadeShiftService},
  ],
  entryComponents: [
    ModalRejectRequestComponent
  ]
})
export class AviationModule {
}
