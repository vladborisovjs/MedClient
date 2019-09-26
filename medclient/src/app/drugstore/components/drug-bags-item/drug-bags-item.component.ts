import {Component, OnDestroy, OnInit} from '@angular/core';
import {DrugstoreService} from '../../services/drugstore.service';
import {BagBean, BagDrugBean, DrugBean} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {NotificationsService} from 'angular2-notifications';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddDrugToBagComponent} from '../modal-add-drug-to-bag/modal-add-drug-to-bag.component';
import {ModalAddDrugsFromTemplateComponent} from '../modal-add-drugs-from-template/modal-add-drugs-from-template.component';

@Component({
  selector: 'app-drug-bags-item',
  templateUrl: './drug-bags-item.component.html',
  styleUrls: ['./drug-bags-item.component.scss']
})
export class DrugBagsItemComponent implements OnInit, OnDestroy {
  bagItem: BagBean;
  sbscs: Subscription[] = [];
  descriptions: ISimpleDescription[] = [
    {
      label: 'Наименование:',
      key: 'name',
      type: 'text',
      styleClass: 'col-5',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Код',
      key: 'code',
      type: 'text',
      styleClass: 'col-3',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Бригада',
      key: 'brigadeFK',
      type: 'dict',
      dict: 'getBrigadeListUsingGET',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
  ];
  form: FormGroup;
  colDef: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'drugFK.name',
      width: 180
    },
    {
      headerName: 'Код',
      field: 'drugFK.code',
      width: 170
    },
    {
      headerName: 'Примечания',
      field: 'drugFK.additionally',
      width: 220
    },
    {
      headerName: 'Упаковки',
      field: 'drugFK.containerTypeFK.name',
      width: 120
    },
    {
      headerName: 'Кол-во',
      field: 'counter',
      width: 120
    },
    {
      headerName: 'Единицы',
      field: 'drugFK.measurementFK.name',
      width: 100
    },
  ];

  selectedDrug: DrugBean;

  constructor(private ds: DrugstoreService,
              private sds: SimpleDescriptionService,
              private ns: NotificationsService,
              private modal: NgbModal) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.sbscs.push(
      this.ds.bagSub.subscribe(bag => {
        this.bagItem = bag;
        this.form ? this.form.reset(this.bagItem ? this.bagItem: {}) : false;
      }),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(s => s.unsubscribe());
  }

  selectDrug(e){
    this.selectedDrug = e.data;
  }

  deleteDrug(){
    this.ds.deleteDrugFromBag()
  }

  addDrug2bag(){
    const addDrug = this.modal.open(ModalAddDrugToBagComponent, {size: 'lg'})
    addDrug.componentInstance.bagId = this.bagItem.id;
    addDrug.componentInstance.mode = 'bag';
    addDrug.result.then(
      (res) => {
        if (res){

          let _res: BagDrugBean[] = res.map(
            (el:DrugBean) => el = BagDrugBean.fromJS({drugFK: el, counter: el.amount})
          );
          // this.bagItem.bagDrugList.push(..._res);
          this.bagItem.bagDrugList  = [..._res];
          this.ns.success('Укладка обновлена');
        } else {
          this.ns.error('Ошибка', 'Не удалось добавить лекарство')
        }
      }
    );
  }

  addDrugsByTemplate(){
    const temp = this.modal.open(ModalAddDrugsFromTemplateComponent);
    temp.componentInstance.bagId = this.bagItem.id;
    temp.result.then(
      (res: BagDrugBean[]) => {
        if (res){
          !this.bagItem.bagDrugList  ? this.bagItem.bagDrugList  = [] : false;
          // this.bagItem.bagDrugList .push(...res);
          // this.bagItem.bagDrugList  = [...this.bagItem.bagDrugList ];
          let _res: BagDrugBean[] = res.map(
            (el:DrugBean) => el = BagDrugBean.fromJS({drugFK: el, counter: el.amount})
          );
          // this.bagItem.bagDrugList.push(..._res);
          this.bagItem.bagDrugList  = [..._res];
          this.ns.success('Укладка обновлена');
        } else {
          this.ns.error('Ошибка', 'Не удалось добавить лекарство')
        }
      }
    );
  }

  saveBagInfo(){
    this.ds.saveBag(Object.assign(this.bagItem, this.form.getRawValue())).subscribe(
      s => {
        this.bagItem = s;
        this.bagItem.bagDrugList = this.bagItem.bagDrugList ? this.bagItem.bagDrugList : [];
        this.ns.success('Укладка сохранена');
      },
      error1 => {
        this.ns.error('Ошибка сохранения')
      }
    );
  }

  deleteBag(){
    this.ds.deleteBag(this.bagItem.id).subscribe(
      s => {
        this.ns.success('Укладка удалена');
      },
      error1 => {
        this.ns.error('Ошибка удаления')
      }
    );
  }

  refill(){
    let filled: {drug: DrugBean, fill: number}[] = [];
    this.bagItem.bagDrugList.forEach(
      drug=> {
        if (drug.drugFK && drug.drugFK.amount && drug.counter > -1  ){
          filled.push({drug: drug.drugFK, fill: drug.drugFK.amount - drug.counter});
          drug.counter = drug.drugFK.amount;
        }
      }
    );
    this.ds.saveBag(Object.assign(this.bagItem, this.form.getRawValue())).subscribe(
      s => {
        this.bagItem = s;
        this.bagItem.bagDrugList = this.bagItem.bagDrugList ? this.bagItem.bagDrugList : [];
        let fillText = '';

        filled.forEach(
          f =>  fillText += `+ ${f.drug.name} - ${f.fill} ${f.drug.measurementFK.name} <br>`
        );
        this.ns.success('Укладка пополнена', fillText);
      },
      error1 => {
        this.ns.error('Ошибка сохранения')
      }
    );

  }

}
