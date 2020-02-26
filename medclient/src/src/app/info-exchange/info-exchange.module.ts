import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationModule} from '../navigation/navigation.module';
import {FormsModule} from '@angular/forms';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {ModalModule} from '../shared/modal/modal.module';
import {InfoExchangeRoutingModule} from './info-exchange-routing.module';
import {InfoExchangeComponent} from './components/info-exchange/info-exchange.component';
import { EgiszComponent } from './components/egisz/egisz.component';
import { EmergencyCallSystemComponent } from './components/emergency-call-system/emergency-call-system.component';
import { XmlDocCaseComponent } from './components/xml-doc-case/xml-doc-case.component';
import {XmlDocPatientComponent} from './components/xml-doc-patient/xml-doc-patient.component';
import { XmlDocUkioComponent } from './components/xml-doc-ukio/xml-doc-ukio.component';
import { UkioMessagesComponent } from './components/ukio-messages/ukio-messages.component';
import {InfoPlateModule} from '../shared/info-plate/info-plate.module';
import {MedPipesModule} from '../shared/med-pipes/med-pipes.module';

@NgModule({
  declarations: [InfoExchangeComponent, EgiszComponent, EmergencyCallSystemComponent, XmlDocPatientComponent, XmlDocCaseComponent, XmlDocUkioComponent, UkioMessagesComponent],
  imports: [
    CommonModule,
    NavigationModule,
    LightResizerModule,
    GridTableModule,
    SimpleControlModule,
    InfoPlateModule,
    NgbModule,
    ModalModule,
    FormsModule,
    InfoExchangeRoutingModule,
    MedPipesModule
  ]
})
export class InfoExchangeModule { }
