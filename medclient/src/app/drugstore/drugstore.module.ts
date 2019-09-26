import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DrugstoreComponent} from './components/drugstore/drugstore.component';
import {DrugstoreRoutingModule} from './drugstore-routing.module';
import {NavigationModule} from '../navigation/navigation.module';
import {DrugBagsComponent} from './components/drug-bags/drug-bags.component';
import {DrugBagTemplatesComponent} from './components/drug-bag-templates/drug-bag-templates.component';
import {DrugBagsListComponent} from './components/drug-bags-list/drug-bags-list.component';
import {DrugBagsItemComponent} from './components/drug-bags-item/drug-bags-item.component';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from '../shared/modal/modal.module';
import { ModalAddDrugToBagComponent } from './components/modal-add-drug-to-bag/modal-add-drug-to-bag.component';
import {FormsModule} from '@angular/forms';
import { DrugBagTemplatesItemComponent } from './components/drug-bag-templates-item/drug-bag-templates-item.component';
import { DrugBagTemplatesListComponent } from './components/drug-bag-templates-list/drug-bag-templates-list.component';
import { ModalAddDrugsFromTemplateComponent } from './components/modal-add-drugs-from-template/modal-add-drugs-from-template.component';

@NgModule({
  declarations: [
    DrugstoreComponent,
    DrugBagsComponent,
    DrugBagTemplatesComponent,
    DrugBagsListComponent,
    DrugBagsItemComponent,
    ModalAddDrugToBagComponent,
    DrugBagTemplatesItemComponent,
    DrugBagTemplatesListComponent,
    ModalAddDrugsFromTemplateComponent,
  ],
  imports: [
    CommonModule,
    DrugstoreRoutingModule,
    NavigationModule,
    LightResizerModule,
    GridTableModule,
    SimpleControlModule,
    NgbModule,
    ModalModule,
    FormsModule,
  ],
  entryComponents: [
    ModalAddDrugToBagComponent,
    ModalAddDrugsFromTemplateComponent
  ]
})
export class DrugstoreModule {
}
