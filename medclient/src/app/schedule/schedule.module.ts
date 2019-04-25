import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScheduleComponent} from './components/schedule/schedule.component';
import {ScheduleRoutingModule} from './schedule-routing.module';
import {NavigationModule} from '../navigation/navigation.module';
import { EmployeesComponent } from './components/employees/employees.component';
import { BrigadesComponent } from './components/brigades/brigades.component';
import { BrigadesControlComponent } from './components/brigades-control/brigades-control.component';

@NgModule({
  declarations: [ScheduleComponent, EmployeesComponent, BrigadesComponent, BrigadesControlComponent],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    NavigationModule
  ]
})
export class ScheduleModule {
}
