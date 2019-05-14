import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Subscription} from 'rxjs';
import {CallDto, CallPatientPartDto, MedApi} from '../../../../../swagger/med-api.service';
import {ISimpleDescription} from '../../../shared/simple-control/services/simple-description.service';
import {IPlateInfo} from '../../../shared/info-plate/components/info-plate/info-plate.component';
import {ColDef} from 'ag-grid-community';
import {UserService} from '../../../services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalCallUpdateGeneralComponent} from '../modal-call-update-general/modal-call-update-general.component';
import {ModalDeclarantUpdateComponent} from '../modal-declarant-update/modal-declarant-update.component';
import {ModalCallPatientsUpdateComponent} from '../modal-call-patients-update/modal-call-patients-update.component';
import {ModalAddressUpdateComponent} from '../modal-address-update/modal-address-update.component';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {ModalPatientChronologyComponent} from '../modal-patient-chronology/modal-patient-chronology.component';

@Component({
  selector: 'app-call-item',
  templateUrl: './call-item.component.html',
  styleUrls: ['./call-item.component.scss']
})
export class CallItemComponent implements OnInit, OnDestroy {
  id: number;
  sbscs: Subscription[] = [];
  callItem: CallDto;
  callPlate: IPlateInfo[] = [
    // general
    {
      title: 'Номер: ', field: 'call_number', type: 'number', block: 'general'
    },
    {
      title: 'Дата и время: ', field: 'date', type: 'date', block: 'general', datePipeFormat: 'dd.MM.yyyy hh:mm'
    },
    {
      title: 'Тип: ', field: 'call_type_name', type: 'text', block: 'general'
    },
    {
      title: 'Повод: ', field: 'reason_name', type: 'text', block: 'general'
    },
    {
      title: 'Описание: ', field: 'reason_comment', type: 'text', block: 'general'
    },
    {
      title: 'Приоритет: ', field: 'call_priority_name', type: 'text', block: 'general'
    },
    {
      title: 'Вызов принят: ', field: 'performer_accept_name', type: 'text', block: 'general'
    },
    {
      title: 'Район: ', field: 'district', subField: 'name',  type: 'bean', block: 'address'
    },
    {
      title: 'Адрес: ', field: 'fullname', type: 'text', block: 'address'
    },
    {
      title: 'Место вызова: ', field: 'call_place_name', type: 'text', block: 'address'
    },
    // declarant
    {
      title: 'Фио: ', field: 'declarant_name',   type: 'text', block: 'declarant'
    },
    {
      title: 'Телефон: ', field: 'declarant_phone',   type: 'text', block: 'declarant'
    },
    {
      title: 'Тип: ', field: 'declarant_type_name',   type: 'text', block: 'declarant'
    },

  ];
  briCallDefs: ColDef[] = [
    {
      headerName: 'Бригада',
      field: 'brigade_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Тип',
      field: 'brigade_type_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Статус',
      field: 'state',
      sortable: true,
      filter: true
    },
  ];
  briListSource = [];

  constructor(private route: ActivatedRoute,
              private api: MedApi,
              private user: UserService,
              private modal: NgbModal,
              private cmodal: CustomModalService,
              private ns: NotificationsService,
              private cs: CallItemService,) {
  }

  ngOnInit() {
    this.sbscs.push(
      this.route.data.subscribe(data => {
        this.callItem = data.callItem;
        console.log('item', this.callItem);
      }),
      this.cs.callItemSub.subscribe(data => {
        this.callItem = data;
        console.log('updated', this.callItem);
      }),
      this.api.getBrigadesFromCallUsingGET(this.user.subdivisionId, this.callItem.general.call_id).subscribe(
        bri => {
          this.briListSource = bri;
        }
      )
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  editGeneral() {
    const generalModal = this.modal.open(ModalCallUpdateGeneralComponent);
    generalModal.componentInstance.callItem = this.callItem;
  }

  editDeclarant() {
    const declarantModal = this.modal.open(ModalDeclarantUpdateComponent);
    declarantModal.componentInstance.callItem = this.callItem;
  }

  editPatients(patient?: CallPatientPartDto){
    const patModal = this.modal.open(ModalCallPatientsUpdateComponent, {size: !patient? 'lg': null});
    patModal.componentInstance.callItem = this.callItem;
    patModal.componentInstance.patient = patient;
  }

  deletePatient(patient) {
    this.cmodal.confirm('Удаление пациента', 'Вы уверены, что хотите удалить пациента' + '?').then(
      res => {
        if (res) {
          this.cs.deletePatient(patient.patient_id, this.callItem.general.call_id).subscribe(
            ans => {
              this.ns.success('Успешно', 'Данные обновлены');
            },
            err => {
              this.ns.error('Ошибка', 'Не удалось удалить пациента')
            }

          );
        }
      },
      () => {}
    )
  }

  showChronology(patient) {
    const chronModal = this.modal.open(ModalPatientChronologyComponent, {size: 'lg'});
    chronModal.componentInstance.patientId = patient.patient_id;
    chronModal.componentInstance.callId = this.callItem.general.call_id;
  }
  editAddress() {
    const addressModal = this.modal.open(ModalAddressUpdateComponent);
    addressModal.componentInstance.callItem = this.callItem;
  }


  /** метод для получения описания по
   * блоку в поле аддишнл,
   * чтобы все описания хранились
   * в одном массиве
   */
  // getBlockDescriptions(block: string): ISimpleDescription[] {
  //   return this.callDescription.filter(el => {
  //     if (el.additional) {
  //       return el.additional.block === block;
  //     }
  //     return false;
  //   });
  // }

  getPlateDescriptions(block: string): IPlateInfo[] {
    return this.callPlate.filter(el => {
      if (el.block) {
        return el.block === block;
      }
      return false;
    });
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

}
