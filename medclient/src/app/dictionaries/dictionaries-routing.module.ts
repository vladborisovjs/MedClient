import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DictionariesComponent} from './components/dictionaries/dictionaries.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DictionariesComponent,
        data: {
          title: 'НСИ',
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
export class DictionariesRoutingModule {
}
