import { Component, OnInit } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {ArchiveService, ICallFilter} from '../../services/archive.service';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { FormGroup} from '@angular/forms';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';

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
      headerName: 'Статус',
      field: 'call_status_name',
      sortable: true,
      filter: true,
      width: 200,
      // cellRenderer: (p) => {
      //   let val = p.value;
      //   switch (p.data.call_status) {
      //     case 0:
      //       val = '<i class="fas fa-exclamation-circle blinking text-danger"></i> ' +  p.value;
      //       break;
      //     case 1:
      //       val = '<i class="fas fa-exclamation-circle text-warning"></i> ' +  p.value;
      //       break;
      //     case 2:
      //       val = '<i class="fas fa-cog text-primary fa-spin"></i> ' +  p.value;
      //       break;
      //     case 3:
      //       val = '<i class="fas fa-check-circle text-success"></i> ' +  p.value;
      //       break;
      //     case 4:
      //       val = '<i class="fas fa-ban text-secondary"></i>  ' +  p.value;
      //       break;
      //   }
      //   return val;
      //
      // },
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
      field: 'declarant_name',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Повод к вызову',
      field: 'reason_name',
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
      field: 'patients',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Бригады',
      field: 'brigades',
      sortable: true,
      filter: true,
      width: 180,
    },
    {
      headerName: 'Сотрудник',
      field: 'performer_accept_name',
      sortable: true,
      filter: true,
      width: 180,
    },
  ];
  listSource: any[] = [];
  filters: ICallFilter = {
    subdivisionId: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    number: undefined,
    declarantName: undefined,
    declarantPhone: undefined,
    patientName: undefined,
    patientSex: undefined,
    patientAgeYears: undefined,
    patientAgeMonths: undefined,
    patientAgeDays: undefined,
    aoName: undefined,
    districtId: undefined,
    performer: undefined,
    callTypeId: undefined,
    declarantTypeId: undefined,
    phone: undefined,
    callPlaceTypeId: undefined,
    reasonTypeId: undefined
  };
  form: FormGroup;
  descriptions: ISimpleDescription[] = [
    {
      key: 'number',
      label: 'Номер',
      type: 'number',
      styleClass: 'col-3',
      additional:{
        block: 'callInfo'
      }
    },
    {
      key: 'callTypeId',
      label: 'Тип',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'CALL'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
      styleClass: 'col-9',
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
      key: 'performer',
      label: 'Сотрудник',
      type: 'text',
      styleClass: 'col-6',
      additional:{
        block: 'callInfo'
      }
    },
    {
      key: 'patientName',
      label: 'ФИО',
      type: 'text',
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
      key: 'reasonTypeId',
      label: 'Повод',
      type: 'dict',
      shortDict: true,
      dict: 'readBasicReasonsUsingGET',
      bindLabel: 'title',
      bindValue: 'id',
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
      styleClass: 'col-7',
      additional:{
        block: 'declarant'
      }
    },
    {
      key: 'declarantTypeId',
      label: 'Тип заявителя',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'DECLARANT'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
      styleClass: 'col-5',
      additional:{
        block: 'declarant'
      }
    },
    {
      key: 'callPlaceTypeId',
      label: 'Место вызова',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'CALL_PLACE'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
      styleClass: 'col-6',
      additional:{
        block: 'declarant'
      }
    },
    {
      key: 'declarantPhone',
      label: 'Телефон',
      type: 'text',
      styleClass: 'col-6',
      additional:{
        block: 'declarant'
      }
    },
  ];
  loading: boolean;

  datePipe = new DatePipe('ru');

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
    console.log(call.data);
    this.router.navigate([ 'calls/'+ call.data.id]);
  }

  searchCalls(){
    this.loading = true;
    this.filters = this.form.getRawValue();
    Object.keys(this.filters).forEach(
      key => {
        this.filters[key] = this.filters[key] ? this.filters[key] : undefined;
      }
    );
    this.arch.searchCall(this.filters).subscribe(
      l => {
        this.listSource = l;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    )
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
    this.form.reset({});
  }

}
