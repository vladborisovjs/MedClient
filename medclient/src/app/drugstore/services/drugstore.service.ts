import {Injectable} from '@angular/core';
import {BagBean, BagTemplateBean, DrugBean, MedApi} from '../../../../swagger/med-api.service';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {IGridTableDataSource} from '../../shared/grid-table/components/grid-table/grid-table.component';

@Injectable({
  providedIn: 'root'
})
export class DrugstoreService {
  bagSub: BehaviorSubject<BagBean> = new BehaviorSubject<BagBean>(null);
  bagTemplateSub: BehaviorSubject<BagTemplateBean> = new BehaviorSubject<BagTemplateBean>(null);
  drugBagsSource: IGridTableDataSource;
  drugBagTemplatesSource: IGridTableDataSource;

  constructor(private api: MedApi) {
    this.updateDrugBagsSource();
    this.updateDrugBagTemplatesSource();
  }


  updateDrugBagsSource() {
    this.drugBagsSource = {
      get: (filter, offset, count) => {
        return this.api.getBagBeansUsingGET(offset, count, !!filter.deleted);
      }
    };
  }

  updateDrugBagTemplatesSource() {
    this.drugBagTemplatesSource = {
      get: (filter, offset, count) => {
        return this.api.getBagTemplatesUsingGET(offset, count, !!filter.deleted);
      }
    };
  }

  selectBag(bag: BagBean) {
    this.bagSub.next(bag);
  }

  selectBagTemplate(bag: BagTemplateBean) {
    console.log(bag);
    this.bagTemplateSub.next(bag);
  }

  saveBag(bag: BagBean) {
    bag = BagBean.fromJS(bag);
    return this.api.updateBagUsingPOST(bag).pipe(
      tap(
        _bag => {
          this.bagSub.next(_bag);
          this.updateDrugBagsSource();
        }
      )
    );
  }

  saveBagTemplate(bag: BagTemplateBean) {
    bag = BagTemplateBean.fromJS(bag);
    return this.api.updateTemplateBagUsingPOST(bag).pipe(
      tap(
        _bag => {
          this.bagSub.next(_bag);
          this.updateDrugBagTemplatesSource();
        }
      )
    );
  }

  deleteBag(bagId){
    return this.api.deleteBagUsingDELETE(bagId).pipe(tap(
      ()=>{
        this.bagSub.next(null);
        this.updateDrugBagsSource();
      }
    ))
  }

  deleteBagTemplate(bagId){
    return this.api.deleteTemplateBagUsingDELETE(bagId).pipe(tap(
      ()=>{
        this.bagTemplateSub.next(null);
        this.updateDrugBagTemplatesSource();
      }
    ))
  }

  getAllDrugs(offset, count, filter){
    return this.api.getDrugListUsingGET(
      offset,
      count,
      false,
      filter.containerType ? filter.containerType : undefined,
      undefined,
      filter.category ? filter.category : undefined,
      filter.group ? filter.group : undefined,
      filter.name ? filter.name : undefined,
    );
  }

  addDrugToBag(bagId ,drugPack: DrugBean[]){
    return this.api.updateDrugInBagUsingPOST(bagId, drugPack);
  }
  addDrugToBagTemplate(bagId ,drugPack: DrugBean[]){
    return this.api.updateDrugInTemplateBagUsingPOST(bagId, drugPack);
  }

  deleteDrugFromBag(){

  }

  deleteDrugFromBagTemplate(){
  }



}
