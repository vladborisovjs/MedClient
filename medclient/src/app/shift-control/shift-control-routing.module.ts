import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShiftControlComponent} from './components/shift-control/shift-control.component';
import {ShiftTableComponent} from "./shift-control-shared/components/shift-table/shift-table.component";
import {ShiftTableBrigadeComponent} from "./shift-control-shared/components/shift-table-brigade/shift-table-brigade.component";
import {DictionaryInfoComponent} from "../dictionaries/components/dictionary-info/dictionary-info.component";
import {DictionaryItemComponent} from "../dictionaries/components/dictionary-item/dictionary-item.component";
import {BrigadeEditItemResolverService} from "./shift-control-shared/services/resolvers/brigade-edit-item-resolver.service";
import {BrigadeEditListResolverService} from "./shift-control-shared/services/resolvers/brigade-edit-list-resolver.service";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Управление персоналом СМП',
    },
    children: [
      {
        path: '',
        component: ShiftControlComponent,
        data: {
          title: null,
        },
      },
      {
        path: 'performers',
        component: ShiftTableComponent,
        data: {
          title: 'Смены сотрудников'
        }
      },
      {
        path: 'brigades',
        component: ShiftTableBrigadeComponent,
        data: {
          title: 'Смены бригад'
        }
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
              dict: BrigadeEditListResolverService
            }
          },
          {
            path: ':dictItem',
            component: DictionaryItemComponent,
            data: {
              title: 'Бригада',
            },
            resolve: {
              itemWithContent: BrigadeEditItemResolverService
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
export class ShiftControlRoutingModule {
}
