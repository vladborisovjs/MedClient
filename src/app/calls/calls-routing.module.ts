import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CallsComponent} from './components/calls/calls.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CallsComponent,
        data: {
          title: 'Вызовы',
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
export class CallsRoutingModule {
}
