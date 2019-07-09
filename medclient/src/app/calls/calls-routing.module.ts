import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CallsComponent} from './components/calls/calls.component';
import {CallItemComponent} from './components/call-item/call-item.component';
import {CallItemResolverService} from './services/resolvers/call-item-resolver.service';
import {F110Component} from './components/f110/f110.component';
import {CardSideOneComponent} from './components/card-side-one/card-side-one.component';
import {CardSideTwoComponent} from './components/card-side-two/card-side-two.component';
import {CardResultComponent} from './components/card-result/card-result.component';
import {CardProtocolComponent} from './components/card-protocol/card-protocol.component';
import {CardItemResolverService} from './services/resolvers/card-item-resolver.service';
import {CardSideOnePatientComponent} from './components/card-side-one-patient/card-side-one-patient.component';
import {CardAnamnesisComponent} from './components/card-anamnesis/card-anamnesis.component';
import {ModalAddTherapyComponent} from './components/modal-add-therapy/modal-add-therapy.component';
import {TherapyDto} from '../../../swagger/med-api.service';

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
            children: [
              {
                path: ':cardId',
                component: F110Component,
                data: {
                  title: 'Ф-100'
                },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'side-one',

                  },
                  {
                    path: 'side-one',
                    resolve: {
                      cardInfo: CardItemResolverService
                    },
                    data: {
                      title: 'Первая сторона'
                    },
                    children: [
                      {
                        path: '',
                        component: CardSideOneComponent,
                        data: {
                          title: null
                        },
                      },

                      {
                        path: 'patient',
                        component: CardSideOnePatientComponent,
                        data: {
                          title: 'Пациент'
                        },
                        resolve: {
                          patient: CardItemResolverService
                        }
                      }
                    ],
                  },
                  {
                    path: 'side-two',

                    component: CardSideTwoComponent,
                    resolve:
                      {
                        cardInfo: CardItemResolverService
                      },
                    data: {
                      title: 'Объективные данные'
                    },
                  },
                  {
                    path: 'anamnesis',

                    component: CardAnamnesisComponent,
                    resolve:
                      {
                        anamnesis: CardItemResolverService
                      },
                    data: {
                      title: 'Анамнез'
                    },
                  },
                  {
                    path: 'result',
                    component: CardResultComponent,
                    resolve:
                      {
                        cardResult: CardItemResolverService
                      },
                    data: {
                      title: 'Результат'
                    },
                  },
                  {
                    path: 'protocol',
                    component: CardProtocolComponent,
                    resolve:
                      {
                        protocolList: CardItemResolverService
                      },
                    data: {
                      title: 'Протокол'
                    },
                  }
                ]
              }
            ]
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
