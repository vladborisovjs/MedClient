import {Component, Input, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {ScheduleService} from '../../services/schedule.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-add-performer-to-brigade',
  templateUrl: './modal-add-performer-to-brigade.component.html',
  styleUrls: ['./modal-add-performer-to-brigade.component.scss']
})
export class ModalAddPerformerToBrigadeComponent implements OnInit {
  @Input() bFrom: any;
  @Input() bTo: any;
  selectedPerformer: any;
  performerItem: any;


  desc: ISimpleDescription[] = [
    {
      label: 'Группа: ',
      key: 'gCode',
      type: 'select',
      selectList: [
        {name: 'Медик', id: 'MEDIC'},
        {name: 'Водитель', id: 'DRIVER'},
        ],
      styleClass: 'line-form col-12'
    },
    {
      label: 'c: ',
      key: 'from',
      type: 'date',
      styleClass: 'line-form col-12'
    },
    {
      label: 'по: ',
      key: 'to',
      type: 'date',
      styleClass: 'line-form col-12'
    },
  ];

  pColDef: ColDef[] = [
    {
      headerName: 'Сотрудник',
      valueGetter: params => params.data.second_name + ' ' + params.data.first_name + ' ' + params.data.patronymic,
      width: 300
    },
    {
      headerName: 'Должность',
      field: 'type_name',
      width: 150
    }
  ];
  pSource = [];
  form: FormGroup;
  constructor(private sds: SimpleDescriptionService,
              private schs: ScheduleService,
              private modalInstance: NgbActiveModal) { }

  ngOnInit() {
    this.performerItem = {
      from: this.bFrom,
      to: this.bTo,
      gCode: 'MEDIC'
    };
    this.updatePerfomers();
    this.form = this.sds.makeForm(this.desc);
    this.form.reset(this.performerItem);
    this.form.valueChanges.subscribe(
      ch => {
        this.performerItem.from = ch.from;
        this.performerItem.to = ch.to;
        this.performerItem.gCode = ch.gCode;
        this.updatePerfomers();
      }
    );
  }

  updatePerfomers(){
    this.schs.getAvailablePerformers(this.performerItem.from.toISOString(), this.performerItem.to.toISOString(), this.performerItem.gCode).subscribe(
      per => {
        this.pSource = per;
      }
    );
  }

  selectPerformer(e){
    this.selectedPerformer = e.data;
  }

  addPerformer(){
    this.selectedPerformer.period_details = {
      date_from: this.performerItem.from,
      date_to: this.performerItem.to
    };
    // console.log('sel', this.selectedPerformer);
    this.modalInstance.close(this.selectedPerformer);
  }

  back(){
    this.modalInstance.dismiss();
  }
}
