import { Component, OnInit } from '@angular/core';
import {BagBean, BagDrugBean, BagTemplateBean, DrugBean} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {ModalAddDrugToBagComponent} from '../modal-add-drug-to-bag/modal-add-drug-to-bag.component';
import {DrugstoreService} from '../../services/drugstore.service';
import {NotificationsService} from 'angular2-notifications';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-drug-bag-templates-item',
  templateUrl: './drug-bag-templates-item.component.html',
  styleUrls: ['./drug-bag-templates-item.component.scss']
})
export class DrugBagTemplatesItemComponent implements OnInit {
  bagTemplateItem: BagTemplateBean;
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
      label: 'Тип бригады',
      key: 'brigadeTypeFK',
      type: 'dict',
      dict: 'readBrigadeTypeListUsingGET',
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
      field: 'name',
      width: 180
    },
    {
      headerName: 'Код',
      field: 'code',
      width: 170
    },
    {
      headerName: 'Категория',
      field: 'drugFK.categoryFK.name',
      width: 250
    },
    {
      headerName: 'Вид',
      field: 'drugFK.groupFK.name',
      width: 250
    },
    {
      headerName: 'Примечания',
      field: 'additionally',
      width: 220
    },
    {
      headerName: 'Упаковки',
      field: 'containerTypeFK.name',
      width: 120
    },
    {
      headerName: 'Колличество',
      field: 'amount',
      width: 120
    },
    {
      headerName: 'Единицы',
      field: 'measurementFK.name',
      width: 100
    },

  ];

  selectedDrug: DrugBean;
  
  constructor(private ds: DrugstoreService,
              private sds: SimpleDescriptionService,
              private ns: NotificationsService,
              private modal: NgbModal) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.sbscs.push(
      this.ds.bagTemplateSub.subscribe(bag => {
        this.bagTemplateItem = bag;
        this.form ? this.form.reset(this.bagTemplateItem ? this.bagTemplateItem: {}) : false;
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

  addDrug2bagTemplate(){
    const addDrug = this.modal.open(ModalAddDrugToBagComponent, {size: 'lg'})
    addDrug.componentInstance.bagId = this.bagTemplateItem.id;
    addDrug.componentInstance.mode = 'template';
    addDrug.result.then(
      (res: DrugBean[]) => {
        if (res){
          console.log(res);
          this.bagTemplateItem.drugList .push(...res);
          this.bagTemplateItem.drugList   = [...this.bagTemplateItem.drugList  ];
          this.ns.success('Шаблон укладки обновлен');
        } else {
          this.ns.error('Ошибка', 'Не удалось добавить лекарство')
        }
      }
    );
  }


  saveBagTemplateInfo(){
    this.ds.saveBagTemplate(Object.assign(this.bagTemplateItem, this.form.getRawValue())).subscribe(
      s => {
        this.bagTemplateItem = s;
        this.bagTemplateItem.drugList  = this.bagTemplateItem.drugList  ? this.bagTemplateItem.drugList :[];
        this.ns.success('Шаблон укладки сохранен');
      },
      error1 => {
        this.ns.error('Ошибка сохранения')
      }
    );
  }

  deleteBag(){
    this.ds.deleteBagTemplate(this.bagTemplateItem.id).subscribe(
      s => {
        this.ns.success('Шаблон укладки удален');
      },
      error1 => {
        this.ns.error('Ошибка удаления')
      }
    );
  }

}
