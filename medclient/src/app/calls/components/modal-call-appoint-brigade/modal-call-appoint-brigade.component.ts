import {Component, Input, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {CallDto} from '../../../../../swagger/med-api.service';
import {CallItemService} from '../../services/call-item.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ISimpleDescription} from '../../../shared/simple-control/services/simple-description.service';
import {ModalCallConfirmBrigadeComponent} from '../modal-call-confirm-brigade/modal-call-confirm-brigade.component';

@Component({
  selector: 'app-modal-call-appoint-brigade',
  templateUrl: './modal-call-appoint-brigade.component.html',
  styleUrls: ['./modal-call-appoint-brigade.component.scss']
})
export class ModalCallAppointBrigadeComponent implements OnInit {
  @Input() callItem: CallDto;
  colDefs: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Спец.',
      field: 'br_type_code',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Статус',
      field: 'brigade_status_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Дистанция',
      field: 'distanse',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Время',
      field: 'time',
      sortable: true,
      filter: true
    },
  ];
  findBriControls = new FormGroup({
    radius: new FormControl('')
  });
  selectedBris: any[] = [];
  listSource: any[] = [];
  radius = 0;
  constructor(private cs: CallItemService,
              private modalInstance: NgbActiveModal,
              private modal: NgbModal) { }

  ngOnInit(){
    this.updateListSource();
  }

  updateListSource(){
    this.cs.findBrigadesToAppoint(this.callItem.general.call_id, this.radius).subscribe(
      list => {
        this.listSource = list;
      }
    );
  }

  findBri(){
    this.radius = this.findBriControls.getRawValue()['radius'];
    this.updateListSource();
  }

  selectBri(e){
    console.log(e);
    this.selectedBris = e;
  }

  appoint(){
    const confirm = this.modal.open(ModalCallConfirmBrigadeComponent);
    confirm.componentInstance.brigades = this.selectedBris;
    confirm.componentInstance.callId = this.callItem.general.call_id;
    confirm.result.then(
      success => {
        this.modalInstance.close();
      },
      rej => {
        this.updateListSource();
      }
    )
  }

  back() {
    this.modalInstance.dismiss();
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

}
