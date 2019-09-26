import {Component, Input, OnInit} from '@angular/core';
import {TherapyBean, TherapyItemBean} from '../../../../../swagger/med-api.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef} from 'ag-grid-community';
import {CardItemService} from '../../services/card-item.service';

@Component({
  selector: 'app-modal-card-result-therapy',
  templateUrl: './modal-card-result-therapy.component.html',
  styleUrls: ['./modal-card-result-therapy.component.scss']
})
export class ModalCardResultTherapyComponent implements OnInit {
  @Input() therapy: TherapyBean;

  bagDrugList: {id: any, name: string  }[] = [];
  descriptions: ISimpleDescription[] = [
    {
      label: 'Дата',
      key: 'date',
      type: 'date',
      required: true
    },
    {
      label: 'Описание',
      key: 'text',
      type: 'textarea',
      rows: 2,
      required: true
    },
  ];
  form: FormGroup;
  newItem: boolean ;

  drugForm: FormGroup;
  drugDescription: ISimpleDescription[] = [
    {
      label: 'Добавить медикамент',
      key: 'drugFK',
      type: 'select',
      selectList: this.bagDrugList,
      required: true,
      styleClass: 'col-10'
    },
    {
      label: 'Кол-во',
      key: 'count',
      type: 'number',
      pattern: '^[1-9]*',
      required: true,
      styleClass: 'col-2'
    }
  ];

  ColDef: ColDef[] = [
    {
      headerName: 'Медикамент',
      field: 'drugFK.name'
    },
    {
      headerName: 'Колличество',
      field: 'count'
    },
    {
      headerName: 'Единицы',
      field: 'measurementFK'
    }
  ];

  constructor(private sds: SimpleDescriptionService,
              private modalInstance: NgbActiveModal,
              private cas: CardItemService) {
  }

  ngOnInit() {
    this.cas.getBagDrugs().subscribe(
      sl => {this.bagDrugList.push(...sl); console.log(this.bagDrugList)}
    );
    console.log(this.therapy);
    this.form = this.sds.makeForm(this.descriptions);
    this.drugForm = this.sds.makeForm(this.drugDescription);
    if (this.therapy){
      this.form.reset(this.therapy)
    } else {
      this.therapy = TherapyBean.fromJS({id: 0, therapyItemList: []});
      this.newItem = true;
    }
  }

  submit() {
    Object.assign(this.therapy, this.form.getRawValue());
    console.log('save', this.therapy);
    this.modalInstance.close(this.therapy);
  }

  back() {
    this.modalInstance.dismiss();
  }

  addDrug(){
    let addingDrug = this.drugForm.getRawValue();
    this.therapy.therapyItemList.push(TherapyItemBean.fromJS({id: 0, therapyId: this.therapy.id, isDeleted: false, count: addingDrug.count, drugFK: addingDrug.drugFK}))
    this.drugForm.reset();
  }
}
