import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {CallBean, CallContainer, CallDto} from '../../../../../swagger/med-api.service';
import {CallItemService} from '../../services/call-item.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ISimpleDescription} from '../../../shared/simple-control/services/simple-description.service';
import {ModalCallConfirmBrigadeComponent} from '../modal-call-confirm-brigade/modal-call-confirm-brigade.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-modal-call-appoint-brigade',
  templateUrl: './modal-call-appoint-brigade.component.html',
  styleUrls: ['./modal-call-appoint-brigade.component.scss']
})
export class ModalCallAppointBrigadeComponent implements OnInit, OnDestroy {
  @Input() callItem: CallContainer;
  colDefs: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'brigade.name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Специализация',
      field: 'brigade.brigadeTypeFK.code',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Статус',
      field: 'brigade.brigadeStatusFK.name',
      sortable: true,
      filter: true
    },
    // {
    //   headerName: 'Дистанция',
    //   field: 'distanse',
    //   sortable: true,
    //   filter: true
    // },
    // {
    //   headerName: 'Время',
    //   field: 'time',
    //   sortable: true,
    //   filter: true
    // },
  ];
  findBriControls = new FormGroup({
    radius: new FormControl('')
  });
  selectedBris: any[] = [];
  listSource: any[] = [];
  radius = 0;
  sbscs: Subscription[] = [];
  constructor(private cs: CallItemService,
              private modalInstance: NgbActiveModal,
              private modal: NgbModal) { }

  ngOnInit(){
    console.log(this.callItem);
    this.updateListSource();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  updateListSource(){
    this.sbscs.push(
      this.cs.findBrigadesToAppoint().subscribe(
        list => {
          this.listSource = list;
          console.log(this.listSource, this.callItem.brigadeList);
          this.listSource = this.listSource.filter( // фильтрация по уже назначенным бригадам
            bri => {
              let f = true;
              this.callItem.brigadeList.forEach(bl => {
                if (bri.brigade.id === bl.brigade.id){
                  return f = false;
                }
              });
              return f;
            }
          );
        }
      )
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

  // old
  // appoint(){
  //   const confirm = this.modal.open(ModalCallConfirmBrigadeComponent);
  //   confirm.componentInstance.brigades = this.selectedBris;
  //   confirm.componentInstance.callId = this.callItem.general.call_id;
  //   confirm.result.then(
  //     success => {
  //       this.modalInstance.close();
  //     },
  //     rej => {
  //       this.updateListSource();
  //     }
  //   )
  // }

  appoint(){
    this.modalInstance.close(this.selectedBris);
  }



  back() {
    this.modalInstance.dismiss();
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

}
