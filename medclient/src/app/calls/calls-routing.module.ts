import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CallsComponent} from './components/calls/calls.component';
import {CallItemComponent} from './calls-shared/call-item/call-item.component';
import {CallItemResolverService} from './services/resolvers/call-item-resolver.service';
import {NewCallComponent} from './calls-shared/new-call/new-call.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Диспетчеризация',
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
        path: 'new-call',
        component: NewCallComponent,
        data: {
          title: 'Новый вызов'
        }
      },
      {
        path: ':callId',
        resolve: {
          callItem: CallItemResolverService
        },
        data: {
          title: 'Вызов',
        },
        children: [
          {
            path: '',
            component: CallItemComponent,
            data: {
              title: null,
            },
          },
          {
            path: 'card',
            data: {
              title: null,
            },
            loadChildren: '../card-f110/card-f110.module#CardF110Module'
          }
        ]
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
