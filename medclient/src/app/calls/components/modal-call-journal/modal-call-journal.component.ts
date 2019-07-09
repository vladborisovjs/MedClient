import {Component, Input, OnInit} from '@angular/core';
import {CallItemService} from '../../services/call-item.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import {ColDef} from 'ag-grid-community';

@Component({
  selector: 'app-modal-call-journal',
  templateUrl: './modal-call-journal.component.html',
  styleUrls: ['./modal-call-journal.component.scss']
})
export class ModalCallJournalComponent implements OnInit {
  @Input() brigade: any;
  @Input() callId: number;
  datePipe = new DatePipe('ru');
  colDefs: ColDef[] = [
    {
      headerName: 'Активность',
      field: 'name',
      sortable: true,
      filter: true,
      width: 400
    },
    {
      headerName: 'Дата/Время',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      width: 100
    },
  ];
  listSource: any[] = [];
  constructor(private cs: CallItemService,  private modalInstance: NgbActiveModal) { }

  ngOnInit() {
    this.cs.getJournal(this.brigade.brigade_schedule_id, this.brigade.call_id).subscribe(
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
