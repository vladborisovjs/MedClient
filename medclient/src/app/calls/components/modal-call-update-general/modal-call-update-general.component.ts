import {Component, Input, OnInit} from '@angular/core';
import {CallDto} from '../../../../../swagger/med-api.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-modal-call-update-general',
  templateUrl: './modal-call-update-general.component.html',
  styleUrls: ['./modal-call-update-general.component.scss']
})
export class ModalCallUpdateGeneralComponent implements OnInit {

  @Input() callItem: any;
  form: FormGroup;

  description: ISimpleDescription[] = [
    {
      label: 'Тип',
      key: 'call_type_id',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'CALL'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
    },
    {
      label: 'Повод',
      key: 'reason_id',
      type: 'dict',
      shortDict: true,
      dict: 'readBasicReasonsUsingGET',
      bindLabel: 'title',
      bindValue: 'id',
    },
    {
      label: 'Описание',
      key: 'reason_comment',
      type: 'textarea',
      rows: 2,
    },
    {
      label: 'Приоритет',
      key: 'call_priority',
      type: 'select',
      selectList: [
        {name: 'Экстренный', id: 1},
        {name: 'Неотложный', id: 0},
      ],
      styleClass: 'col-12',
    },
    {
      label: 'Необоснованный вызов',
      key: 'is_unfounded',
      type: 'checkbox',
      // styleClass: 'col-6',

    },
  ];

  constructor(private modalInstance: NgbActiveModal,
              private cs: CallItemService,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    console.log(this.callItem.general);
    this.form = this.sds.makeForm(this.description);
  }

  back() {
    this.modalInstance.dismiss();
  }

  save() {
    Object.assign(this.callItem.general, this.form.getRawValue());
    this.cs.saveCallGeneral(this.callItem.general).subscribe(
      res => {
        this.ns.success('Успешно', 'Данные сохранены');
        this.back();
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
        console.log('Save Call General', err);
      }
    );
  }
}
