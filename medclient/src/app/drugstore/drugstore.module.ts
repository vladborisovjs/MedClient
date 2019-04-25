import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugstoreComponent } from './components/drugstore/drugstore.component';
import {DrugstoreRoutingModule} from './drugstore-routing.module';
import { MonitoringDrugstoreComponent } from './components/monitoring-drugstore/monitoring-drugstore.component';
import { ManagingDrugstoreComponent } from './components/managing-drugstore/managing-drugstore.component';
import { EditionDrugstoreComponent } from './components/edition-drugstore/edition-drugstore.component';
import {NavigationModule} from '../navigation/navigation.module';

@NgModule({
  declarations: [DrugstoreComponent, MonitoringDrugstoreComponent, ManagingDrugstoreComponent, EditionDrugstoreComponent],
  imports: [
    CommonModule,
    DrugstoreRoutingModule,
    NavigationModule
  ]
})
export class DrugstoreModule { }
