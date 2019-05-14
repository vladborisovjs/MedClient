import {Component, Input, OnInit} from '@angular/core';
import {CallDto} from '../../../../../swagger/med-api.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-modal-update-declarant',
  templateUrl: './modal-declarant-update.component.html',
  styleUrls: ['./modal-declarant-update.component.scss']
})
export class ModalDeclarantUpdateComponent implements OnInit {
  @Input() callItem: any;
  form: FormGroup;
  description: ISimpleDescription[] = [
    {
      label: 'ФИО',
      key: 'declarant_name',
      type: 'text',
    },
    {
      label: 'Телефон',
      key: 'declarant_phone',
      type: 'text',
    },
    {
      label: 'Тип',
      key: 'declarant_type_name',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'DECLARANT'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'name',
      dict: 'readAllUsingGET_34'
    }
  ];


  constructor(private modalInstance: NgbActiveModal,
              private cs: CallItemService,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.description);
  }

  back() {
    this.modalInstance.dismiss();
  }

  save() {
    console.log(this.callItem.declarant);
    Object.assign(this.callItem.declarant, this.form.getRawValue());
    this.cs.saveDeclarant(this.callItem.declarant).subscribe(
      res => {
        this.ns.success('Успешно', 'Данные сохранены');
        this.back();
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
        console.log('Save Declarant', err);
      }
    );
  }
}
