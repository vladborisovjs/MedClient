import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchiveRoutingModule } from './archive-routing.module';
import {NavigationModule} from '../navigation/navigation.module';
import { ArchiveComponent } from './components/archive/archive.component';
import { CallsArchiveComponent } from './components/calls-archive/calls-archive.component';
import { F110ArchiveComponent } from './components/f110-archive/f110-archive.component';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';

@NgModule({
  declarations: [ArchiveComponent, CallsArchiveComponent, F110ArchiveComponent],
  imports: [
    CommonModule,
    ArchiveRoutingModule,
    NavigationModule,
    GridTableModule,
    ReactiveFormsModule,
    SimpleControlModule
  ]
})
export class ArchiveModule { }
