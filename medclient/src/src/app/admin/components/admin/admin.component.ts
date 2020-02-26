import { Component, OnInit } from '@angular/core';
import {ICardMenuItem} from '../../../navigation/components/card-menu/card-menu.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'Сотрудники',
      routerLink: 'users',
      iconClass: 'fas fa-users-cog'
    },
    {
      label: 'Конфигурация ЦОВ',
      routerLink: 'operator-info',
      iconClass: 'far fa-file-code'
    },
    {
      label: 'Журнал',
      routerLink: 'logs',
      iconClass: 'fas fa-list'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
