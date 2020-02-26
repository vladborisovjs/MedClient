import {BrowserModule} from '@angular/platform-browser';
import {InjectionToken, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {API_BASE_URL, MedApi} from '../../swagger/med-api.service';
import {environment} from '../environments/environment';
import {APP_BASE_HREF, registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {AuthInceptor} from './services/auth-inceptor';
import {UserService} from './services/user.service';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CheckConditionService} from "./shared/services/check-condition.service";
import {HotkeyModule} from 'angular2-hotkeys';
import {SocketTopicModule} from "./shared/socket-topic/socket-topic.module";


const LOCATION_REF = new InjectionToken('LOCATION_REF');
registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SimpleNotificationsModule.forRoot(),
    HotkeyModule.forRoot(),
    SocketTopicModule,

  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    },
    {
      provide: LOCATION_REF,
      useValue: window.location
    },
    {
      provide: API_BASE_URL,
      useFactory: (locationRef: Location) => {
        const path = `${locationRef.protocol}//${locationRef.host}${locationRef.pathname}${environment.apiUrl}`;
        return path.slice(0, -1); // удаляем последний слэш
        // return 'http://212.176.197.29:51309/tcmk'; // for tablet
      },
      deps: [LOCATION_REF]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInceptor,
      multi: true
    },
    UserService,
    MedApi,
    NgbActiveModal,
    CheckConditionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
