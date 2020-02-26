import {Injectable} from '@angular/core';
import {getDictInfo} from '../models/dictionary-structure';
import {MedApi} from '../../../../swagger/med-api.service';
import {map, take, takeUntil, tap} from 'rxjs/operators';
import {Observable, of, Subject, concat, merge} from 'rxjs';
import {UserService} from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})

export class DictionaryService {
  nodeParentId: number;
  childList: any[] = []; // для получения детей узлов древовидных справочников

  constructor(private api: MedApi, private user: UserService) {
  }

  // получение описания словаря (dict) и источника его содержимого (source)
  getDictionaryInfo(name) {
    return of(getDictInfo(name));
    // let dict = getDictInfo(name);
    // let params = [];
    // if (dict.paramsOrder && dict.paramsOrder.length > 0){
    //   dict.paramsOrder.forEach(
    //     param => {
    //       if (param === 'subId'){
    //         params.push(this.user.subdivisionId)
    //       } else {
    //         params.push(dict.params[param]);
    //       }
    //     }
    //   );
    // }
    // return of({dict: dict, source: this.api[dict.method](...params)});
  }

  getDictionaryItem(dictName, itemId) {
    const dict = getDictInfo(dictName);
    if (itemId > 0) {
      const met: Observable<any> = this.api[dict.item.method](itemId);
      return met.pipe(map(
        res => {
          // если есть endField возвращаем и его
          if (dict[`endField`]) {
            return {item: dict.item, content: res, endField: dict[`endField`]};
          } else {
            return {item: dict.item, content: res};
          }
        }
      ));
    } else { // новый элемент
      return {item: dict.item, content: {id: 0}};
    }
  }

  // getListClassification(nameDisease, codeDisease) {
  //   return this.api.getFullListUsingGET(0, 100, false, nameDisease, codeDisease);
  // }
}
