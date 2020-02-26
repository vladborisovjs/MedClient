import {Component, OnDestroy, OnInit} from '@angular/core';
import {DrugstoreBagService} from '../../services/drugstore-bag.service';
import {BagNewBean} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ColDef, GridApi} from 'ag-grid-community';
import {NotificationsService} from 'angular2-notifications';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddDrugToBagComponent} from '../modal-add-drug-to-bag/modal-add-drug-to-bag.component';
import {ModalAddDrugsFromTemplateComponent} from '../modal-add-drugs-from-template/modal-add-drugs-from-template.component';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {take} from 'rxjs/operators';

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
      field: 'name',
      width: 250
    },
    {
      headerName: 'Лекарственная форма',
      field: 'drugFormBeanFK.name',
      width: 250
    },
    {
      headerName: 'Вид лекарственного препарата',
      field: 'drugTypeBeanFK.name',
      width: 250
    },
    {
      headerName: 'Единица измерения',
      field: 'drugUnitBeanFK.name',
      width: 250
    },
    {
      headerName: 'АТХ',
      field: 'athBeanFK.name',
      width: 250
    },
    // {
    //   headerName: 'Количество',
    //   field: 'volume',
    //   width: 250
    // }
  ];
  colDefWares: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
      width: 1000
    },
    // {
    //   headerName: 'Количество',
    //   field: 'volume',
    //   width: 250
    // }
  ];
  colDefOthers: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
      width: 1000
    },
    // {
    //   headerName: 'Количество',
    //   field: 'volume',
    //   width: 250
    // }
  ];
  selectedItems: any;
  modes = {
    DRUGS : 'Drugs',
    WARES : 'Wares',
    OTHER : 'Other'
  };
  mode = this.modes.DRUGS;
  dataSource: IGridTableDataSource;
  grid: GridApi;
  isUnlock: boolean;
  constructor(private ds: DrugstoreBagService,
              private sds: SimpleDescriptionService,
              private ns: NotificationsService,
              private cmodal: CustomModalService,
              private modal: NgbModal) {
  }

  ngOnInit() {
    this.formBag = this.sds.makeForm(this.descriptionBag);
    this.lockForm();
    this.sbscs.push(
      this.ds.bagSubject.subscribe(bag => {
        this.bagNewItem = bag;
        this.formBag ? this.formBag.reset(this.bagNewItem ? this.bagNewItem: {}) : false;
        this.updateDataSource();
      }),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(s => s.unsubscribe());
  }

  updateDataSource() {
      this.dataSource = {
        get: (filter, offset, count) => {
          return this.ds[`get${this.mode}`](this.bagNewItem.id, offset, count);
        }
      };
  }

  selectDrugFromTable(e){
    this.selectedItems = this.grid.getSelectedNodes()
      .map(ids => {return ids.data.id});
    console.log(this.selectedItems);
  }

  addItemToBag(mode: 'Drugs' | 'Wares' | 'Other') {
    const addItem = this.modal.open(ModalAddDrugToBagComponent, {size: 'lg'});
    addItem.componentInstance.bagId = this.bagNewItem.id;
    addItem.componentInstance.bagName = this.bagNewItem.name;
    addItem.componentInstance.mode = mode;
    addItem.result.then(
      res => {
          this.ds[`add${mode}ToBag`](this.bagNewItem.id, res).pipe(take(1)).subscribe(
            res => {
              if (res === true) {
                this.ns.success('Успешно', 'Запись добавлена');
                this.grid.refreshInfiniteCache();
              } else {
                this.ns.error('Ошибка', 'Запись не добавлена')
              }
            },
          );
      }
    );
  }

  deleteItemFromBag() {
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить?').then(
      del => {
          this.ds[`delete${this.mode}FromBag`](this.bagNewItem.id, this.selectedItems).pipe(take(1)).subscribe(
            res => {
              if (res === true) {
                this.ns.success('Успешно', 'Запись удалена');
                this.grid.deselectAll();
                this.grid.refreshInfiniteCache();
              } else {
                this.ns.error('Ошибка', 'Запись не удалена')
              }

            },
          );
      },
      () => {}
    );

  }
  addDrugsByTemplateFromTable(){
    const temp = this.modal.open(ModalAddDrugsFromTemplateComponent);
    temp.result.then(
      res => {
        if (res) {
          console.log(res);
          const mode = ['Drugs' , 'Wares' , 'Other'];
          for (let i = 0 ; i < res.length; i++) {
            if (res[i].length) {
                this.ds[`add${mode[i]}ToBag`](this.bagNewItem.id, res[i]).pipe(take(1)).subscribe(
                  (added) =>{
                    if (mode[i] === 'Drugs' && added) {
                      this.grid.refreshInfiniteCache();
                    }
                  }
                );
            }
          }
          this.ns.success('Укладка обновлена');
        } else {
          this.ns.error('Ошибка', 'Не удалось добавить лекарство')
        }
      }
    );

  }

  saveBag(){
    this.ds.saveBag(Object.assign(this.bagNewItem, this.formBag.getRawValue())).pipe(take(1)).subscribe(
      s => {
        this.lockForm();
        this.ns.success('Укладка сохранена');
      },
      error1 => {
        this.unlockForm();
        this.ns.error('Ошибка сохранения')
      }
    );
  }

  deleteBagFromTable(){
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить укладку?').then(
      res => {
        this.ds.deleteBag(this.bagNewItem.id).pipe(take(1)).subscribe(
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

  changeMode(mode) {
    console.log(mode);
    this.selectedItems = null;
    this.mode = mode;
    this.updateDataSource();
  }

  fitCol(e) {
    this.grid = e.api;
    this.grid.sizeColumnsToFit();
  }

  unlockForm() {
    this.isUnlock = true;
    this.formBag.enable();
  }

  lockForm() {
    this.isUnlock = false;
    this.formBag.disable();
  }
}
