import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

const routes: Routes = [
  {
    path: '',
    loadChildren: './main/main.module#MainModule',
    data: {
      title: 'Главная'
    },
    // canActivate: [AuthGuard],
    // resolve: {
    //   user: UserResolverService
    // }
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
    data: {
      title: 'Аутентификация'
    },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      enableTracing: false,
      onSameUrlNavigation: 'reload'
    }
  )],
  exports: [RouterModule],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ]
})
export class AppRoutingModule { }
