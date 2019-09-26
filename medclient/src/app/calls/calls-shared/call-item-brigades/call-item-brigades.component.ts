import {Component, OnInit} from '@angular/core';
import {CallContainer} from '../../../../../swagger/med-api.service';
import {ModalCallAppointBrigadeComponent} from '../modal-call-appoint-brigade/modal-call-appoint-brigade.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {NotificationsService} from 'angular2-notifications';
import {CallItemService} from '../../services/call-item.service';
import {Subscription} from 'rxjs';
import {ModalCallBrigadeStatusesComponent} from '../modal-call-brigade-statuses/modal-call-brigade-statuses.component';
import {ModalCallF110Component} from '../modal-call-f110/modal-call-f110.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-call-item-brigades',
  templateUrl: './call-item-brigades.component.html',
  styleUrls: ['./call-item-brigades.component.scss'],
})
export class CallItemBrigadesComponent implements OnInit {
  callContainer: CallContainer;
  sbscs: Subscription[] = [];
  constructor(private modal: NgbModal,
              private route: ActivatedRoute,
              private router: Router,
              private cmodal: CustomModalService,
              private ns: NotificationsService,
              private cs: CallItemService) {
  }

  ngOnInit() {
    this.sbscs.push(
      this.cs.callItemSub.subscribe(
        call => {
          this.callContainer = call;
          console.log(call);
        }
      ),
    );

  }

  appointBrigade() {
    const appointModal = this.modal.open(ModalCallAppointBrigadeComponent, {size: 'lg'});
    appointModal.componentInstance.callItem = this.callContainer;
    appointModal.result.then(
      res => {
        this.callContainer.brigadeList.push(...res);
        this.cs.saveCall().subscribe(
          x => {
            this.ns.success('Успешно', `Бригада ${res[0].brigade.name} назначена на вызов!`)
          }
        );
      }
    );
  }

  openBriStatuses(brigade) {
    const briStatuses = this.modal.open(ModalCallBrigadeStatusesComponent);
    briStatuses.componentInstance.brigade = brigade;
    briStatuses.componentInstance.call = this.callContainer.call;
    briStatuses.result.then(res => {
      if (res) {
        this.cs.updateCall().subscribe( // todo: зачем апдейт?
          g => console.log(g)
        );
      }
    });
  }

  openBri110(brigade) {
    const cardsList = this.modal.open(ModalCallF110Component);
    cardsList.componentInstance.brigade = brigade;
    cardsList.componentInstance.callId = this.callContainer.call.id;
    cardsList.result.then(
      res => {
        if (res){
          console.log(res);
          this.router.navigate([res], {relativeTo: this.route});
        }
      }
    );
  }

  removeBrigade(brigade) {
    this.cmodal.confirm('Снятние бригады', `Снять бригаду ${brigade.name} с вызова?`).then(
      res => {
        if (res) {
          this.callContainer.brigadeList.splice(this.callContainer.brigadeList.findIndex(val => val === brigade), 1);
          this.cs.saveCall().subscribe(
            res => {
              this.ns.success('Успешно', `Бригада ${brigade.name} снята с вызова`)
            }
          );
        }
      }
    );
  }
}
