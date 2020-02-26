import {Component, OnDestroy, OnInit} from '@angular/core';
import {BrigadeBean, CallContainer} from '../../../../../swagger/med-api.service';
import {ModalCallAppointBrigadeComponent} from '../modal-call-appoint-brigade/modal-call-appoint-brigade.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {NotificationsService} from 'angular2-notifications';
import {CallItemService} from '../../services/call-item.service';
import {Subscription} from 'rxjs';
import {ModalCallBrigadeStatusesComponent} from '../modal-call-brigade-statuses/modal-call-brigade-statuses.component';
import {ModalCallF110Component} from '../modal-call-f110/modal-call-f110.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalCallBrigadeRemoveComponent} from "../modal-call-brigade-remove/modal-call-brigade-remove.component";

@Component({
  selector: 'app-call-item-brigades',
  templateUrl: './call-item-brigades.component.html',
  styleUrls: ['./call-item-brigades.component.scss'],
})
export class CallItemBrigadesComponent implements OnInit, OnDestroy {
  callContainer: CallContainer;
  sbscs: Subscription[] = [];
  isEdit: boolean;
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
      this.cs.isEditingSub.subscribe(
        editing => this.isEdit = editing
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
    const cardsList = this.modal.open(ModalCallF110Component, {size: 'lg'});
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

  removeBrigade(brigade: BrigadeBean) {
    const rb = this.modal.open(ModalCallBrigadeRemoveComponent);
    rb.componentInstance.brigade = brigade;
    rb.result.then(
      reason => {
        if (reason) {
          this.cs.removeBrigade(this.callContainer.call.id, brigade.id, reason).subscribe(
            res => {
              this.ns.success('Успешно', `Бригада ${brigade.name} снята с вызова`)
            }
          );
        }
      }
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }
}
