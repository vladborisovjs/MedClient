import {Component, Input, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {MedApi, TherapyDto, TherapyItemDto} from '../../../../../swagger/med-api.service';
import {FormGroup} from '@angular/forms';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {NotificationsService} from 'angular2-notifications';
import {CardItemService} from '../../services/card-item.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddDrugsComponent} from '../modal-add-drugs/modal-add-drugs.component';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-modal-add-therapy',
  templateUrl: './modal-add-therapy.component.html',
  styleUrls: ['./modal-add-therapy.component.scss']
})
export class ModalAddTherapyComponent implements OnInit {
@Input() local: boolean;
sbscs: Subscription[] = [];
therapies: TherapyDto;
cardId: any;
colDefs: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'product_name',
      sortable: true,
      filter: true,
      width: 200
    },
    {
      headerName: 'Количество',
      field: 'count',
      sortable: true,
      filter: true,
      width: 500
    }
  ];
listSource: any[] = [];
form: FormGroup;
descriptionTherapy: ISimpleDescription[] = [
    {
      label: 'Время',
      key: 'date',
      type: 'date',
      styleClass: 'col-6',
    },
    {
      label: 'Описание',
      key: 'text',
      type: 'textarea',
      rows: 4,
    },
  ];
  constructor( private api: MedApi, private route: ActivatedRoute,
               private cas: CardItemService,
               private modal: NgbModal,
               private modalInstance: NgbActiveModal,
               private ns: NotificationsService,
               private sds: SimpleDescriptionService) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptionTherapy);
    // this.api.readAllUsingGET_16().subscribe(
    //   drugs => {
    //     console.log('->', drugs);
    //     this.listSource = drugs;
    //   }
    // );
    // this.route.parent.paramMap.subscribe(data => {
    //   this.cardId = data.get('cardId');
    // });
  }

  back() {
    this.modalInstance.dismiss();
  }

  save() {
    let therapies = {};
    console.log(this.form.getRawValue());
    Object.assign(therapies, this.form.getRawValue());
    this.cas.saveTherapy(therapies).subscribe(
    res => {
      this.ns.success('Успешно', 'Данные сохранены');
      this.back();
    },
    err => {
      this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
      console.log('Save Address', err);
    }
    );
    console.log('->>', therapies);
  }

  edit() {}
  delete() {}

  addDrugs() {
    const addDrugs = this.modal.open(ModalAddDrugsComponent);
    addDrugs.componentInstance.therapies = this.therapies;
  }


}
