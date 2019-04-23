import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsComponent } from './components/calls/calls.component';
import { CallsRoutingModule } from './calls-routing.module';

@NgModule({
  declarations: [CallsComponent],
  imports: [
    CommonModule,
    CallsRoutingModule
  ]
})
export class CallsModule { }
