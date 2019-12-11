import { Component, OnInit } from '@angular/core';
import {getListOfDictionaries, IDictionaryInfo} from '../../models/dictionary-structure';

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

  constructor() { }

  ngOnInit() {
    this.commonList = getListOfDictionaries('common');
    this.brigadesList = getListOfDictionaries('brigades');
    this.callsList = getListOfDictionaries('calls');
    this.drugList = getListOfDictionaries('drugs');
    this.objectivesList = getListOfDictionaries('objectives');
    this.drugStoreList = getListOfDictionaries('drugStore');
    this.drugStoreList2 = getListOfDictionaries('drugStore2');
  }

}
