import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../services/requests.service';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {ColDef} from 'ag-grid-community';
import {AviaRequestBean} from '../../../../../swagger/med-api.service';
import {NotificationsService} from 'angular2-notifications';
import {FormGroup} from '@angular/forms';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {take} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalRejectRequestComponent} from "../modal-reject-request/modal-reject-request.component";
import {DatePipe} from "@angular/common";
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-avia-requets',
  templateUrl: './avia-requets.component.html',
  styleUrls: ['./avia-requets.component.scss']
})
export class AviaRequetsComponent implements OnInit {
  dataSource: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.requestService.getRequestList(offset, count, filter);
    }
  };
  filter = {};
  datePipe = new DatePipe('ru');
  colDef: ColDef[]=[
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      width: 200
    },
    {
      headerName: 'Тип',
      field: 'isInterHospital',
      valueFormatter: (data) => {
        if (data.value){
          return 'Мед. эвакуация';
        } else {
          return 'Транспортировка';
        }
      }
    },
    {
      headerName: 'Описание',
      field: 'description'
    },
    {
      headerName: 'Обработано',
      field: 'isAccept',
      cellRenderer: (data) => {
        if (data.value === true){
          return '<i class="fas fa-check-square text-success"></i> Одобрено';
        } else  if (data.value === false){
          return '<i class="fas fa-times text-secondary"></i> Отклонена';
        } else {
          return '<i class="fas fa-exclamation-circle text-danger"></i> Не обработана';
        }
      }
    }
  ];
  requestItem: AviaRequestBean ;
  form: FormGroup;
  availableBrigades = [];
  descriptions:ISimpleDescription[] = [
    {
      label: 'Описание',
      key: 'description',
      type: 'textarea',
      rows: 4
    },
    {
      label: 'Бригада',
      key: 'brigadeFK',
      type: 'select',
      selectList: this.availableBrigades,
      styleClass: 'col-5',
      required: true
    },
    {
      label: 'Пункт транспортировки',
      key: 'destinationSubdivisionFK',
      type: 'dict',
      dict: 'getSubdivisionListUsingGET',
      dictFilters: {deleted: false, type: [1558]},
      dictFiltersOrder: [ 'type'],
      styleClass: 'col-7',
      required: true
    },
    {
      label: 'Состав Авиабригады',
      key: 'crew',
      type: 'textarea'
    }
  ];



  constructor(private requestService: RequestsService,
              private ns: NotificationsService,
              private modal: NgbModal,
              private user: UserService,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.requestService.getAvailablebrigades().pipe(take(1)).subscribe(
      res => {
        res.forEach(
          el => {
            console.log(el);
            this.availableBrigades.push({id: el.brigade, name: el.brigade.name});
          }
        );
        console.log(this.availableBrigades)
      }
    );
  }

  updateDataSource(){
    this.dataSource = {
      get: (filter, offset, count) => {
        return this.requestService.getRequestList(offset, count, filter);
      }
    };
  }

  selectRequest(e){
    this.requestItem = e.data;
    this.form.reset(this.requestItem);
    console.log(this.requestItem);
  }

  acceptRequest(){
    console.log(JSON.stringify(Object.assign(this.requestItem, this.form.getRawValue())));
    console.log(this.requestItem);
    this.requestService.updateRequest(Object.assign(this.requestItem, this.form.getRawValue(), {approvedPerformerFK: this.user.mePerformer.performer}), true).subscribe(
      res => {
        this.requestItem = res;
        this.updateDataSource();
        this.ns.success('Успешно', 'Заявка одобрена');
      }
    );
  }

  rejectRequest(){
    const rejectModal = this.modal.open(ModalRejectRequestComponent);
    rejectModal.result.then(
      reason => {
        if (reason) {
          this.requestItem.description += `       \n Отказ: \n` + reason.description;
          this.requestService.updateRequest(this.requestItem, false).subscribe(
            res => {
              this.requestItem = res;
              this.updateDataSource();
              this.ns.success('Успешно', 'Заявка отклонена');
            }
          );
        }
      },
      err => {}
    );
  }

}
