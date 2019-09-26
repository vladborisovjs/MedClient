import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArmBrigadeComponent} from './components/arm-brigade/arm-brigade.component';
import {CallItemComponent} from '../calls/calls-shared/call-item/call-item.component';
import {ArmBrigadeCallItemResolverService} from './services/resolvers/arm-brigade-call-item-resolver.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'АРМ Бригады',
    },
    children: [
      {
        path: '',
        component: ArmBrigadeComponent,
        data: {
          title: null,
        },
      },
      {
        path: 'calls',
        data: {
          title: null
        },
        children: [
          {
            path: ':callId',
            resolve: {
              callItem: ArmBrigadeCallItemResolverService
            },
            data: {
              title: 'Вызов'
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

export class ArmBrigadeRoutingModule{

}
