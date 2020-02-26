import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './components/admin/admin.component';
import {AdminUsersComponent} from './components/admin-users/admin-users.component';
import {OperatorInfoComponent} from "./components/operator-info/operator-info.component";
import {UserLogsComponent} from "./components/user-logs/user-logs.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Администрирование',
    },
    children: [
      {
        path: '',
        component: AdminComponent,
        data: {
          title: null,
        },
      },
      {
        path: 'users',
        component: AdminUsersComponent,
        data: {
          title: 'Сотрудники',
        },
      },
      {
        path: 'operator-info',
        component: OperatorInfoComponent,
        data: {
          title: 'Сотрудники',
        },
      },
      {
        path: 'logs',
        component: UserLogsComponent,
        data: {
          title: 'Журнал',
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
export class AdminRoutingModule {
}
