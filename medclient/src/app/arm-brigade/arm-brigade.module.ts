import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArmBrigadeComponent} from './components/arm-brigade/arm-brigade.component';
import {ArmBrigadeRoutingModule} from './arm-brigade-routing.module';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {ArmBrigadeService} from './services/arm-brigade.service';
import {CallItemService} from '../calls/services/call-item.service';
import {ArmBrigadeCallItemResolverService} from './services/resolvers/arm-brigade-call-item-resolver.service';
import {CallsSharedModule} from '../calls/calls-shared/calls-shared.module';
import {ModalModule} from '../shared/modal/modal.module';

@NgModule({
  declarations: [ArmBrigadeComponent],
  providers: [
    ArmBrigadeCallItemResolverService,
    [{ provide: CallItemService, useClass: ArmBrigadeService }]
  ],
  imports: [
    CommonModule,
    ArmBrigadeRoutingModule,
    GridTableModule,
    LightResizerModule,
    SimpleControlModule,
    CallsSharedModule,
    ModalModule
  ]
})
export class ArmBrigadeModule { }
