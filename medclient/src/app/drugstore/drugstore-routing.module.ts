import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DrugstoreComponent} from './components/drugstore/drugstore.component';
import {ManagingDrugstoreComponent} from './components/managing-drugstore/managing-drugstore.component';
import {MonitoringDrugstoreComponent} from './components/monitoring-drugstore/monitoring-drugstore.component';
import {EditionDrugstoreComponent} from './components/edition-drugstore/edition-drugstore.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '',
    },
    children: [
      {
        path: '',
        component: DrugstoreComponent,
        data: {
          title: 'Аптека',
        },
      },
      {
        path: 'monitoring-drugstore',
        component: MonitoringDrugstoreComponent,
        data: {
          title: 'Отслеживание',
        },
      },
      {
        path: 'managing-drugstore',
        component: ManagingDrugstoreComponent,
        data: {
          title: 'Управление',
        },
      },
      {
        path: 'edition-drugstore',
        component: EditionDrugstoreComponent,
        data: {
          title: 'Редактирование',
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
export class DrugstoreRoutingModule {
}
