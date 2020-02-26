import {Component, Input, OnInit} from '@angular/core';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from "../../../shared/simple-control/services/simple-description.service";
import {FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {ColDef} from "ag-grid-community";
import {IGridTableDataSource} from "../../../shared/grid-table/components/grid-table/grid-table.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CallItemService} from "../../services/call-item.service";
import {PatientBean} from "../../../../../swagger/med-api.service";

@Component({
  selector: 'app-modal-call-patient-archive',
  templateUrl: './modal-call-patient-archive.component.html',
  styleUrls: ['./modal-call-patient-archive.component.scss']
})
export class ModalCallPatientArchiveComponent implements OnInit {

  @Input() filter: any = {};

  filterDescriptions: ISimpleDescription[] = [
    {
      label: 'Фамилия:',
      key: 'surname',
      type: 'text',
      styleClass: 'col-12 line-form',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Имя:',
      key: 'name',
      type: 'text',
      styleClass: 'col-12 line-form',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Отчество:',
      key: 'patronymic',
      type: 'text',
      styleClass: 'col-12 line-form',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Пол:',
      key: 'gender',
      type: 'select',
      selectList: [
        {name: 'Не указан', id: null},
        {name: 'Мужской', id: true},
        {name: 'Женский', id: false},
      ],
      styleClass: 'col-12 line-form',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Лет:',
      key: 'ageYears',
      type: 'number',
      styleClass: 'col-12 line-form',
      additional: {
        block: 'patient'
      }

    },
    {
      label: 'Месяцев:',
      key: 'ageMonths',
      type: 'number',
      styleClass: 'col-12 line-form',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Дней:',
      key: 'ageDays',
      type: 'number',
      styleClass: 'col-12 line-form',
      additional: {
        block: 'patient'
      }
    },
  ];
  filterForm: FormGroup;

  datePipe = new DatePipe('ru');
  colDef: ColDef[] = [
    {
      headerName: 'Фамилия',
      field: 'surname'
    },
    {
      headerName: 'Имя',
      field: 'name'
    },
    {
      headerName: 'Отчество',
      field: 'patronymic'
    },
    {
      headerName: 'Дата рождения',
      field: 'birthday',
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy'),
    },
    // {
    //   headerName: 'Кол-во карт',
    //   field: 'cardCount'
    // },
  ];
  source: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.cs.findSimularPatient(offset, count, filter);
    }
  };

  selectedPatient: PatientBean;

  constructor( private modalInstance: NgbActiveModal,
               public cs: CallItemService,
               private sds: SimpleDescriptionService) { }

  ngOnInit() {
    this.filterForm = this.sds.makeForm(this.filterDescriptions);
    this.filterForm.reset(this.filter);
    this.filterForm.valueChanges.subscribe(
      ch => {
        this.selectedPatient = null;
        this.filter = ch;
      }
    );
  }

  selectPatient(e)
  {
    this.selectedPatient  = e.data;
  }

  choosePatient(){
    this.modalInstance.close(this.selectedPatient);
  }

  back(){
    this.modalInstance.dismiss();
  }

}
