import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CallItemService} from '../../services/call-item.service';
import {ColDef} from 'ag-grid-community';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-modal-f110',
  templateUrl: './modal-f110.component.html',
  styleUrls: ['./modal-f110.component.scss']
})
export class ModalF110Component implements OnInit, OnDestroy {
  callId: any;
  sbscs: Subscription[] = [];
  datePipe = new DatePipe('ru');
  colDefs: ColDef[] = [
    {
      headerName: '№',
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
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      sortable: true,
      filter: true
    }
  ];
  listSource: any[] = [];
  constructor(private cs: CallItemService,
              private route: ActivatedRoute,
              private modalInstance: NgbActiveModal,
              private router: Router) { }

  ngOnInit() {
    this.sbscs.push(
      this.cs.getF110(this.callId, undefined).subscribe(
      list => {
        this.listSource = list;
      }
    ),
      this.route.paramMap.subscribe(() => {
        this.callId = this.router.url;
      })
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  gotoCard(card = null) {
    console.log(this.callId);
    const cardId = card ? card.data.card_id : 0;
    this.router.navigateByUrl(this.callId + '/card/' + cardId + '/side-one');
    this.modalInstance.dismiss();
  }

  back() {
    this.modalInstance.dismiss();
  }
}
