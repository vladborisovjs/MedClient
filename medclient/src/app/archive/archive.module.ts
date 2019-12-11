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
import { PatientsArchiveComponent } from './components/patients-archive/patients-archive.component';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import { PatientInfoComponent } from './components/patient-info/patient-info.component';
import {ModalModule} from '../shared/modal/modal.module';
import {ModalMkb10DiagnosisModule} from '../shared/modal-mkb10-diagnosis/modal-mkb10-diagnosis.module';

@NgModule({
  declarations: [ArchiveComponent, CallsArchiveComponent, F110ArchiveComponent, PatientsArchiveComponent, PatientInfoComponent],
  imports: [
    CommonModule,
    ModalModule,
    ArchiveRoutingModule,
    NavigationModule,
    GridTableModule,
    ReactiveFormsModule,
    SimpleControlModule,
    LightResizerModule,
    ModalMkb10DiagnosisModule
  ]
})
export class ArchiveModule { }
