import {Component, Input, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ScheduleService} from '../../services/schedule.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-add-transport-to-brigade',
  templateUrl: './modal-add-transport-to-brigade.component.html',
  styleUrls: ['./modal-add-transport-to-brigade.component.scss']
})
export class ModalAddTransportToBrigadeComponent implements OnInit {
  @Input() bFrom: any;
  @Input() bTo: any;
  selectedTransport: any;
  transportItem: any;

  desc: ISimpleDescription[] = [
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

  tColDef: ColDef[] = [
    {
      headerName: 'Машина',
      field: 'brand',
      width: 250
    },
    {
      headerName: 'Номер',
      field: 'statemark',
      width: 250
    }
  ];
  tSource = [];
  form: FormGroup;


  constructor(private sds: SimpleDescriptionService,
              private schs: ScheduleService,
              private modalInstance: NgbActiveModal) {
  }

  ngOnInit() {
    this.transportItem = {
      from: this.bFrom,
      to: this.bTo,
    };
    this.updateTransport();
    this.form = this.sds.makeForm(this.desc);
    this.form.reset(this.transportItem);
    this.form.valueChanges.subscribe(
      ch => {
        this.transportItem.from = ch.from;
        this.transportItem.to = ch.to;
        this.updateTransport();
      }
    );
  }

  updateTransport(){
    this.schs.getAvailableTranspots(this.transportItem.from.toISOString(), this.transportItem.to.toISOString()).subscribe(
      t => {
        console.log(t);
        this.tSource = t;
      }
    )
  }

  selectTransport(e){
    this.selectedTransport = e.data;
  }

  addTransport(){
    this.selectedTransport.period_details = {
      date_from: this.transportItem.from,
      date_to: this.transportItem.to
    };
    this.modalInstance.close(this.selectedTransport);
  }

  back(){
    this.modalInstance.dismiss();
  }

}
