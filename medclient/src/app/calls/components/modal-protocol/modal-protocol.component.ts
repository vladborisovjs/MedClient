import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CallItemService} from '../../services/call-item.service';
import {ColDef} from 'ag-grid-community';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-modal-protocol',
  templateUrl: './modal-protocol.component.html',
  styleUrls: ['./modal-protocol.component.scss']
})
export class ModalProtocolComponent implements OnInit {
  @Input() callId: number;
  datePipe = new DatePipe('ru');
  colDefs: ColDef[] = [
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      width: 100
    },
    {
      headerName: 'Описание',
      field: 'description',
      sortable: true,
      filter: true,
      width: 400
    },
    {
      headerName: 'Сотрудник',
      field: 'performer_short_name',
      sortable: true,
      filter: true,
      width: 100
    }
  ];
  listSource: any[] = [];
  constructor(private cs: CallItemService,  private modalInstance: NgbActiveModal) { }

  ngOnInit() {
    this.cs.getProtocol(this.callId).subscribe(
      list => {
        this.listSource = list;
      }
    );
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  back() {
    this.modalInstance.dismiss();
  }

}
