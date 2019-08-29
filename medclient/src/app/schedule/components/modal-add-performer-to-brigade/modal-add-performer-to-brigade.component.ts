import {Component, Input, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {ScheduleService} from '../../services/schedule.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-modal-add-performer-to-brigade',
  templateUrl: './modal-add-performer-to-brigade.component.html',
  styleUrls: ['./modal-add-performer-to-brigade.component.scss']
})
export class ModalAddPerformerToBrigadeComponent implements OnInit {
  @Input() bFrom: any;
  @Input() bTo: any;
  @Input() brigade: any;
  selectedPerformer: any;
  performerItem: any;


  desc: ISimpleDescription[] = [
    {
      label: 'Группа: ',
      key: 'gCode',
      type: 'select',
      selectList: [
        {name: 'Медик', id: 0},
        {name: 'Водитель', id: 1},
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
      valueGetter: params => params.data.first.surname + ' ' + params.data.first.name + ' ' + params.data.first.patronymic,
      width: 300
    },
    {
      headerName: 'Должность',
      field: 'first.typeFK.name',
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
      gCode: 0
    };
    this.updatePerfomers();
    this.form = this.sds.makeForm(this.desc);
    this.form.reset(this.performerItem);
    this.form.valueChanges.pipe(debounceTime(300)).subscribe(
      ch => {
        this.performerItem.from = ch.from;
        this.performerItem.to = ch.to;
        this.performerItem.gCode = ch.gCode;
        this.updatePerfomers();
      }
    );
  }

  updatePerfomers(){
    this.schs.getAvailablePerformers(this.performerItem.gCode, this.performerItem.from.toISOString(), this.performerItem.to.toISOString()).subscribe(
      per => {
        this.pSource = per;
      }
    );
  }

  selectPerformer(e){
    this.selectedPerformer = e.data;
  }

  addPerformer(){
    this.selectedPerformer.second[0].performerFK = this.selectedPerformer.first;
    this.modalInstance.close(this.selectedPerformer);
  }

  back(){
    this.modalInstance.dismiss();
  }
}
