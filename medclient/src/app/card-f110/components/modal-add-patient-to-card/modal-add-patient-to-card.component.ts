import {Component, Input, OnInit} from '@angular/core';
import {CardItemService} from '../../services/card-item.service';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {FormGroup} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {DatePipe} from '@angular/common';
import {PatientBean} from '../../../../../swagger/med-api.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-add-patient-to-card',
  templateUrl: './modal-add-patient-to-card.component.html',
  styleUrls: ['./modal-add-patient-to-card.component.scss']
})
export class ModalAddPatientToCardComponent implements OnInit {
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
      return this.cas.findSimularPatient(offset, count, filter);
    }
  };

  selectedPatient: PatientBean;

  constructor(private cas: CardItemService,
              private modalInstance: NgbActiveModal,
              private sds: SimpleDescriptionService) {
  }

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

  createNewPatient(){
    let patient = {id: 0, isDeleted: false, documentList: []};
    Object.assign(Object.assign(patient, this.filterForm.getRawValue()));
    this.modalInstance.close(
      PatientBean.fromJS(patient)
    );
  }

  choosePatient(){
    this.modalInstance.close(this.selectedPatient);
  }

  back(){
    this.modalInstance.dismiss();
  }

}
