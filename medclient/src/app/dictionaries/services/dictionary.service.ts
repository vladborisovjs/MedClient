import {Injectable} from '@angular/core';
import {getDictInfo} from '../models/dictionary-structure';
import {MedApi} from '../../../../swagger/med-api.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {UserService} from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  constructor(private api: MedApi, private user: UserService) {
  }

  // получение содержимого словаря
  getDictionaryInfo(name) {
    let dict = getDictInfo(name);
    let params = [];
    if (dict.paramsOrder && dict.paramsOrder.length > 0){
      dict.paramsOrder.forEach(
        param => {
          if (param === 'subId'){
            params.push(this.user.subdivisionId)
          } else {
            params.push(dict.params[param]);
          }
        }
      );
    }
    let met: Observable<any> = this.api[dict.method](...params);
    return met.pipe(map(
      res => {
        return { dict: dict, list: res };
      }
    ));
  }

  getDictionaryItem(dictName, itemId) {
    let dict = getDictInfo(dictName);
    if (itemId > 0) {
      let met: Observable<any> = this.api[dict.item.method](itemId);
      return met.pipe(map(
        res => {
          return { item: dict.item, content: res };
        }
      ));
    } else { // новый элемент
      return { item: dict.item, content: {id: 0} };
    }

  }


}
