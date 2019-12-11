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
    return this.api.updateOperationUsingPOST(operationBean);
  }

  getMovementsList(offset, count){
    return this.api.listOperationUsingGET(offset, count, false);
  }

}
