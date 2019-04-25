import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScheduleComponent} from './components/schedule/schedule.component';
import {EmployeesComponent} from './components/employees/employees.component';
import {BrigadesComponent} from './components/brigades/brigades.component';
import {BrigadesControlComponent} from './components/brigades-control/brigades-control.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '',
    },
    children: [
      {
        path: '',
        component: ScheduleComponent,
      },
      {
        path: 'employees',
        component: EmployeesComponent,
        data: {
          title: 'Cотрудник',
        },
      },
      {
        path: 'brigades',
        component: BrigadesComponent,
        data: {
          title: 'Бригады',
        },
      },
      {
        path: 'brigades-control',
        component: BrigadesControlComponent,
        data: {
          title: 'Управление бригадами',
        },
      },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ScheduleRoutingModule {
}
