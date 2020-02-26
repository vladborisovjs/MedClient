import {Injectable} from '@angular/core';
import {BagNewBean, MedApi} from '../../../../swagger/med-api.service';
import {BehaviorSubject, of} from 'rxjs';
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
    return this.api.deleteBagUsingDELETE_1(bagId).pipe(tap(
      ()=>{
        this.bagSubject.next(null);
        this.updateDrugBagsSource();
      }
    ))
  }

  addDrugsToBag(bagId, ids) {
    return this.api.insertDrugsOfBagUsingGET(bagId, ids)
  }

  deleteDrugsFromBag(bagId, ids) {
    return this.api.deleteDrugOfBagUsingDELETE(bagId, ids);
  }

  getDrugs(bagId, offset, count){
    return this.api.getDrugsFromBagUsingGET(
      bagId,
      offset,
      count,
    );
  }

  getDrugsFromTemplate(templateId, offset?, count?) {
    return this.api.getDrugsFromTemplateUsingGET(
      templateId,
      offset ? offset : undefined,
      count ? count : undefined
    );
  }

  getAllDrugsFromDict(offset, count) {
    return this.api.getDrugNewListUsingGET(
      offset,
      count
    );
  }

  addWaresToBag(bagId, ids) {
    return this.api.insertWaresOfBagUsingGET(bagId, ids)
  }

  deleteWaresFromBag(bagId, ids) {
    return this.api.deleteWareOfBagUsingDELETE(bagId, ids);
  }

  getWares(bagId, offset, count){
    return this.api.getWaresFromBagUsingGET(
      bagId,
      offset,
      count,
    );
  }

  getWaresFromTemplate(templateId, offset?, count?) {
    return this.api.getWaresFromTemplateUsingGET(
      templateId,
      offset ? offset : undefined,
      count ? count : undefined
    );
  }

  getAllWaresFromDict(offset, count) {
    return this.api.listWareUsingGET(offset, count);
  }

  addOtherToBag(bagId, ids) {
    return this.api.insertOthersOfBagUsingGET(bagId, ids);
  }

  deleteOtherFromBag(bagId, ids) {
    return this.api.deleteOtherOfBagUsingDELETE(bagId, ids);
  }

  getOther(bagId, offset, count){
    return this.api.getOthersFromBagUsingGET(
      bagId,
      offset,
      count,
    );
  }

  getOtherFromTemplate(templateId, offset?, count?) {
    return this.api.getOthersFromTemplateUsingGET(
      templateId,
      offset ? offset : undefined,
      count ? count : undefined
    );
  }
   getAllOtherFromDict(offset,count) {
    return this.api.listOtherUsingGET(offset, count);
   }

}
