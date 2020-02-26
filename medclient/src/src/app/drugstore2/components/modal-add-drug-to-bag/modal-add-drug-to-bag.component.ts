import {Component, Input, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef, GridApi} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {DrugstoreBagService} from '../../services/drugstore-bag.service';
import {FormGroup} from '@angular/forms';
import {DrugOperationService} from '../../services/drug-operation.service';
import {NotificationsService} from 'angular2-notifications';
import {OperationBean} from '../../../../../swagger/med-api.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-modal-add-drug-to-bag',
  templateUrl: './modal-add-drug-to-bag.component.html',
  styleUrls: ['./modal-add-drug-to-bag.component.scss']
})
export class ModalAddDrugToBagComponent implements OnInit {
  @Input() mode: string;
  @Input() bagId: number;
  @Input() bagName: string;
  description: ISimpleDescription[] = [
    {
      label: '',
      placeholder: 'наименование',
      key: 'name',
      type: 'text',
    },
  ];
  formDrugs: FormGroup;
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
  ];
  colDefWares: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
      width: 1000
    },
  ];
  colDefOthers: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
      width: 1000
    },
  ];
  selectedItems: any;
  dataDrugs: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.ds.getAllDrugsFromDict(offset, count);
    }
  };
  dataWares: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.ds.getAllWaresFromDict(offset, count);
    }
  };
  dataOthers: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.ds.getAllOtherFromDict(offset, count);
    }
  };
  filter = {};
  writeOff: any[] = [];
  grid: GridApi;
  constructor(private modalInstance: NgbActiveModal,
              private sds: SimpleDescriptionService,
              private ns: NotificationsService,
              private dr: DrugOperationService,
              private ds: DrugstoreBagService) {
  }

  ngOnInit() {
    this.formDrugs = this.sds.makeForm(this.description);
    console.log(this.writeOff);
    this.formDrugs.valueChanges.subscribe(
      ch => {
        this.filter = ch;
      }
    );
  }

  selectItemFromTable(e) {
    console.log(e);
    this.selectedItems = this.grid.getSelectedNodes()
      .map(ids => {return ids.data.id});
    if (this.mode === 'Drugs') {
      for (let i = 0; i < e.length; i++) {
        this.writeOff.push({bagName: this.bagName, isWriteDown: false, drugFK: e[i], drugId: e[i].id})
      }
    } else if (this.mode === 'Wares') {
      for (let i = 0; i < e.length; i++) {
        this.writeOff.push({bagName: this.bagName, isWriteDown: false, wareFK: e[i], wareId: e[i].id})
      }
    } else if (this.mode === 'Other') {
      for (let i = 0; i < e.length; i++) {
        this.writeOff.push({bagName: this.bagName, isWriteDown: false, otherFK: e[i], otherId: e[i].id})
      }
    }
  }

  addItemFromTable() {
    console.log(this.writeOff);
    this.rechargeBag(this.writeOff);
    this.modalInstance.close(this.selectedItems);
  }

  back(){
    this.modalInstance.dismiss();
  }

  fitCol(e) {
    this.grid = e.api;
    this.grid.sizeColumnsToFit();
  }

  rechargeBag(selectedDrug) {
    this.dr.fillBag(selectedDrug).pipe(take(1)).subscribe(
      charge => {
        this.ns.success('Успешно', 'Укладка пополнена')
      },
      error => {
        this.ns.error('Ошибка', 'Не удалось пополнить укладку')
      }
    );
  }
}
