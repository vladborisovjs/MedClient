import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AviationComponent} from './components/aviation/aviation.component';
import {AviaRequetsComponent} from './components/avia-requets/avia-requets.component';
import {DictionaryInfoComponent} from '../dictionaries/components/dictionary-info/dictionary-info.component';
import {DictionaryItemComponent} from '../dictionaries/components/dictionary-item/dictionary-item.component';
import {ShiftTableComponent} from "../shift-control/shift-control-shared/components/shift-table/shift-table.component";
import {ShiftTableBrigadeComponent} from "../shift-control/shift-control-shared/components/shift-table-brigade/shift-table-brigade.component";
import {AviaBrigadeEditListResolverService} from "../shift-control/shift-control-shared/services/resolvers/avia-brigade-edit-list-resolver.service";
import {AviaBrigadeEditItemResolverService} from "../shift-control/shift-control-shared/services/resolvers/avia-brigade-edit-item-resolver.service";

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
      },
      {
        path: 'employees',
        component: ShiftTableComponent,
        data: {
          title: 'Сотрудники',
        },
      },
      {
        path: 'brigades',
        component: ShiftTableBrigadeComponent,
        data: {
          title: 'Бригады',
        },
      },
      {
        path: 'brigades-control',
        data: {
          title: 'Список бригад',
        },
        children: [
          {
            path: '',
            component: DictionaryInfoComponent,
            data: {
              title: '',
            },
            resolve: {
              dict: AviaBrigadeEditListResolverService
            }
          },
          {
            path: ':dictItem',
            component: DictionaryItemComponent,
            data: {
              title: 'Бригада',
            },
            resolve: {
              itemWithContent: AviaBrigadeEditItemResolverService
            }
          }

        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AviationRoutingModule {
}
