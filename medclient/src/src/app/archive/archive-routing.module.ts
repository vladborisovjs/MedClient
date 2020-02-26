import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ArchiveComponent} from './components/archive/archive.component';
import {CallsArchiveComponent} from './components/calls-archive/calls-archive.component';
import {F110ArchiveComponent} from './components/f110-archive/f110-archive.component';
import {PatientsArchiveComponent} from './components/patients-archive/patients-archive.component';
import {PatientInfoComponent} from './components/patient-info/patient-info.component';
import {PatientInfoResolverService} from './services/resolvers/patient-info-resolver.service';

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
      {
        path: 'patients',
        component: PatientsArchiveComponent,
        data: {
          title: 'Пациенты',
        },
        // children: [
        //   {
        //     path:'patient',
        //     data: {
        //       title: null
        //     },
        //     children: [
        //       {
        //         path: ':patId',
        //         resolve: {
        //           patItem: PatientInfoResolverService
        //         },
        //         data: {
        //           title: 'Пациент'
        //         },
        //         children: [
        //           {
        //             path: '',
        //             component: PatientInfoComponent,
        //             data: {
        //               title: null
        //             }
        //           }
        //         ]
        //       }
        //     ]
        //   }
        // ]
      },
      {
        path: 'patient',
        data: {
          title: null
        },
        children: [
          {
            path: ':patId',
            resolve: {
              patItem: PatientInfoResolverService
            },
            data: {
              title: 'Пациент'
            },
            children: [
              {
                path: '',
                component: PatientInfoComponent,
                data: {
                  title: null
                }
              }
            ]
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
export class ArchiveRoutingModule {
}
