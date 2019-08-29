import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScheduleComponent} from './components/schedule/schedule.component';
import {EmployeesComponent} from './components/employees/employees.component';
import {BrigadesComponent} from './components/brigades/brigades.component';
import {BrigadesControlComponent} from './components/brigades-control/brigades-control.component';
import {DictionaryInfoComponent} from '../dictionaries/components/dictionary-info/dictionary-info.component';
import {DictionaryItemComponent} from '../dictionaries/components/dictionary-item/dictionary-item.component';
import {BrigadesControlListResolverService} from './services/resolvers/brigades-control-list-resolver.service';
import {BrigadesControlItemResolverService} from './services/resolvers/brigades-control-item-resolver.service';

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
          title: 'Сотрудники',
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
        data: {
          title: 'Список бригад',
        },
        children: [
          {
            path: '',
            component: DictionaryInfoComponent,
            data: {
              title: '',
            },
            resolve: {
              // itemWithList: DictionaryInfoResolverService
              itemWithList: BrigadesControlListResolverService
            }
          },
          {
            path: ':dictItem',
            component: DictionaryItemComponent,
            data: {
              title: 'Бригада',
            },
            resolve: {
              itemWithContent: BrigadesControlItemResolverService
            }
          }
        ]
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
