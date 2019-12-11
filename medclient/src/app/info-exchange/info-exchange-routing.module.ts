import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfoExchangeComponent} from './components/info-exchange/info-exchange.component';
import {EgiszComponent} from './components/egisz/egisz.component';
import {EmergencyCallSystemComponent} from './components/emergency-call-system/emergency-call-system.component';
import {InfoExchangeResolverService} from './services/resolvers/info-exchange-resolver.service';
import {XmlDocPatientComponent} from './components/xml-doc-patient/xml-doc-patient.component';
import {XmlDocCaseComponent} from './components/xml-doc-case/xml-doc-case.component';
import {XmlDocUkioComponent} from './components/xml-doc-ukio/xml-doc-ukio.component';
import {UkioResolverService} from './services/resolvers/ukio-resolver.service';
import {UkioMessagesComponent} from './components/ukio-messages/ukio-messages.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Инфообмен',
    },
    children: [
      {
        path: '',
        component: InfoExchangeComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'egisz',
        component: EgiszComponent,
        data: {
          title: 'ЕГИСЗ'
        }
      },
      {
        path: 'mchs-112',
        component: EmergencyCallSystemComponent,
        data: {
          title: '112'
        }
      },
      {
        path: 'xmlPatient',
        data: {
          title: null
        },
        children: [
          {
            path: ':docId',
            resolve: {
              docItem: InfoExchangeResolverService
            },
            data: {
              title: 'Пациент'
            },
            children: [
              {
                path: '',
                component: XmlDocPatientComponent,
                data: {
                  title: null
                }
              }
            ]
          }
        ]
      },
      {
        path: 'xmlCase',
        data: {
          title: null
        },
        children: [
          {
            path: ':docId',
            resolve: {
              docItem: InfoExchangeResolverService
            },
            data: {
              title: 'Случай'
            },
            children: [
              {
                path: '',
                component: XmlDocCaseComponent,
                data: {
                  title: null
                }
              }
            ]
          }
        ]
      },
      {
        path: 'xmlUkio',
        data: {
          title: null
        },
        children: [
          {
            path: ':ukioId',
            resolve: {
              docItem: UkioResolverService
            },
            data: {
              title: 'Актуальное сообщение УКИО'
            },
            children: [
              {
                path: '',
                component: XmlDocUkioComponent,
                data: {
                  title: null
                }
              }
            ]
          }
        ]
      },
      {
        path: 'ukio-messages',
        data: {
          title: null
        },
        children: [
          {
            path: ':ukioId',
            resolve: {
              docItem: UkioResolverService
            },
            data: {
              title: 'Сообщения УКИО'
            },
            children: [
              {
                path: '',
                component: UkioMessagesComponent,
                data: {
                  title: null
                }
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
export class InfoExchangeRoutingModule { }
