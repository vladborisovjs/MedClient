import { Component, OnInit } from '@angular/core';
import {getListOfDictionaries, IDictionaryInfo} from '../../models/dictionary-structure';

@Component({
  selector: 'app-dictionaries',
  templateUrl: './dictionaries.component.html',
  styleUrls: ['./dictionaries.component.scss']
})
export class DictionariesComponent implements OnInit {
commonList: IDictionaryInfo[];
typeList: IDictionaryInfo[];
callsList: IDictionaryInfo[];
drugList: IDictionaryInfo[];
  constructor() { }

  ngOnInit() {
    this.commonList = getListOfDictionaries('common');
    this.typeList = getListOfDictionaries('types');
    this.callsList = getListOfDictionaries('calls');
    this.drugList = getListOfDictionaries('drugs');
  }

}
