import { Component, OnInit } from '@angular/core';
import {ColDef, GridApi} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {CallsService} from '../../services/calls.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  dataSource: IGridTableDataSource;
  colDefs: ColDef[] = [
    {
      headerName: '№',
      field: 'id',
      sortable: true,
      filter: true,
      width: 80,
    },
    {
      headerName: 'Бригада',
      field: 'brigadeFK.name',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Повод к вызову',
      field: 'callFK.reasonFK.name',
      sortable: true,
      filter: true,
      width: 220,
    },
    // {
    //   headerName: 'Адрес',
    //   field: 'address',
    //   sortable: true,
    //   filter: true,
    //   width: 220,
    // },
    {
      headerName: 'Пациент',
      field: 'patientFK',
      sortable: true,
      filter: true,
      width: 120,
      valueFormatter: (v)=> {
        return (v.value.name ? v.value.name : '')  + ' ' + ( v.value.patronymic ? v.value.patronymic : '' )+ ' '+ (v.value.surname ? v.value.surname : '');
      }
    },
    {
      headerName: 'Заявитель',
      field: 'callFK',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Исполнитель',
      valueGetter: params => params.data.performerFK.surname + ' ' + params.data.performerFK.name + ' ' + params.data.performerFK.patronymic,
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Отработка',
      field: 'card_status_name',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Результат',
      field: 'result_name',
      sortable: true,
      filter: true,
      width: 120,
    },

  ];
  filters: any = {};
  datePipe = new DatePipe('ru');
  constructor(private calls: CallsService,
              private router: Router,
              private route: ActivatedRoute,) { }

  ngOnInit() {
    this.updateDataSource()
  }

  updateDataSource() {
    this.dataSource = {
      get: (filter, offset, count) => {
        return this.calls.getActiveCardsList(offset, count, filter.brigadeId);
      }
    }
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  goToCard(card) {
    console.log(card);
    this.router.navigate([card.data.call + '/card/' + card.data.id], {relativeTo: this.route});
  }

  selectCard(e) {
    console.log(e);
  }

}
