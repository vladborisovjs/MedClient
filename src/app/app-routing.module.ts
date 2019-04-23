import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
  // {
  //   path: 'auth',
  //   loadChildren: './auth/auth.module#AuthModule',
  //   data: {
  //     title: 'Аутентификация'
  //   },
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
