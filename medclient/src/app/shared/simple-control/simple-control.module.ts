import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleControlComponent } from './components/simple-control/simple-control.component';
import { SimpleViewComponent } from './components/simple-view/simple-view.component';
import {CalendarModule} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SimpleFormsToolsService} from './services/simple-forms-tools.service';
import {NgSelectModule} from '@ng-select/ng-select';
import {SimpleDescriptionService} from './services/simple-description.service';

@NgModule({
  declarations: [ SimpleControlComponent, SimpleViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // DictionaryModule,
    CalendarModule,
    NgSelectModule
  ],
  providers: [
    SimpleDescriptionService,
    SimpleFormsToolsService
  ],
  exports: [
    SimpleControlComponent,
    SimpleViewComponent
  ]
})
export class SimpleControlModule { }
