import {BrowserModule} from '@angular/platform-browser';
import {InjectionToken, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {API_BASE_URL, MedApi} from '../../swagger/med-api.service';
import {environment} from '../environments/environment';
import {APP_BASE_HREF} from '@angular/common';
import {AuthInceptor} from './services/auth-inceptor';
import {UserService} from './services/user.service';

const LOCATION_REF = new InjectionToken('LOCATION_REF');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,

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
        console.log('path', path);
        return path.slice(0, -1); // удаляем последний слэш
        // return 'http://172.16.6.166:8080/tcmk'; // todo: костыль, надо возвращать автоматически
      },
      deps: [LOCATION_REF]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInceptor,
      multi: true
    },
    MedApi,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
