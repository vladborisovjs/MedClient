import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './components/reports/reports.component';
import {ReportsRoutingModule} from './reports-routing.module';
import { ModalReportOptionsComponent } from './components/modal-report-options/modal-report-options.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SimpleControlModule} from "../shared/simple-control/simple-control.module";
import { ModalSubdivisionTreeComponent } from './components/modal-subdivision-tree/modal-subdivision-tree.component';
import {TreeTableModule} from 'primeng/primeng';

@NgModule({
  declarations: [ReportsComponent, ModalReportOptionsComponent, ModalSubdivisionTreeComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NgbModule,
    TreeTableModule,
    SimpleControlModule
  ],
  entryComponents: [
    ModalReportOptionsComponent,
    ModalSubdivisionTreeComponent
  ]
})
export class ReportsModule { }
