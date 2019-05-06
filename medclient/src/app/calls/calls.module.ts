import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsComponent } from './components/calls/calls.component';
import { CallsRoutingModule } from './calls-routing.module';
import {MatExpansionModule} from '@angular/material';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {AccordionModule} from 'primeng/primeng';
import { CallsListComponent } from './components/calls-list/calls-list.component';
import { BrigagesListComponent } from './components/brigages-list/brigages-list.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { CallItemComponent } from './components/call-item/call-item.component';
import {CallItemService} from './services/call-item.service';
import {CallsService} from './services/calls.service';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';

@NgModule({
  declarations: [CallsComponent, CallsListComponent, BrigagesListComponent, CallItemComponent],
  imports: [
    CommonModule,
    CallsRoutingModule,
    MatExpansionModule,
    GridTableModule,
    AccordionModule,
    HttpClientModule,
    SimpleControlModule
  ],
  providers: [
    CallsService,
    CallItemService,
    CallsRoutingModule
  ]
})
export class CallsModule { }
