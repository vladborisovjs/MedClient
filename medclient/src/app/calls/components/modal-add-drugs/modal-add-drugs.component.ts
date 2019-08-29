import { Component, OnInit } from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CardItemService} from '../../services/card-item.service';
import {NotificationsService} from 'angular2-notifications';
import {Inventory, TherapyItemDto} from '../../../../../swagger/med-api.service';

@Component({
  selector: 'app-modal-add-drugs',
  templateUrl: './modal-add-drugs.component.html',
  styleUrls: ['./modal-add-drugs.component.scss']
})
export class ModalAddDrugsComponent implements OnInit {
  form: FormGroup;
  drugs: TherapyItemDto;
  descriptionDrugs: ISimpleDescription[] = [
    {
      label: 'Наименование',
      key: 'name',
      type: 'dict',
      dictFilters: {type: ''},
      dictFiltersOrder: ['type'],
      bindValue: 'id',
      dict: 'getReferenceTypeListUsingGET',
    },
    {
      label: 'Количество',
      key: 'count',
      type: 'number'
    }
  ];
  constructor(private cas: CardItemService,
              private modal: NgbModal,
              private modalInstance: NgbActiveModal,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptionDrugs);
  }

  back() {
    this.modalInstance.dismiss();
  }

  save() {
    let drugs = {};
    Object.assign(drugs, this.form.getRawValue());
    this.cas.saveIventories(drugs).subscribe(
      res => {
        this.ns.success('Успешно', 'Данные сохранены');
        this.back();
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
        console.log('Save Address', err);
      }
    );
    console.log('->>', drugs);
  }

}
