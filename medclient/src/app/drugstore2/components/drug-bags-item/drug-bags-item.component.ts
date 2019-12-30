import {Component, OnDestroy, OnInit} from '@angular/core';
import {DrugstoreBagService} from '../../services/drugstore-bag.service';
import {BagNewBean} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {NotificationsService} from 'angular2-notifications';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddDrugToBagComponent} from '../modal-add-drug-to-bag/modal-add-drug-to-bag.component';
import {ModalAddDrugsFromTemplateComponent} from '../modal-add-drugs-from-template/modal-add-drugs-from-template.component';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';

@Component({
  selector: 'app-drug-bags-item',
  templateUrl: './drug-bags-item.component.html',
  styleUrls: ['./drug-bags-item.component.scss']
})
export class DrugBagsItemComponent implements OnInit, OnDestroy {
  bagNewItem: BagNewBean;
  sbscs: Subscription[] = [];
  descriptionBag: ISimpleDescription[] = [
    {
      label: 'Наименование*',
      key: 'name',
      type: 'text',
      styleClass: 'col-6',
      required: true,
      errorText: "Обязательное",
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Бригада*',
      key: 'brigadeBeanFK',
      type: 'dict',
      dict: 'getBrigadeListUsingGET',
      styleClass: 'col-6',
      required: true,
      errorText: "Обязательное",
      additional: {
        block: 'general'
      }
    },
  ];
  formBag: FormGroup;
  colDefDrugs: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'drugFK.name',
      width: 250
    },
    {
      headerName: 'Лекарственная форма',
      field: 'drugFK.drugFormBeanFK.name',
      width: 250
    },
    {
      headerName: 'Вид лекарственного препарата',
      field: 'drugFK.drugTypeBeanFK.name',
      width: 250
    },
    {
      headerName: 'Единица измерения',
      field: 'drugFK.drugUnitBeanFK.name',
      width: 250
    },
    {
      headerName: 'АТХ',
      field: 'drugFK.athBeanFK.name',
      width: 250
    },
    {
      headerName: 'Количество',
      field: 'volume',
      width: 250
    }
  ];
  colDefWares: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'wareFK.name',
      width: 1000
    },
    {
      headerName: 'Количество',
      field: 'volume',
      width: 250
    }
  ];
  colDefOthers: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'otherFK.name',
      width: 1000
    },
    {
      headerName: 'Количество',
      field: 'volume',
      width: 250
    }
  ];
  selectedItem: any;
  modes = {
    DRUGS : 'DRUGS',
    WARES : 'WARES',
    OTHER : 'OTHER'
  };
  mode = this.modes.DRUGS;
  constructor(private ds: DrugstoreBagService,
              private sds: SimpleDescriptionService,
              private ns: NotificationsService,
              private cmodal: CustomModalService,
              private modal: NgbModal) {
  }

  ngOnInit() {
    this.formBag = this.sds.makeForm(this.descriptionBag);
    this.sbscs.push(
      this.ds.bagSubject.subscribe(bag => {
        this.bagNewItem = bag;
        this.formBag ? this.formBag.reset(this.bagNewItem ? this.bagNewItem: {}) : false;
      }),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(s => s.unsubscribe());
  }

  selectDrugFromTable(e){
    this.selectedItem = e.data;
    console.log(this.selectedItem);
  }

  addItemToBag(mode: 'drugs' | 'wares' | 'other') {
    const addItem = this.modal.open(ModalAddDrugToBagComponent, {size: 'lg'});
    addItem.componentInstance.bagId = this.bagNewItem.id;
    addItem.componentInstance.bagName = this.bagNewItem.name;
    addItem.componentInstance.mode = mode;
    addItem.result.then(
      res => {
        if (res.drugFK) {
          this.bagNewItem.drugsInBagBeanFK.push(res);
          this.bagNewItem.drugsInBagBeanFK = [...this.bagNewItem.drugsInBagBeanFK];
        }
        if (res.wareFK) {
          this.bagNewItem.waresInBagBeanFK.push(res);
          this.bagNewItem.waresInBagBeanFK = [...this.bagNewItem.waresInBagBeanFK];
        }
        if (res.otherFK) {
          this.bagNewItem.othersInBagBeanFK.push(res);
          this.bagNewItem.othersInBagBeanFK = [...this.bagNewItem.othersInBagBeanFK];
        }
      }
    );
  }

  addDrugsByTemplateFromTable(){
    const temp = this.modal.open(ModalAddDrugsFromTemplateComponent);
    temp.result.then(
      res => {
        if (res) {
          this.bagNewItem.drugsInBagBeanFK.push(...res.drugsInBagBeanFK);
          this.bagNewItem.waresInBagBeanFK.push(...res.waresInBagBeanFK);
          this.bagNewItem.othersInBagBeanFK.push(...res.othersInBagBeanFK);
          this.updateTables();
          console.log(this.bagNewItem);
          this.ns.success('Укладка обновлена');
        } else {
          this.ns.error('Ошибка', 'Не удалось добавить лекарство')
        }
      }
    );
  }

  saveBag(){
    this.ds.saveBag(Object.assign(this.bagNewItem, this.formBag.getRawValue())).subscribe(
      s => {
        this.ns.success('Укладка сохранена');
      },
      error1 => {
        this.ns.error('Ошибка сохранения')
      }
    );
  }

  deleteBagFromTable(){
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить укладку?').then(
      res => {
        this.ds.deleteBag(this.bagNewItem.id).subscribe(
          s => {
            this.ns.success('Укладка удалена');
          },
          error1 => {
            this.ns.error('Ошибка удаления')
          }
        );
      }
    );
  }

  deleteItemFromBag() {
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить запись из таблицы?').then(
      res => {
        if (this.selectedItem.drugFK) {
          console.log(this.selectedItem);
          this.bagNewItem.drugsInBagBeanFK.splice(this.bagNewItem.drugsInBagBeanFK.findIndex(val => val === this.selectedItem), 1);
          this.bagNewItem.drugsInBagBeanFK = [...this.bagNewItem.drugsInBagBeanFK];
        } else if (this.selectedItem.wareFK) {
          console.log(this.selectedItem);
          this.bagNewItem.waresInBagBeanFK.splice(this.bagNewItem.waresInBagBeanFK.findIndex(val => val === this.selectedItem), 1);
          this.bagNewItem.waresInBagBeanFK = [...this.bagNewItem.waresInBagBeanFK];
        } else if (this.selectedItem.otherFK) {
          console.log(this.selectedItem);
          this.bagNewItem.othersInBagBeanFK.splice(this.bagNewItem.othersInBagBeanFK.findIndex(val => val === this.selectedItem), 1);
          this.bagNewItem.othersInBagBeanFK = [...this.bagNewItem.othersInBagBeanFK];
        }
      }
    );
  }

  updateTables() {
    this.bagNewItem.drugsInBagBeanFK = [...this.bagNewItem.drugsInBagBeanFK];
    this.bagNewItem.waresInBagBeanFK = [...this.bagNewItem.waresInBagBeanFK];
    this.bagNewItem.othersInBagBeanFK = [...this.bagNewItem.othersInBagBeanFK];
  }

  clearBag() {
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить все записи в таблицах?').then(
      res => {
        this.bagNewItem.drugsInBagBeanFK = [];
        this.bagNewItem.waresInBagBeanFK = [];
        this.bagNewItem.othersInBagBeanFK = [];
        this.updateTables();
      }
    );
  }

  changeMode(mode) {
    console.log(mode);
    this.selectedItem = null;
    this.mode = mode;
  }
}
