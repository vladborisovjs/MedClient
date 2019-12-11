import {Component, Input, OnInit} from '@angular/core';
import {BagNewBean, TherapyBean, TherapyItemBean} from '../../../../../swagger/med-api.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CardItemService} from '../../services/card-item.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef} from 'ag-grid-community';
import {NotificationsService} from 'angular2-notifications';
import {DrugOperationService} from '../../../drugstore2/services/drug-operation.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-modal-card-result-therapy2',
  templateUrl: './modal-card-result-therapy-with-bag.component.html',
  styleUrls: ['./modal-card-result-therapy-with-bag.component.scss']
})
export class ModalCardResultTherapyWithBagComponent implements OnInit {
  @Input() therapy: TherapyBean;
  loading: boolean = false;
  bag: {id: any, name: string  }[] = [];
  bagDrugList: {id: any, name: string  }[] = [];
  bagWareList: {id: any, name: string  }[] = [];
  bagTypeList = [
    {name: 'Лекарственный препарат', id: 0},
    {name: 'Медицинское изделие', id: 1}
    ] ;
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
  //newItem: boolean ;
  bagItem: BagNewBean;
  drugForm: FormGroup;
  wareForm: FormGroup;
  typeForm = new FormGroup({
      typeForm: new FormControl()
    }
  );
  mode: number;
  drugDescription: ISimpleDescription[] = [
    {
      label: 'Добавить лекарственный препарат',
      key: 'drugFK',
      type: 'select',
      selectList: this.bagDrugList,
      required: true,
      styleClass: 'col-10'
    },
    {
      label: 'Кол-во',
      key: 'volume',
      type: 'number',
      pattern: '^[1-9][0-9]*',
      required: true,
      styleClass: 'col-2'
    },
  ];
  wareDescription: ISimpleDescription[] = [
    {
      label: 'Добавить медицинское изделие',
      key: 'wareFK',
      type: 'select',
      selectList: this.bagWareList,
      required: true,
      styleClass: 'col-10'
    },
    {
      label: 'Кол-во',
      key: 'volume',
      type: 'number',
      pattern: '^[1-9][0-9]*',
      required: true,
      styleClass: 'col-2'
    },
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
              private ns: NotificationsService,
              private dr: DrugOperationService,
              private cas: CardItemService) {
  }

  ngOnInit() {
    this.loading = true;
    this.cas.getBags().pipe(tap(() => this.loading = false)).subscribe(
       sl => {this.bag.push(...sl); console.log(this.bag);this.getBag(); }
    );

    this.form = this.sds.makeForm(this.descriptions);
    this.drugForm = this.sds.makeForm(this.drugDescription);
    this.wareForm = this.sds.makeForm(this.wareDescription);
    this.typeForm.valueChanges.subscribe(
      el => {
        this.mode = el.typeForm;
        console.log(el);
      }
    );
    if (this.therapy){
      this.form.reset(this.therapy)
    } else {
      this.therapy = TherapyBean.fromJS({id: 0, therapyItemList: []});
      //this.newItem = true;
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
    addingDrug.isWriteDown = true;
    addingDrug.bagName = this.bag[0].name;
    this.bagItem.drugsInBagBeanFK.forEach(
      el => {
        if (addingDrug.drugFK === el.drugId) {
          addingDrug.drugFK = el.drugFK;
        }
      }
    );
    console.log(addingDrug);
    this.rechargeBag(addingDrug);
    this.therapy.therapyItemList.push(TherapyItemBean.fromJS({id: 0, therapyId: this.therapy.id, isDeleted: false, count: addingDrug.volume, drugFK: addingDrug.drugFK}));
    this.drugForm.reset();
  }

  addWare(){
    let addingWare = this.wareForm.getRawValue();
    addingWare.isWriteDown = true;
    addingWare.bagName = this.bag[0].name;
    this.bagItem.waresInBagBeanFK.forEach(
      el => {
        if (addingWare.wareFK === el.wareId) {
          addingWare.wareFK = el.wareFK;
        }
      }
    );
    console.log(addingWare);
    this.rechargeBag(addingWare);
    this.therapy.therapyItemList.push(TherapyItemBean.fromJS({id: 0, therapyId: this.therapy.id, isDeleted: false, count: addingWare.volume, wareFK: addingWare.wareFK}));
    this.wareForm.reset();
  }

  getBag() {
    console.log(this.bag);
    if (this.bag.length) {
      this.cas.getBag(this.bag[0].id).subscribe(
        el => {
          console.log(el);
          this.bagItem = el;
          console.log(this.bagItem);
          el.drugsInBagBeanFK.forEach(
            drugs => {
              if (drugs) {
                this.bagDrugList.push(
                  {
                    id: drugs.drugFK ? drugs.drugFK.id : undefined,
                    name: drugs.drugFK ?  drugs.drugFK.name : undefined
                  });
                console.log(this.bagDrugList);
              }
            }
          );
          el.waresInBagBeanFK.forEach(
            wares => {
              if (wares) {
                this.bagWareList.push(
                  {
                    id: wares.wareFK ? wares.wareFK.id : undefined,
                    name: wares.wareFK ? wares.wareFK.name : undefined,
                  });
              }
            }
          );
        }
      );
    }

  }

  rechargeBag(selectedDrug) {
    this.dr.rechargeBag(selectedDrug).subscribe(
      charge => {
        this.ns.success('Успешно', 'Лекарство списано')
      },
      error => {
        this.ns.error('Ошибка', 'Не удалось пополнить укладку')
      }
    );
  }
}
