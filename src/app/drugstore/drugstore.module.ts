import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugstoreComponent } from './components/drugstore/drugstore.component';
import {DrugstoreRoutingModule} from './drugstore-routing.module';

@NgModule({
  declarations: [DrugstoreComponent],
  imports: [
    CommonModule,
    DrugstoreRoutingModule
  ]
})
export class DrugstoreModule { }
