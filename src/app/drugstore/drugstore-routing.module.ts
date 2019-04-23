import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DrugstoreComponent} from './components/drugstore/drugstore.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DrugstoreComponent,
        data: {
          title: 'Аптека',
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
