import {Component, Input, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {CallItemService} from '../../services/call-item.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationsService} from 'angular2-notifications';
import {FormGroup} from '@angular/forms';
import {CallDto} from '../../../../../swagger/med-api.service';

@Component({
  selector: 'app-modal-address-update',
  templateUrl: './modal-address-update.component.html',
  styleUrls: ['./modal-address-update.component.scss']
})
export class ModalAddressUpdateComponent implements OnInit {

  @Input() callItem: CallDto;
  formRest: FormGroup;
  formHouse: FormGroup;
  formRegion: FormGroup;
  formDistrict: FormGroup;
  formStreet: FormGroup;
  formSettlement: FormGroup;
  // TODO ИСПРАВИТЬ РЕГИОН, РАЙОН, НАС. ПУНКТ, УЛИЦА
  descriptionRegion: ISimpleDescription[] = [
    {
      label: 'Регион',
      key: 'name',
      type: 'text',
      styleClass: 'text-danger col-4',
    }
  ];
  descriptionDistrict: ISimpleDescription[] = [
    {
      label: 'Район',
      key: 'name',
      type: 'text',
      styleClass: 'text-danger col-4'
    }
  ];
  descriptionSettlement: ISimpleDescription[] = [
    {
      label: 'Населенный пункт',
      key: 'name',
      type: 'text',
      styleClass: 'text-danger col-4'
    }
  ];
  descriptionStreet: ISimpleDescription[] = [
    {
      label: 'Улица',
      key: 'name',
      type: 'text',
      styleClass: 'text-danger col-4'
    }
  ];
  descriptionHouse: ISimpleDescription[] = [
    {
      label: 'Дом',
      key: 'number',
      type: 'text',
      styleClass: 'col-4'
    },
    {
      label: 'Корпус',
      key: 'building',
      type: 'text',
      styleClass: 'col-4'
    },
    {
      label: 'Лит./Стр.',
      key: 'structure',
      type: 'text',
      styleClass: 'col-4'
    },
  ];
  descriptionRest: ISimpleDescription[] = [
    {
      label: 'Подъезд',
      key: 'entrance',
      type: 'text',
      styleClass: 'col-4'
    },
    {
      label: 'Домофон',
      key: 'entrance_code',
      type: 'text',
      styleClass: 'col-4'
    },
    {
      label: 'Этаж',
      key: 'floor',
      type: 'text',
      styleClass: 'col-4'
    },
    {
      label: 'Квартира',
      key: 'flat',
      type: 'text',
      styleClass: 'col-4'
    },
    {
      label: 'Комната',
      key: 'room',
      type: 'text',
      styleClass: 'col-4'
    },
    {
      label: 'Место вызова',
      key: 'call_place_name',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'CALL_PLACE'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'name',
      dict: 'readAllUsingGET_34',
    }
  ];

  constructor(private modalInstance: NgbActiveModal,
              private cs: CallItemService,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService) { }

  ngOnInit() {
    console.log(this.callItem.address);
    this.formRest = this.sds.makeForm(this.descriptionRest);
    this.formRegion = this.sds.makeForm(this.descriptionRegion);
    this.formDistrict = this.sds.makeForm(this.descriptionDistrict);
    this.formSettlement = this.sds.makeForm(this.descriptionSettlement);
    this.formStreet = this.sds.makeForm(this.descriptionStreet);
    this.formHouse = this.sds.makeForm(this.descriptionHouse);
  }

  back() {
    this.modalInstance.dismiss();
  }

  save() {
    Object.assign(this.callItem.address, this.formRest.getRawValue());
    Object.assign(this.callItem.address.district, this.formDistrict.getRawValue());
    Object.assign(this.callItem.address.region, this.formRegion.getRawValue());
    Object.assign(this.callItem.address.house, this.formHouse.getRawValue());
    Object.assign(this.callItem.address.settlement, this.formSettlement.getRawValue());
    Object.assign(this.callItem.address.street, this.formStreet.getRawValue());
    this.cs.saveAddress(this.callItem.address, this.callItem.general.call_id).subscribe(
      res => {
        this.ns.success('Успешно', 'Данные сохранены');
        this.back();
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
        console.log('Save Address', err);
      }
    );
  }

}
