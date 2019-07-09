import { Component, OnInit } from '@angular/core';
import {CallItemService} from '../../services/call-item.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import {ColDef} from 'ag-grid-community';
import {CallDto, CardSideOneDto} from '../../../../../swagger/med-api.service';
import {ActivatedRoute} from '@angular/router';
import {ModalCallTransferAvailableComponent} from '../modal-call-transfer-available/modal-call-transfer-available.component';

@Component({
  selector: 'app-modal-call-transfer',
  templateUrl: './modal-call-transfer.component.html',
  styleUrls: ['./modal-call-transfer.component.scss']
})
export class ModalCallTransferComponent implements OnInit {
  datePipe = new DatePipe('ru');
  callId: any;
  callItem: CallDto;
  colDefs: ColDef[] = [
    {
      headerName: 'Откуда',
      field: 'sub_from_name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Кем',
      field: 'performer_send_name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Когда передано',
      field: 'date_create',
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Куда',
      field: 'sub_to_name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Принято',
      field: 'performer_accept_name',
      sortable: true,
      filter: true,
    },
    {
      headerName: '№ Входа',
      field: 'number',
      sortable: true,
      filter: true,
    },
  ];
  listSource: any[] = [];
  constructor(
    private cs: CallItemService,
    private modalInstance: NgbActiveModal,
    private route: ActivatedRoute,
    private modal: NgbModal) { }

  ngOnInit() {
    this.cs.getTransfer(this.callId).subscribe(
      list => {
        this.listSource = list;
        console.log(this.listSource);
      }
    );
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  back() {
    this.modalInstance.dismiss();
  }

  openAvailable() {
    const available = this.modal.open(ModalCallTransferAvailableComponent);
    available.componentInstance.callId = this.callId;
  }
}
