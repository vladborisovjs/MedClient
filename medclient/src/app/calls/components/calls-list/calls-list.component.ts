import { Component, OnInit } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {CallGridDto, MedApi} from '../../../../../swagger/med-api.service';
import {DatePipe} from '@angular/common';
import {CallsService} from '../../services/calls.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-calls-list',
  templateUrl: './calls-list.component.html',
  styleUrls: ['./calls-list.component.scss']
})
export class CallsListComponent implements OnInit {
  colDefs: ColDef[] = [
    {
      headerName: 'Номер',
      field: 'number',
      sortable: true,
      filter: true,
    },
    // {
    //   headerName: 'Дата',
    //   field: 'date',
    //   sortable: true,
    //   filter: true,
    //   valueFormatter: (p) => {
    //     console.log('p', p);
    //     return this.dateFormatter(p);
    //   }
    // },
    {
      headerName: 'Заявитель',
      field: 'declarant_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Повод к вызову',
      field: 'reason_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Район',
      field: 'district_name',
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
      headerName: 'Пациенты',
      field: 'patients',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Бригады',
      field: 'brigades',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Сотрудник',
      field: 'performer_accept_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Статус',
      field: 'call_status_name',
      sortable: true,
      filter: true
    },
  ];
  listSource: CallGridDto[] = [];
  datePipe = new DatePipe('ru');
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy') : '-';
  }
  constructor(private api: MedApi, private calls: CallsService, private router: Router, private route: ActivatedRoute,) { }

  ngOnInit() {
    this.calls.getCallsList().subscribe(el => this.listSource = el);
  }

  goToCall(call) {
    console.log(call.data);
    this.router.navigate([call.data.id], {relativeTo: this.route});
  }

}
