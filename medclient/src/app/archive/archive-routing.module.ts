import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ArchiveComponent} from './components/archive/archive.component';
import {CallsArchiveComponent} from './components/calls-archive/calls-archive.component';
import {F110ArchiveComponent} from './components/f110-archive/f110-archive.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Архив',
    },
    children: [
      {
        path: '',
        component: ArchiveComponent,
        data: {
          title: null,
        },
      },
      {
        path: 'calls',
        component: CallsArchiveComponent,
        data: {
          title: 'Вызовы',
        },
      },
      {
        path: 'f110',
        component: F110ArchiveComponent,
        data: {
          title: 'Карты Ф110',
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveRoutingModule {
}
