import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DictionariesComponent} from './components/dictionaries/dictionaries.component';
import {DictionaryInfoComponent} from './components/dictionary-info/dictionary-info.component';
import {DictionaryItemComponent} from './components/dictionary-item/dictionary-item.component';
import {DictionaryInfoResolverService} from './services/resolvers/dictionary-info-resolver.service';
import {DictionaryItemResolverService} from './services/resolvers/dictionary-item-resolver.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ведение НСИ',
    },
    children: [
      {
        path: '',
        component: DictionariesComponent,
        data: {
          title: null
        },
        children: [

        ]
      },
      {
        path: ':dictName',
        data: {
          title: 'Справочник',
        },
        children: [
          {
            path: '',
            component: DictionaryInfoComponent,
            data: {
              title: null,
            },
            resolve: {
              dict: DictionaryInfoResolverService
            }
          },
          {
            path: ':dictItem',
            component: DictionaryItemComponent,
            data: {
              title: 'Элемент справочника',
            },
            resolve: {
              itemWithContent: DictionaryItemResolverService
            }
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
export class DictionariesRoutingModule {
}
