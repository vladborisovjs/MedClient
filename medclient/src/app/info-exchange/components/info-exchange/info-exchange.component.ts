import { Component, OnInit } from '@angular/core';
import {ICardMenuItem} from '../../../navigation/components/card-menu/card-menu.component';

@Component({
  selector: 'app-info-exchange',
  templateUrl: './info-exchange.component.html',
  styleUrls: ['./info-exchange.component.scss']
})
export class InfoExchangeComponent implements OnInit {
  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'ЕГИСЗ',
      routerLink: 'egisz',
      iconClass: 'fas fa-laptop-medical'
    },
    {
      label: '112',
      routerLink: 'mchs-112',
      iconClass: 'fas fa-phone'
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
