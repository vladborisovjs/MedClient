import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './components/admin/admin.component';
import {AdminRoutingModule} from './admin-routing.module';
import {NavigationModule} from '../navigation/navigation.module';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import { AdminUsersListComponent } from './components/admin-users-list/admin-users-list.component';
import { AdminUsersItemComponent } from './components/admin-users-item/admin-users-item.component';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AdminComponent, AdminUsersComponent, AdminUsersListComponent, AdminUsersItemComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NavigationModule,
    LightResizerModule,
    GridTableModule,
    SimpleControlModule,
    HttpClientModule
  ]
})
export class AdminModule { }
