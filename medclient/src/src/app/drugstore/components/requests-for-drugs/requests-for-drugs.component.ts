import { Component, OnInit } from '@angular/core';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {ColDef} from 'ag-grid-community';
import {DrugRequestBean} from '../../../../../swagger/med-api.service';
import {DrugRequestService} from '../../services/drug-request.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-requests-for-drugs',
  templateUrl: './requests-for-drugs.component.html',
  styleUrls: ['./requests-for-drugs.component.scss']
})
export class RequestsForDrugsComponent implements OnInit {
  requestItem: DrugRequestBean;
  colDef: ColDef[] = [
    {
      field: 'id',
      headerName: 'Номер'
    },
    {
      headerName: 'Укладка',
      field: 'bagFK.name',

    },
    {
      headerName: 'Бригада',
      field: 'bagFK.brigadeFK.name',

    },
    {
      field: 'isAccepted',
      headerName: 'Одобрена',
      cellRenderer: (p) => {
        if (p.value) {
          return '<i class="fas fa-check-square text-success"></i> Выполнена';
        } else {}
        return '';
      }
    },
  ];
  filters = {};
  drugRequestsSource: IGridTableDataSource = {
      get: (filter, offset, count) => {
        return this.drs.getDrugRequestList(filter, offset, count)
      }
    };
  constructor(private drs: DrugRequestService, private ns: NotificationsService) { }

  ngOnInit() {
  }

  updateDataSource(){
    this.drugRequestsSource = {
      get: (filter, offset, count) => {
        return this.drs.getDrugRequestList(filter, offset, count)
      }
    };
  }


  selectRequest(e){
    this.requestItem = e.data;
    console.log(this.requestItem);
  }

  deleteRequest(){
    this.drs.deleteRequest(this.requestItem.id).subscribe(
      res => {
        this.ns.success('Успешно', 'Заявка удалена');
        this.requestItem = null;
        this.updateDataSource();
      },
      error1 => {
        this.ns.error('Ошибка', 'Не удалось удалить заявку')
      }
    );
  }

  acceptRequest(){
    this.drs.rechargeBag(this.requestItem.id).subscribe(
      res => {
        this.ns.success('Успешно', 'Укладка пополнена');
        this.requestItem = res;
        this.updateDataSource();
      },
      error1 => {
        this.ns.error('Ошибка', 'Не удалось пополнить укладку')
      }
    );
  }

}
