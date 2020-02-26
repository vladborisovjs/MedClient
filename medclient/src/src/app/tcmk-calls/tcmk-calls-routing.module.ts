import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TcmkCallsComponent} from './components/tcmk-calls/tcmk-calls.component';
import {AviationCallItemResolverService} from './services/resolvers/aviation-call-item-resolver.service';
import {CallItemComponent} from '../calls/calls-shared/call-item/call-item.component';
import {NewCallComponent} from '../calls/calls-shared/new-call/new-call.component';
import {TcmkCallsContainerComponent} from "./components/tcmk-calls-container/tcmk-calls-container.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Управление вызовами ТЦМК'
    },

    children: [
      {
        path: '',
        component: TcmkCallsContainerComponent,
        data: {
          title: null
        }
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
          callItem: AviationCallItemResolverService
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TcmkCallsRoutingModule {
}
