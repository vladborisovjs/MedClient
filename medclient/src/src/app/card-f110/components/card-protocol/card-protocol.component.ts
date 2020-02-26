import { Component, OnInit } from '@angular/core';
import {DatePipe} from '@angular/common';
import {ColDef} from 'ag-grid-community';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-card-protocol',
  templateUrl: './card-protocol.component.html',
  styleUrls: ['./card-protocol.component.scss']
})
export class CardProtocolComponent implements OnInit {
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
      headerName: 'Действие',
      field: 'action_type',
      sortable: true,
      filter: true,
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
    },
    {
      headerName: 'Подразделение',
      field: 'subdivision_short_name',
      sortable: true,
      filter: true,
      width: 100
    }
  ];
  listSource: any[] = [];
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.listSource = data.protocolList
      }
    );
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

}
