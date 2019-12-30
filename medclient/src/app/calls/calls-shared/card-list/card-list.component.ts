import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {CallsService} from '../../services/calls.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {MedUtilitesService} from "../../../services/med-utilites.service";
import {CardStatusPipe} from "../../../shared/med-pipes/pipes/card-status.pipe";
import {FullnameShorterPipe} from "../../../shared/med-pipes/pipes/fullname-shorter.pipe";

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnDestroy {
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
  filter = {
    subdivisionId: this.user.mePerformer.performer.subdivisionFK.id,
  };
  datePipe = new DatePipe('ru');
  cardStatusPipe = new CardStatusPipe();
  nameShorterPipe = new FullnameShorterPipe();
  sbscs: Subscription[] = [];
  subdivisionList = [];
  form = new FormGroup({
    subdivision: new FormControl(this.user.mePerformer.performer.subdivisionFK.id)
  });
  constructor(private calls: CallsService,
              private router: Router,
              private user: UserService,
              private sds: SimpleDescriptionService,
              private route: ActivatedRoute,
              private utilite: MedUtilitesService) { }

  ngOnInit() {
    this.sbscs.push(
      this.utilite.getSubdivisionFilters().subscribe(list => {
        this.subdivisionList = list;
      }),
      this.form.valueChanges.pipe(debounceTime(300)).subscribe(
        f => {
          console.log(f);
          this.filter.subdivisionId = f['subdivision'] || undefined;
          this.updateFilter();
        }
      ),
    );
  }


  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  goToCard(card) {
    console.log(card);
    this.router.navigate([card.data.call + '/card/' + card.data.id], {relativeTo: this.route});
  }

  updateFilter() {
    this.filter = Object.assign({}, this.filter);
  }

  selectCard(e) {
    console.log(e);
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }
}
