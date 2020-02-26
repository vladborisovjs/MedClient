import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbsComponent} from './components/breadcrumbs/breadcrumbs.component';
import { CardMenuComponent } from './components/card-menu/card-menu.component';

@NgModule({
  declarations: [NavBarComponent, BreadcrumbsComponent, CardMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    NavBarComponent,
    BreadcrumbsComponent,
    CardMenuComponent
  ]
})
export class NavigationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NavigationModule,
    };
  }
}
