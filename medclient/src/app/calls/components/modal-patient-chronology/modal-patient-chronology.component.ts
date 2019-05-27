import {Component, Input, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {CallItemService} from '../../services/call-item.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-patient-chronology',
  templateUrl: './modal-patient-chronology.component.html',
  styleUrls: ['./modal-patient-chronology.component.scss']
})
export class ModalPatientChronologyComponent implements OnInit {
@Input() patientId: any;
@Input() callId: number;
colDefs: ColDef[] = [
  {
    headerName: 'Номер',
    field: 'number',
    sortable: true,
    filter: true
  },
  {
    headerName: 'Пациент',
    field: 'patient',
    sortable: true,
    filter: true
  },
  {
    headerName: 'Адрес',
    field: 'address',
    sortable: true,
    filter: true
  },
  {
    headerName: 'Заявитель',
    field: 'declarant_name',
    sortable: true,
    filter: true
  },
  {
    headerName: 'Повод',
    field: 'reason_name',
    sortable: true,
    filter: true
  },
  {
    headerName: 'Результат',
    field: 'result_name',
    sortable: true,
    filter: true
  },
];
listSource: any[] = [];

    constructor(private cs: CallItemService,  private modalInstance: NgbActiveModal,) { }

  ngOnInit() {
      this.cs.getChronology(this.patientId, this.callId ).subscribe(
        list => {
          this.listSource = list;
        }
      )
  }

  back() {
    this.modalInstance.dismiss();
  }

}
