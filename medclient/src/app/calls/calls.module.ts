import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsComponent } from './components/calls/calls.component';
import { CallsRoutingModule } from './calls-routing.module';
import {MatExpansionModule} from '@angular/material';

@NgModule({
  declarations: [CallsComponent],
  imports: [
    CommonModule,
    CallsRoutingModule,
    MatExpansionModule
  ]
})
export class CallsModule { }
