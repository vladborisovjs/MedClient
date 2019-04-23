import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScheduleComponent} from './components/schedule/schedule.component';
import {ScheduleRoutingModule} from './schedule-routing.module';

@NgModule({
  declarations: [ScheduleComponent],
  imports: [
    CommonModule,
    ScheduleRoutingModule
  ]
})
export class ScheduleModule {
}
