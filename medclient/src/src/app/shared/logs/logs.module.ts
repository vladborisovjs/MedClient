import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalLogComponent } from './modal-log/modal-log.component';
import {GridTableModule} from "../grid-table/grid-table.module";
import {LogService} from "./log.service";

@NgModule({
  declarations: [ModalLogComponent],
  imports: [
    CommonModule,
    GridTableModule
  ],
  entryComponents: [ModalLogComponent],
  exports: [ModalLogComponent],
  providers: [LogService]
})
export class LogsModule { }
