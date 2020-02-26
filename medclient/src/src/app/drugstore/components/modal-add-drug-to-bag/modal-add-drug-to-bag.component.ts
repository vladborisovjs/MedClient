import {Component, Input, OnInit} from '@angular/core';
import {BagDrugBean, DrugBean} from '../../../../../swagger/med-api.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {DrugstoreService} from '../../services/drugstore.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-modal-add-drug-to-bag',
  templateUrl: './modal-add-drug-to-bag.component.html',
  styleUrls: ['./modal-add-drug-to-bag.component.scss']
})
export class ModalAddDrugToBagComponent implements OnInit {
  descriptions: ISimpleDescription[] = [
    {
      label: '',
      placeholder: 'наименование',
      key: 'name',
      type: 'text',
    },
  ];
  form: FormGroup;
  @Input() bagId: number;
  @Input() mode: string; // 'bag' | 'template'

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
  source: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.ds.getAllDrugs(offset, count, filter);
    }
  };
  filter = {};

  addCount: number;
  selectedDrug: DrugBean;


  constructor(private modalInstance: NgbActiveModal,
              private sds: SimpleDescriptionService,
              private ds: DrugstoreService) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.form.valueChanges.subscribe(
      ch => {
        this.filter = ch;
      }
    );
  }

  selectDrug(e){
    this.addCount = this.addCount ? this.addCount : 1;
    this.selectedDrug = e.data;
  }

  addDrug(){
    let drugPack = [];
    for (let i = 0; i < this.addCount; i++){
      drugPack.push(DrugBean.fromJS(this.selectedDrug));
    }

    if (this.mode === 'bag'){
      this.ds.addDrugToBag(this.bagId, drugPack).subscribe(
        res => {
          console.log(res);
          this.modalInstance.close(res.list)
        },
        error1 => {
          this.modalInstance.close(false)
        }
      );
    }

    if (this.mode === 'template'){
      this.ds.addDrugToBagTemplate(this.bagId, drugPack).subscribe(
        res => {
          console.log(res);
          this.modalInstance.close(drugPack)
        },
        error1 => {
          this.modalInstance.close(false)
        }
      );
    }

  }

  back(){
    this.modalInstance.dismiss();
  }

}
