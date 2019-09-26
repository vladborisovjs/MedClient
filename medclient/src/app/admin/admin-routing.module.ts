import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './components/admin/admin.component';
import {AdminUsersComponent} from './components/admin-users/admin-users.component';

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
