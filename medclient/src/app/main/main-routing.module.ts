import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {StartComponent} from './components/start/start.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      title: null,
    },
    children: [
      {
        path: '',
        redirectTo: 'start'
      },
      {
        path: 'start',
        component: StartComponent
      },
      {
        path: 'calls',
        loadChildren: '../calls/calls.module#CallsModule'
      },
      {
        path: 'archive',
        loadChildren: '../archive/archive.module#ArchiveModule'
      },
      {
        path: 'schedule',
        loadChildren: '../schedule/schedule.module#ScheduleModule',
        data: {
          title: 'Управление сотрудниками',
        },
      },
      {
        path: 'dictionaries',
        loadChildren: '../dictionaries/dictionaries.module#DictionariesModule'
      },
      {
        path: 'reports',
        loadChildren: '../reports/reports.module#ReportsModule'
      },
      {
        path: 'map',
        loadChildren: '../map/map.module#MapModule'
      },
      {
        path: 'drugstore',
        loadChildren: '../drugstore/drugstore.module#DrugstoreModule'
      },
      {
        path: 'admin',
        loadChildren: '../admin/admin.module#AdminModule'
      },
    ]
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
export class MainRoutingModule {
}
