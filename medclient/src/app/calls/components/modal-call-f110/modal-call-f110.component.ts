import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef} from 'ag-grid-community';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-modal-call-f110',
  templateUrl: './modal-call-f110.component.html',
  styleUrls: ['./modal-call-f110.component.scss']
})
export class ModalCallF110Component implements OnInit {
  @Input() brigade: any;
  colDefs: ColDef[] = [
    {
      headerName: 'Номер',
      field: 'number',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Бригада',
      field: 'brigade_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true
    }
  ];
  listSource: any[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private ns: NotificationsService,
              private modalInstance: NgbActiveModal,
              private cs: CallItemService,) {
  }

  ngOnInit() {
    this.cs.getBrigadesCards(this.brigade.brigade_schedule_id, this.brigade.call_id).subscribe(
      list => {
        console.log(list);
        this.listSource = list;
      }
    );
  }

  gotoCard(card = null) {
    const cardId = card ? card.data.card_id : 0;
    this.router.navigateByUrl('calls/' + this.brigade.call_id + '/card/' + cardId);
    this.modalInstance.dismiss();
  }

  createCard() {
    this.cs.createCallCard(this.brigade.brigade_schedule_id, this.brigade.call_id).subscribe(
      card => {
        this.ns.success('Успешно', 'Создана Ф-100 № ' + card.side_one.general.number);
        this.router.navigateByUrl('calls/' + this.brigade.call_id + '/brigade/' + this.brigade.brigade_schedule_id + '/'
          + card.side_one.general.card_id);
        this.modalInstance.dismiss();
      }
    );
  }

}
