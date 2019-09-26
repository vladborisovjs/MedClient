import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef} from 'ag-grid-community';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {DatePipe} from '@angular/common';
import {BrigadeBean} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-modal-call-f110',
  templateUrl: './modal-call-f110.component.html',
  styleUrls: ['./modal-call-f110.component.scss']
})
export class ModalCallF110Component implements OnInit, OnDestroy {
  @Input() brigade: BrigadeBean;
  @Input() callId: number;
  colDefs: ColDef[] = [
    // {
    //   headerName: 'id',
    //   field: 'id',
    //   sortable: true,
    //   filter: true,
    //   width: 80
    // },
    {
      headerName: '№',
      field: 'id',
      sortable: true,
      filter: true,
      width: 80
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
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      sortable: true,
      filter: true
    }
  ];
  listSource = [];
  sbscs: Subscription[] = [];
  datePipe = new DatePipe('ru');
  constructor(private router: Router,
              private route: ActivatedRoute,
              private ns: NotificationsService,
              private modalInstance: NgbActiveModal,
              private cs: CallItemService,) {
  }

  ngOnInit() {
    this.sbscs.push(
      this.cs.getBrigadesCards(this.brigade.id, this.callId).subscribe(
        list => {
          console.log(list);
          this.listSource = list.list;
        }
      )
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  gotoCard(card = null) {
    console.log(card);
    const cardId = card ? card.data.id : 0;
    this.modalInstance.close(`card/${cardId}`)
  }

  createCard() {
    console.log(this);
    this.sbscs.push(
      this.cs.createCallCard(this.brigade, this.callId).subscribe(
        card => {
          console.log(card);
          this.ns.success('Успешно', `Создана Ф-110 № ${card.id}`);
          this.router.navigateByUrl(`calls/${this.callId}/card/${card.id}`);
          this.modalInstance.close(`card/${card.id}`)
        }
      )
    );
  }

  cancel() {
    this.modalInstance.dismiss();
  }

}
