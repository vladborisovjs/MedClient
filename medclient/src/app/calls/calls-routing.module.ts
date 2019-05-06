import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CallsComponent} from './components/calls/calls.component';
import {CallItemComponent} from './components/call-item/call-item.component';
import {CallItemResolverService} from './services/resolvers/call-item-resolver.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Вызовы',
    },
    children: [
      {
        path: '',
        component: CallsComponent,
        data: {
          title: null,
        },
      },
      {
        path: ':id',
        component: CallItemComponent,
        data: {
          title: null,
        },
        resolve: {
          callItem: CallItemResolverService
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
