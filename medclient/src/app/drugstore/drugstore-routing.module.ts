import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DrugstoreComponent} from './components/drugstore/drugstore.component';
import {DrugBagsComponent} from './components/drug-bags/drug-bags.component';
import {DrugBagTemplatesComponent} from './components/drug-bag-templates/drug-bag-templates.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Аптека',
    },
    children: [
      {
        path: '',
        component: DrugstoreComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'bags',
        component: DrugBagsComponent,
        data: {
          title: 'Укладки',
        },
      },
      {
        path: 'bags-templates',
        component: DrugBagTemplatesComponent,
        data: {
          title: 'Шаблоны укладок',
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
