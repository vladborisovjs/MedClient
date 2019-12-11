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
      field: 'callFK.reasonFK.reason',
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
      valueFormatter: (v) => {
        return (v.value.surname ? v.value.surname : '') +
          ' ' + (v.value.name ? v.value.name : '')  + ' ' + ( v.value.patronymic ? v.value.patronymic : '' ) + ' ';
      }
    },
    {
      headerName: 'Заявитель',
      field: 'callFK.declarantName',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Исполнитель',
      valueGetter: params => params.data.performerFK.surname +
        ' ' + params.data.performerFK.name + ' ' + params.data.performerFK.patronymic,
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Статус', // todo: pipe карточек
      valueGetter: params => {
        if (params.data.cardStatus === 1) {
          return 'Проверена';
        } else if ( params.data.cardStatus === 2) {
          return 'Готова к отправке в ЕГИСЗ';
        } else if (params.data.cardStatus === 4) {
          return 'Отправлено в ЕГИСЗ';
        } else if (params.data.cardStatus === 0) {
          return 'Создана';
        } else {
          return 'Статус не установлен';
        }
      },
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Результат',
      field: 'resultTypeFK.name',
      sortable: true,
      filter: true,
      width: 120,
    },

  ];
  filter = {
    subdivisionId: undefined
  };
  datePipe = new DatePipe('ru');
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
