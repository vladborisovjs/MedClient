import {Component, Input, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {DrugstoreBagService} from '../../services/drugstore-bag.service';
import {FormGroup} from '@angular/forms';
import {DrugOperationService} from '../../services/drug-operation.service';
import {NotificationsService} from 'angular2-notifications';
import {OperationBean} from '../../../../../swagger/med-api.service';

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
  selectedItem: any;
  dataDrugs: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.ds.getAllDrugs(offset, count);
    }
  };
  dataWares: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.ds.getAllWares(offset, count);
    }
  };
  dataOthers: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.ds.getAllOthers(offset, count);
    }
  };
  filter = {};
  addCountItem: number;
  writeOff: OperationBean;

  constructor(private modalInstance: NgbActiveModal,
              private sds: SimpleDescriptionService,
              private ns: NotificationsService,
              private dr: DrugOperationService,
              private ds: DrugstoreBagService) {
  }

  ngOnInit() {
    this.formDrugs = this.sds.makeForm(this.description);
    this.writeOff = new OperationBean();
    console.log(this.writeOff);
    this.formDrugs.valueChanges.subscribe(
      ch => {
        this.filter = ch;
      }
    );
  }

  selectItemFromTable(e) {
    console.log(e.data);
    this.selectedItem = e.data;
    this.addCountItem = this.addCountItem ? this.addCountItem : 1;
    if (this.mode === 'drugs') {
      this.writeOff.drugFK = e.data;
      this.writeOff.drugId = e.data.id;
    } else if (this.mode === 'wares') {
      this.writeOff.wareFK = e.data;
      this.writeOff.wareId = e.data.id;
    } else if (this.mode === 'other') {
      this.writeOff.otherFK = e.data;
      this.writeOff.otherId = e.data.id;
    }
  }

  addItemFromTable() {
    this.writeOff.volume = this.addCountItem;
    this.writeOff.bagName = this.bagName;
    this.writeOff.isWriteDown = false;
    // this.writeOff.wareId = this.writeOff.wareFK.id;
    console.log(this.writeOff);
    this.rechargeBag(this.writeOff);
    this.modalInstance.close(this.writeOff);
  }

  back(){
    this.modalInstance.dismiss();
  }

  rechargeBag(selectedDrug) {
    selectedDrug = OperationBean.fromJS(selectedDrug);
    this.dr.rechargeBag(selectedDrug).subscribe(
      charge => {
        this.ns.success('Успешно', 'Укладка пополнена')
      },
      error => {
        this.ns.error('Ошибка', 'Не удалось пополнить укладку')
      }
    );
  }
}
