import { Injectable } from '@angular/core';
import {MedApi} from '../../../../../swagger/med-api.service';

@Injectable({
  providedIn: 'root'
})
export class Mkb10DiagnosisService {

  constructor(private api: MedApi) { }

  getFullMkb10(nodeId) {
    return this.api.getMkbNodeNextLevelUsingGET(nodeId);
  }

  getListClassification(nameDisease, codeDisease) {
    return this.api.getFullClassMkbListUsingGET(0, 100, false, nameDisease, codeDisease);
  }
}
