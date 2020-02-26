import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsComponent} from './components/reports/reports.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '',
    },
    children: [
      {
        path: '',
        component: ReportsComponent,
        data: {
          title: 'Отчеты',
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
export class ReportsRoutingModule {
}
