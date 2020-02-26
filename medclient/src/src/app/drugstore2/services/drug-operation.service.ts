import {Injectable} from '@angular/core';
import {MedApi, OperationBean} from '../../../../swagger/med-api.service';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrugOperationService {


  constructor(private api: MedApi) {
  }

  rechargeBag(operationBean){
    return this.api.insertOperationUsingPOST(operationBean);
  }

  fillBag(operationBean) {
    return this.api.insertsOperationUsingPOST(operationBean)
  }

  getMovementsList(offset, count){
    return this.api.listOperationUsingGET(offset, count, false);
  }

}
