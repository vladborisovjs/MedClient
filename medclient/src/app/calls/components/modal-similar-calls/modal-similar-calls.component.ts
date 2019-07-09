import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CallsService} from '../../services/calls.service';

@Component({
  selector: 'app-modal-similar-calls',
  templateUrl: './modal-similar-calls.component.html',
  styleUrls: ['./modal-similar-calls.component.scss']
})
export class ModalSimilarCallsComponent implements OnInit {
  listSource: any[] = [];
  @Output() selectedCall: EventEmitter<any> = new EventEmitter();
  @Input() listSimCalls: any;
  colDefs: ColDef[] = [
    {
      headerName: 'Пациенты',
      field: 'patients',
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
      headerName: 'Повод',
      field: 'call_reason',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Номер',
      field: 'number',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true
    },
  ];
  constructor(
    private calls: CallsService,
    private modalInstance: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.listSource = this.listSimCalls;
  }

  selectCall(e) {
    this.selectedCall = e.data;
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }
  back() {
    this.modalInstance.dismiss();
  }

  setSimilarCall() {
    this.modalInstance.close(this.selectedCall);
  }
}
