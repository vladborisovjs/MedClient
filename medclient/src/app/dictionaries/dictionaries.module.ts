import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionariesComponent } from './components/dictionaries/dictionaries.component';
import {DictionariesRoutingModule} from './dictionaries-routing.module';
import { DictionaryInfoComponent } from './components/dictionary-info/dictionary-info.component';
import { DictionaryItemComponent } from './components/dictionary-item/dictionary-item.component';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TreeTableModule} from 'primeng/primeng';
import {ModalModule} from '../shared/modal/modal.module';
import {LogsModule} from '../shared/logs/logs.module';
import {BestMapModule} from '../shared/best-map/best-map.module';
import {MedPipesModule} from '../shared/med-pipes/med-pipes.module';

@NgModule({
  declarations: [DictionariesComponent, DictionaryInfoComponent, DictionaryItemComponent],
  imports: [
    CommonModule,
    DictionariesRoutingModule,
    GridTableModule,
    SimpleControlModule,
    FormsModule,
    ReactiveFormsModule,
    TreeTableModule,
    ModalModule,
    LogsModule,
    BestMapModule,
    MedPipesModule
  ]
})
export class DictionariesModule { }
