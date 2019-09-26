import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AviationComponent} from './components/aviation/aviation.component';
import {AviaRequetsComponent} from './components/avia-requets/avia-requets.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Авиация',
    },
    children: [
      {
        path: '',
        component: AviationComponent,
        data: {
          title: null,
        },
      },
      {
        path: 'requests',
        component: AviaRequetsComponent,
        data: {
          title: 'Заявки'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AviationRoutingModule {
}
