import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ICallsTableFilter} from "../calls-container/calls-container.component";
import {DatePipe} from "@angular/common";
import {FullnameShorterPipe} from "../../../shared/med-pipes/pipes/fullname-shorter.pipe";
import {CardStatusPipe} from "../../../shared/med-pipes/pipes/card-status.pipe";
import {IGridTableDataSource} from "../../../shared/grid-table/components/grid-table/grid-table.component";
import {ColDef} from "ag-grid-community";
import {CallsService} from "../../services/calls.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardTableComponent implements OnInit {
  @Input() filters: ICallsTableFilter;

  dataSource: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.calls.getActiveCardsList(offset, count, filter);
    }
  };
  colDefs: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: false,
      filter: false,
      width: 120,
    },
    {
      headerName: 'Бригада',
      field: 'brigadeFK.name',
      sortable: false,
      filter: false,
      width: 100,
    },
    {
      headerName: 'Повод к вызову',
      field: 'callFK.reasonFK.reason',
      sortable: false,
      filter: false,
      width: 220,
    },
    {
      headerName: 'Пациент',
      field: 'patientFK',
      sortable: false,
      filter: false,
      width: 120,
      valueFormatter: params => this.nameShorterPipe.transform(params.value),
    },
    {
      headerName: 'Заявитель',
      field: 'callFK.declarantName',
      sortable: false,
      filter: false,
      width: 120,
    },
    {
      headerName: 'Исполнитель',
      field: 'performerFK',
      sortable: false,
      filter: false,
      width: 120,
      valueFormatter: params => this.nameShorterPipe.transform(params.value),
    },
    {
      headerName: 'Статус',
      field: 'cardStatus',
      valueFormatter: params => this.cardStatusPipe.transform(params.value),
      sortable: false,
      filter: false,
      width: 100,
    },
    {
      headerName: 'Результат',
      field: 'resultTypeFK.name',
      sortable: false,
      filter: false,
      width: 200,
    },

  ];

  datePipe = new DatePipe('ru');
  cardStatusPipe = new CardStatusPipe();
  nameShorterPipe = new FullnameShorterPipe();

  constructor(private calls: CallsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }


  goToCard(card) {
    this.router.navigate([card.data.call + '/card/' + card.data.id], {relativeTo: this.route});
  }
}
