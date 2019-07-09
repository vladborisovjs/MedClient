import { Component, OnInit } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {CallGridDto, MedApi} from '../../../../../swagger/med-api.service';
import {DatePipe} from '@angular/common';
import {CallsService} from '../../services/calls.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalCreateCallComponent} from '../modal-create-call/modal-create-call.component';

@Component({
  selector: 'app-calls-list',
  templateUrl: './calls-list.component.html',
  styleUrls: ['./calls-list.component.scss']
})
export class CallsListComponent implements OnInit {
  colDefsCalls: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      headerName: 'Статус',
      field: 'call_status_name',
      sortable: true,
      filter: true,
      width: 200,
      cellRenderer: (p) => {
        let val = p.value;
        switch (p.data.call_status) {
          case 0:
            val = '<i class="fas fa-exclamation-circle blinking text-danger"></i> ' +  p.value;
            break;
          case 1:
            val = '<i class="fas fa-exclamation-circle text-warning"></i> ' +  p.value;
            break;
          case 2:
            val = '<i class="fas fa-cog text-primary fa-spin"></i> ' +  p.value;
            break;
          case 3:
            val = '<i class="fas fa-check-circle text-success"></i> ' +  p.value;
            break;
          case 4:
            val = '<i class="fas fa-ban text-secondary"></i>  ' +  p.value;
            break;
        }
        return val;

      },
    },
    {
      headerName: 'Время',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => {
        return this.dateFormatter(p);
      },
      width: 80
    },
    {
      headerName: 'Заявитель',
      field: 'declarant_name',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Повод к вызову',
      field: 'reason_name',
      sortable: true,
      filter: true,
      width: 220,
    },
    {
      headerName: 'Адрес',
      field: 'address',
      sortable: true,
      filter: true,
      width: 220,
    },
    {
      headerName: 'Пациенты',
      field: 'patients',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Бригады',
      field: 'brigades',
      sortable: true,
      filter: true,
      width: 180,
    },
    {
      headerName: 'Сотрудник',
      field: 'performer_accept_name',
      sortable: true,
      filter: true,
      width: 180,
    },
  ];
  listSourceCalls: CallGridDto[] = [];
  datePipe = new DatePipe('ru');
  selectedCall: any;
  callsCards: any[] = [];
  listSourceCards: any[] = [];
  colDefsCards: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: true,
      filter: true,
      width: 80,
    },
    {
      headerName: 'Время',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => {
        return this.dateFormatter(p);
      },
      width: 80
    },
    {
      headerName: 'Бригада',
      field: 'brigade_name',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Повод к вызову',
      field: 'reason_name',
      sortable: true,
      filter: true,
      width: 220,
    },
    {
      headerName: 'Адрес',
      field: 'address',
      sortable: true,
      filter: true,
      width: 220,
    },
    {
      headerName: 'Район',
      field: 'district_name',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Заявитель',
      field: 'declarant_name',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Исполнитель',
      field: 'performer_name',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Отработка',
      field: 'card_status_name',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Результат',
      field: 'result_name',
      sortable: true,
      filter: true,
      width: 120,
    },

  ];
  cardLoading: boolean;
  mode: string = 'calls'; // cards
  firstLoaded  = false; // для индикатора загрузки карточек
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'HH.mm') : '-';
  }
  constructor(private api: MedApi,
              private calls: CallsService,
              private router: Router,
              private route: ActivatedRoute,
              private modal: NgbModal) { }

  ngOnInit() {
    this.calls.getCallsList().subscribe(el => {
      this.firstLoaded = true;
      this.listSourceCalls = el;
    });
    this.calls.getActiveCardsList().subscribe(l => this.listSourceCards = l);
  }

  goToCall(call) {
    console.log(call.data);
    this.router.navigate([call.data.id], {relativeTo: this.route});
  }

  createCall() {
   const cc = this.modal.open(ModalCreateCallComponent, {size: 'lg'});
   cc.result.then(
     call => {
       this.router.navigate([call.call_id], {relativeTo: this.route});
     }
   );
  }

  selectCall(e){
    console.log(e.data);
    this.callsCards = [];
    this.selectedCall = e.data;
    this.getСallCards(this.selectedCall.id);
  }

  getСallCards(callId){
    this.cardLoading = true;
    this.calls.getCallCardsList(callId).subscribe(
      cards => {
        this.callsCards = cards;
        this.cardLoading = false;
      }
    );
  }

  goToCard(card){
    console.log(card);
    this.router.navigate([card.data.call_id + '/card/' + card.data.card_id], {relativeTo: this.route});
  }

  goToArchive(){
    let command: string;
    if (this.mode === 'calls'){
      command = 'archive/calls'
    } else {
      command = 'archive/f110'
    }
    console.log(command);
    this.router.navigate([command]);
  }

  changeMode(){
    this.mode = this.mode === 'calls' ? 'cards' : 'calls'
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }


}
