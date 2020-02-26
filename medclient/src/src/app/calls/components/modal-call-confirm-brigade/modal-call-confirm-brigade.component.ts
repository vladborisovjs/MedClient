import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {IPlateInfo} from '../../../shared/info-plate/components/info-plate/info-plate.component';
import {FormGroup} from '@angular/forms';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-modal-call-confirm-brigade',
  templateUrl: './modal-call-confirm-brigade.component.html',
  styleUrls: ['./modal-call-confirm-brigade.component.scss']
})
export class ModalCallConfirmBrigadeComponent implements OnInit, OnDestroy {
  @Input() brigades: any[];
  @Input() callId: number;
  desc: ISimpleDescription[] = [
    {
      label: 'Тип передачи',
      key: 'receiving_type_id',
      type: 'dict',
      dictFilters: {type: 'BRIGADE_RECEIVING'},
      dictFiltersOrder: ['type'],
      bindValue: 'id',
      dict: 'getReferenceTypeListUsingGET',
    }
  ];
  briProp: IPlateInfo[] = [
    // general
    {
      title: 'Бригада', field: 'name', type: 'text',
    },
    {
      title: 'Специализация', field: 'br_type_name', type: 'text',
    },
    {
      title: 'Статус', field: 'brigade_status_name', type: 'text',
    },
    ];
  form: FormGroup;
  receivingType: any = {receiving_type_id: 79874}; // значение по умолчанию по телефону
  sbscs: Subscription[] = [];
  constructor(private modalInstance: NgbActiveModal,
              private sds: SimpleDescriptionService,
              private cs: CallItemService,
              private ns: NotificationsService,) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.desc);
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  confirm() {
    this.receivingType  = this.form.getRawValue();
    this.brigades.forEach(
      bri => {
       bri.receiving_type_id = this.receivingType.receiving_type_id;
      }
    );
    this.sbscs.push(
      // this.cs.appointBrigadesToCall(this.callId, this.brigades).subscribe(
      //   ans => {
      //     console.log(ans);
      //     this.ns.success('Успешно', 'Бригады назначены на вызов');
      //     this.modalInstance.close(true);
      //   },
      //   error => {
      //     console.log(error);
      //     this.ns.error('Ошибка', 'Не удалось назначить бригаду');
      //     this.modalInstance.close(false);
      //   }
      // )
    );

  }

  back() {
    this.modalInstance.dismiss();
  }

}
