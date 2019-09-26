import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {CardItemService} from '../../services/card-item.service';
import {NotificationsService} from 'angular2-notifications';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';

@Component({
  selector: 'app-f110',
  templateUrl: './f110.component.html',
  styleUrls: ['./f110.component.scss']
})
export class F110Component implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  cardInfoSideOne: any;

  hotkeys: Hotkey[] = [
    new Hotkey('alt+1', () => {
      this.router.navigate(['side-one'], {relativeTo: this.route});
      return false;
    }),
    new Hotkey('alt+2', () => {
      this.router.navigate(['patient'], {relativeTo: this.route});
      return false;
    }),
    new Hotkey('alt+3', () => {
      this.router.navigate(['anamnesis'], {relativeTo: this.route});
      return false;
    }),
    new Hotkey('alt+4', () => {
      this.router.navigate(['side-two'], {relativeTo: this.route});
      return false;
    }),
    new Hotkey('alt+5', () => {
      this.router.navigate(['result'], {relativeTo: this.route});
      return false;
    }),
    new Hotkey('shift+s', () => {
      this.cas.saveCard();
      return false;
    }),
  ];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cmodal: CustomModalService,
    private cas: CardItemService,
    private hotkeysService: HotkeysService,
    private ns: NotificationsService) {
    this.hotkeys.forEach(key => this.hotkeysService.add(key));
  }

  ngOnInit() {
    this.sbscs.push(
      this.route.data.subscribe(data => {
        this.cardInfoSideOne = data;
        console.log(this.cardInfoSideOne);

      })
    );
  // console.log('cardId', this.route.snapshot.url[0].path);
  // console.log('callId', this.route.parent.parent.snapshot.url[0].path);
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  saveCard(){
    if (this.cas.formResult || this.cas.formTypeResult) {
      this.ns.error('Ошибка заполнения формы результата', 'Данные не сохранены');
    }
    if(this.cas.formObjectives) {
      this.ns.error('Ошибка заполнения формы объективных данных', 'Данные не сохранены');
    }
    if (this.cas.formPatient) {
      this.ns.error('Ошибка заполнения формы пациента', 'Данные не сохранены');
    }
    if (!this.cas.formResult && !this.cas.formObjectives && !this.cas.formPatient && !this.cas.formTypeResult) {
      this.cas.saveCard();
    }
  }


}
