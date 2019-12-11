import {Injectable} from '@angular/core';
import {BagNewBean, MedApi} from '../../../../swagger/med-api.service';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {IGridTableDataSource} from '../../shared/grid-table/components/grid-table/grid-table.component';

@Injectable({
  providedIn: 'root'
})
export class DrugstoreBagService {
  bagSubject: BehaviorSubject<BagNewBean> = new BehaviorSubject<BagNewBean>(null);
  bagTemplateSubject: BehaviorSubject<BagNewBean> = new BehaviorSubject<BagNewBean>(null);
  drugBagsDataSource: IGridTableDataSource;
  drugBagTemplatesDataSource: IGridTableDataSource;

  constructor(private api: MedApi) {
    this.updateDrugBagsSource();
    this.updateDrugBagTemplatesSource();
  }


  updateDrugBagsSource() {
    this.drugBagsDataSource = {
      get: (filter, offset, count) => {
        return this.api.listBagsUsingGET(offset, count, false);
      }
    };
  }

  updateDrugBagTemplatesSource() {
    this.drugBagTemplatesDataSource = {
      get: (filter, offset, count) => {
        return this.api.listTmpUsingGET(offset, count, false);
      }
    };
  }

  selectBag(bag: BagNewBean) {
    console.log(bag);
    this.bagSubject.next(bag);
  }

  selectBagTemplate(bag: BagNewBean) {
    console.log(bag);
    this.bagTemplateSubject.next(bag);
  }

  saveBag(bag: BagNewBean) {
    bag = BagNewBean.fromJS(bag);
    return this.api.updateBagNewUsingPOST(bag).pipe(
      tap(
        _bag => {
          this.bagSubject.next(_bag);
          this.updateDrugBagsSource();
        }
      )
    );
  }

  deleteBag(bagId){
    return this.api.deleteTmpBagUsingDELETE(bagId).pipe(tap(
      ()=>{
        this.bagSubject.next(null);
        this.updateDrugBagsSource();
      }
    ))
  }

  getAllDrugs(offset, count){
    return this.api.getDrugNewListUsingGET(
      offset,
      count,
      false,
    );
  }

  getAllWares(offset, count){
    return this.api.listWareUsingGET(
      offset,
      count,
      false,
    );
  }

  getAllOthers(offset, count){
    return this.api.listOtherUsingGET(
      offset,
      count,
      false,
    );
  }


}
