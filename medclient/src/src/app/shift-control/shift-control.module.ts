import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftControlRoutingModule } from './shift-control-routing.module';
import { ShiftControlComponent } from './components/shift-control/shift-control.component';
import {NavigationModule} from "../navigation/navigation.module";
import {SimpleControlModule} from "../shared/simple-control/simple-control.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {GridTableModule} from "../shared/grid-table/grid-table.module";
import {ModalModule} from "../shared/modal/modal.module";
import {DictionariesModule} from "../dictionaries/dictionaries.module";
import {ShiftControlSharedModule} from "./shift-control-shared/shift-control-shared.module";

@NgModule({
  declarations: [ShiftControlComponent],
  imports: [
    CommonModule,
    ShiftControlRoutingModule,
    NavigationModule,
    SimpleControlModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    GridTableModule,
    ModalModule,
    DictionariesModule,
    ShiftControlSharedModule
  ]
})
export class ShiftControlModule { }
