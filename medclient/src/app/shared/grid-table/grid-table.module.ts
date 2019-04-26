import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridTableComponent } from './components/grid-table/grid-table.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [GridTableComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([])
  ],
  exports: [
    GridTableComponent
  ]
})
export class GridTableModule { }
