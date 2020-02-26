import {Component, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CardItemService} from '../../services/card-item.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-modal-add-drugs',
  templateUrl: './modal-add-drugs.component.html',
  styleUrls: ['./modal-add-drugs.component.scss']
})
export class ModalAddDrugsComponent implements OnInit {
  form: FormGroup;
  descriptionDrugs: ISimpleDescription[] = [
    {
      label: 'Наименование',
      key: 'name',
      type: 'dict',
      dict: 'getDrugListUsingGET',
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
    // this.cas.saveIventories(this.form.getRawValue()).subscribe(
    //   res => {
    //     this.ns.success('Успешно', 'Данные сохранены');
    //     this.back();
    //   },
    //   err => {
    //     this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
    //     console.log('Save Address', err);
    //   }
    // );
  }

}
