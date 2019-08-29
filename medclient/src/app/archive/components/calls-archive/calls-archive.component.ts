import { Component, OnInit } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {ArchiveService} from '../../services/archive.service';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { FormGroup} from '@angular/forms';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-calls-archive',
  templateUrl: './calls-archive.component.html',
  styleUrls: ['./calls-archive.component.scss']
})
export class CallsArchiveComponent implements OnInit {
  colDefs: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: true,
      filter: true,
      width: 90,
    },
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => {
        return this.dateFormatter(p);
      },
      width: 200
    },
    {
      headerName: 'Заявитель',
      field: 'declarantName',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Повод к вызову',
      field: 'reasonFK.reason',
      sortable: true,
      filter: true,
      width: 220,
    },
    {
      headerName: 'Адрес',
      field: 'address',
      sortable: true,
      filter: true,
      width: 220,
    },
    {
      headerName: 'Пациенты',
      field: 'callPatientList',
      sortable: true,
      filter: true,
      width: 200,
      valueGetter: params => {
        if (params.data.callPatientList && params.data.callPatientList.length) {
          let pat = '';
          if (!params.data.callPatientList[0].call) {
            return ' ';
          }
          params.data.callPatientList.forEach(
            p => {
              pat = pat + p.patientFK.surname + ' ' + p.patientFK.name + ', ';
            }
          );
          pat = pat.slice(0, -2);
          return pat;
        } else {
          return ' ';
        }
      },
    },
    {
      headerName: 'Бригады',
      field: 'brigades',
      sortable: true,
      filter: true,
      width: 180,
      valueGetter: params => {
        if (!params.data.assignedBrigadeList[0].call) {
          return ' ';
        }
        let bris = '';
        params.data.assignedBrigadeList.forEach(
          b => {
            bris = bris + b.brigadeFK.name + ', ';
          }
        );
        bris = bris.slice(0, -2);
        return bris;
      },
    },
    {
      headerName: 'Сотрудник',
      field: 'performerFK.name',
      valueGetter: params => params.data.performerFK.surname + ' ' + params.data.performerFK.name + ' ' + params.data.performerFK.patronymic,
      sortable: true,
      filter: true,
      width: 180,
    },
  ];
  filters: any = {};
  form: FormGroup;
  descriptions: ISimpleDescription[] = [
    {
      key: 'id',
      label: 'Номер',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-12',
      additional:{
        block: 'callInfo'
      }
    },
    {
      key: 'typeFK',
      label: 'Тип',
      type: 'dict',
      dict: 'getReferenceTypeListCallUsingGET',
      styleClass: 'col-12',
      additional:{
        block: 'callInfo'
      }
    },
    {
      key: 'dateFrom',
      label: 'Дата с',
      type: 'date',
      styleClass: 'col-6',
      additional:{
        block: 'callInfo'
      }
    },
    {
      key: 'dateTo',
      label: 'по',
      type: 'date',
      styleClass: 'col-6',
      additional:{
        block: 'callInfo'
      }
    },
    {
      key: 'subdivisionId',
      label: 'Подразделение',
      type: 'text', // dict
      styleClass: 'col-6',
      additional:{
        block: 'callInfo'
      }
    },
    {
      key: 'performerFK',
      label: 'Сотрудник',
      type: 'dict',
      dict: 'getPerformerListUsingGET',
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'patientName',
      label: 'ФИО',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-8',
      additional:{
        block: 'patient'
      }
    },
    {
      key: 'patientSex',
      label: 'Пол',
      type: 'select',
      selectList: [
        {name: 'Муж.', id: 1},
        {name: 'Жен.', id: 2},
      ],
      styleClass: 'col-4',
      additional:{
        block: 'patient'
      }
    },
    {
      key: 'reason',
      label: 'Повод',
      type: 'text',
      additional:{
        block: 'patient'
      }
    },
    {
      key: 'districtId',
      label: 'Район',
      type: 'text', //dict
      styleClass: 'col-6',
      additional:{
        block: 'address'
      }
    },
    {
      key: 'aoName',
      label: 'Улица',
      styleClass: 'col-6',
      type: 'text', //dict
      additional:{
        block: 'address'
      }
    },
    {
      key: 'declarantName',
      label: 'ФИО',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-7',
      additional:{
        block: 'declarant'
      }
    },
    {
      key: 'declarantTypeFK',
      label: 'Тип заявителя',
      type: 'dict',
      dict: 'getReferenceTypeListDeclarantUsingGET',
      styleClass: 'col-5',
      additional:{
        block: 'declarant'
      }
    },
    {
      key: 'typeFK',
      label: 'Место вызова',
      type: 'dict',
      dict: 'getReferenceTypeListCallPlaceUsingGET',
      styleClass: 'col-6',
      additional:{
        block: 'declarant'
      }
    },
    {
      key: 'declarantPhone',
      label: 'Телефон',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Некорректный номер',
      styleClass: 'col-6',
      additional:{
        block: 'declarant'
      }
    },
  ];
  loading: boolean;
  datePipe = new DatePipe('ru');
  dataSource = {
    get: (filter, offset, count) => {
      this.loading = true;
      filter.dateFrom = filter.dateFrom ? filter.dateFrom.toISOString() : undefined;
      filter.dateTo = filter.dateTo ? filter.dateTo.toISOString() : undefined;
      return this.arch.searchCall(offset, count, filter, filter.dateFrom, filter.dateTo).pipe(tap(() => this.loading = false));
    }
  };
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm') : '-';
  }
  constructor(private arch: ArchiveService,
              private router: Router,
              private sds: SimpleDescriptionService,
              private route: ActivatedRoute,) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.searchCalls();
  }


  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  goToCall(call) {
    console.log(call);
    this.router.navigate([ 'calls/'+ call.data.id]);
  }

  searchCalls(){
    this.filters = this.form.getRawValue();
  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptions.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

  eraseFilters(){
    this.filters = {};
    this.form.reset({});
  }

}
