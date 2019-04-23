import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [NavBarComponent, BreadcrumbsComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    NavBarComponent,
    BreadcrumbsComponent
  ]
})
export class NavigationModule {
}
