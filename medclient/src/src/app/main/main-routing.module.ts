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
      // {
      //   path: 'schedule',
      //   loadChildren: '../schedule/schedule.module#ScheduleModule',
      //   data: {
      //     title: 'Управление сотрудниками и бригадами',
      //   },
      // },
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
      // {
      //   path: 'drugstore',
      //   loadChildren: '../drugstore/drugstore.module#DrugstoreModule'
      // },
      {
        path: 'drugstore2',
        loadChildren: '../drugstore2/drugstore-bag.module#DrugstoreBagModule'
      },
      {
        path: 'admin',
        loadChildren: '../admin/admin.module#AdminModule'
      },
      {
        path: 'arm-brigade',
        loadChildren: '../arm-brigade/arm-brigade.module#ArmBrigadeModule'
      },
      {
        path: 'tcmk-calls',
        loadChildren: '../tcmk-calls/tcmk-calls.module#TcmkCallsModule'
      },
      {
        path: 'aviation',
        loadChildren: '../aviation/aviation.module#AviationModule'
      },
      {
        path: 'info-exchange',
        loadChildren: '../info-exchange/info-exchange.module#InfoExchangeModule'
      },
      {
        path: 'shift-control',
        loadChildren: '../shift-control/shift-control.module#ShiftControlModule',
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
