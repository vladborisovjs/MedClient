import {Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {FormGroup} from '@angular/forms';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {DatePipe} from '@angular/common';
import {offset} from 'ol/sphere';
import {ArchiveService} from '../../services/archive.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-patients-archive',
  templateUrl: './patients-archive.component.html',
  styleUrls: ['./patients-archive.component.scss']
})
export class PatientsArchiveComponent implements OnInit {
  colDefs: ColDef[] = [
    {
      headerName: '№',
      field: 'id',
      sortable: true,
      filter: true,
      width: 90,
    },
    {
      headerName: 'Имя',
      field: 'name',
      sortable: true,
      filter: true,
      width: 90,
    },
    {
      headerName: 'Отчество',
      field: 'patronymic',
      sortable: true,
      filter: true,
      width: 90,
    },
    {
      headerName: 'Фамилия',
      field: 'surname',
      sortable: true,
      filter: true,
      width: 90,
    },
    {
      headerName: 'Дата Рождения',
      field: 'birthday',
      sortable: true,
      filter: true,
      valueFormatter: (p) => {
        return this.dateFormatter(p);
      },
      width: 200
    },
    // {
    //   headerName: 'Заявитель',
    //   field: 'declarantName',
    //   sortable: true,
    //   filter: true,
    //   width: 200,
    // },
    // {
    //   headerName: 'Повод к вызову',
    //   field: 'reasonFK.reason',
    //   sortable: true,
    //   filter: true,
    //   width: 220,
    // },
    // {
    //   headerName: 'Адрес',
    //   field: 'address',
    //   sortable: true,
    //   filter: true,
    //   width: 220,
    // },
    // {
    //   headerName: 'Пациенты',
    //   field: 'callPatientList',
    //   sortable: true,
    //   filter: true,
    //   width: 200,
    //   valueGetter: params => {
    //     if (params.data.callPatientList && params.data.callPatientList.length) {
    //       let pat = '';
    //       if (!params.data.callPatientList[0].call) {
    //         return ' ';
    //       }
    //       params.data.callPatientList.forEach(
    //         p => {
    //           pat = pat + p.patientFK.surname + ' ' + p.patientFK.name + ', ';
    //         }
    //       );
    //       pat = pat.slice(0, -2);
    //       return pat;
    //     } else {
    //       return ' ';
    //     }
    //   },
    // },
    // {
    //   headerName: 'Бригады',
    //   field: 'brigades',
    //   sortable: true,
    //   filter: true,
    //   width: 180,
    //   valueGetter: params => {
    //     if (!params.data.assignedBrigadeList[0].call) {
    //       return ' ';
    //     }
    //     let bris = '';
    //     params.data.assignedBrigadeList.forEach(
    //       b => {
    //         bris = bris + b.brigadeFK.name + ', ';
    //       }
    //     );
    //     bris = bris.slice(0, -2);
    //     return bris;
    //   },
    // },
    // {
    //   headerName: 'Сотрудник',
    //   field: 'performerFK.name',
    //   valueGetter: params => params.data.performerFK.surname + ' ' + params.data.performerFK.name + ' ' + params.data.performerFK.patronymic,
    //   sortable: true,
    //   filter: true,
    //   width: 180,
    // },
  ];
  filters: any = {};
  form: FormGroup;
  descriptions: ISimpleDescription[] = [
    {
      key: 'surname',
      label: 'Фамилия',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-12',
      additional: {
        block: 'patient'
      }
    },
    {
      key: 'patientType',
      label: 'Тип пациента',
      bindValue: 'id',
      type: 'dict',
      dict: 'getReferenceTypeListPatientTypeUsingGET',
      styleClass: 'col-12',
      additional: {
        block: 'patient'
      }
    },
  ];
  loading = true;
  datePipe = new DatePipe('ru');

  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm') : '-';
  }

  dataSource = {
    get: (filter, offset, count) => {
      this.loading = true;
      return this.arch.searchPatient(offset, count, filter).pipe(tap(() => this.loading = false));
    }
  };

  constructor(private arch: ArchiveService, private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  eraseFilters() {
    this.filters = {};
    this.form.reset(this.filters);
  }

  search() {
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

}
