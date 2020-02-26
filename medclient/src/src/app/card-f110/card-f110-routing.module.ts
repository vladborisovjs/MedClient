import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CardItemResolverService} from './services/resolvers/card-item-resolver.service';
import {F110Component} from './components/f110/f110.component';
import {CardSideOneComponent} from './components/card-side-one/card-side-one.component';
import {CardSideOnePatientComponent} from './components/card-side-one-patient/card-side-one-patient.component';
import {CardSideTwoComponent} from './components/card-side-two/card-side-two.component';
import {CardAnamnesisComponent} from './components/card-anamnesis/card-anamnesis.component';
import {CardResultComponent} from './components/card-result/card-result.component';

const routes: Routes = [

  {
    path: ':cardId',
    component: F110Component,
    data: {
      title: 'Ф-110'
    },
    resolve: {
      card: CardItemResolverService
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'side-one',
      },
      {
        path: 'side-one',
        data: {
          title: 'Первая сторона'
        },
        component: CardSideOneComponent,
      },
      {
        path: 'patient',
        component: CardSideOnePatientComponent,
        data: {
          title: 'Пациент'
        },
      },
      {
        path: 'side-two',
        component: CardSideTwoComponent,
        data: {
          title: 'Объективные данные'
        },
      },
      {
        path: 'anamnesis',

        component: CardAnamnesisComponent,
        data: {
          title: 'Анамнез'
        },
      },
      {
        path: 'result',
        component: CardResultComponent,
        data: {
          title: 'Результат'
        },
      },
      // {
      //   path: 'protocol',
      //   component: CardProtocolComponent,
      //   resolve:
      //     {
      //       protocolList: CardItemResolverService
      //     },
      //   data: {
      //     title: 'Протокол'
      //   },
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardF110RoutingModule { }
