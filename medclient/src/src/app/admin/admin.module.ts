import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminComponent} from './components/admin/admin.component';
import {AdminRoutingModule} from './admin-routing.module';
import {NavigationModule} from '../navigation/navigation.module';
import {AdminUsersComponent} from './components/admin-users/admin-users.component';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {AdminUsersListComponent} from './components/admin-users-list/admin-users-list.component';
import {AdminUsersItemComponent} from './components/admin-users-item/admin-users-item.component';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {OperatorInfoComponent} from './components/operator-info/operator-info.component';
import {LogsModule} from "../shared/logs/logs.module";
import {UserLogsComponent} from './components/user-logs/user-logs.component';

@NgModule({
  declarations: [AdminComponent, AdminUsersComponent, AdminUsersListComponent, AdminUsersItemComponent, OperatorInfoComponent, UserLogsComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NavigationModule,
    LightResizerModule,
    GridTableModule,
    SimpleControlModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    LogsModule,
  ]
})
export class AdminModule {
}
