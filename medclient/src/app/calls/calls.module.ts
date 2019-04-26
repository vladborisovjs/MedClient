import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsComponent } from './components/calls/calls.component';
import { CallsRoutingModule } from './calls-routing.module';
import {MatExpansionModule} from '@angular/material';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {AccordionModule} from 'primeng/primeng';

@NgModule({
  declarations: [CallsComponent],
  imports: [
    CommonModule,
    CallsRoutingModule,
    MatExpansionModule,
    GridTableModule,
    AccordionModule
  ]
})
export class CallsModule { }
