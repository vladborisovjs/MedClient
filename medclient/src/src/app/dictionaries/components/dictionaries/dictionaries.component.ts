import { Component, OnInit } from '@angular/core';
import {getListOfDictionaries, IDictionaryInfo} from '../../models/dictionary-structure';
import {interval, Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {debounce} from 'rxjs/operators';

@Component({
  selector: 'app-dictionaries',
  templateUrl: './dictionaries.component.html',
  styleUrls: ['./dictionaries.component.scss']
})
export class DictionariesComponent implements OnInit {
  commonList: IDictionaryInfo[];
  brigadesList: IDictionaryInfo[];
  callsList: IDictionaryInfo[];
  drugList: IDictionaryInfo[];
  objectivesList: IDictionaryInfo[]; // справочники объективных данных
  drugStoreList: IDictionaryInfo[];
  drugStoreList2: IDictionaryInfo[];
  filterParam: string = '';

  sbscs: Subscription[] = [];
  filtersForm: FormGroup = new FormGroup({});
  description: ISimpleDescription[] = [
    {
      key: 'dictFilter',
      type: 'text',
      placeholder: 'Справочник',
    }
  ];

  constructor(private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.filtersForm = this.sds.makeForm(this.description);
    this.sbscs.push(
      this.filtersForm.valueChanges.pipe(
        debounce(() => interval(300))
      ).subscribe(s => {
        this.filterParam = s.dictFilter;
        this.initializeDictionaries();
        console.log(this.filterParam);
      })
    );
    this.initializeDictionaries();
    console.log(this);
  }

  clearFilters() {
    this.filtersForm.reset();
  }

  initializeDictionaries() {
    this.commonList = getListOfDictionaries('common', this.filterParam);
    this.brigadesList = getListOfDictionaries('brigades', this.filterParam);
    this.callsList = getListOfDictionaries('calls', this.filterParam);
    this.drugList = getListOfDictionaries('drugs', this.filterParam);
    this.objectivesList = getListOfDictionaries('objectives', this.filterParam);
    this.drugStoreList = getListOfDictionaries('drugStore', this.filterParam);
    this.drugStoreList2 = getListOfDictionaries('drugStore2', this.filterParam);
  }

}
