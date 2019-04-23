import { Component, OnInit } from '@angular/core';
import {ICardMenuItem} from '../../../navigation/components/card-menu/card-menu.component';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'Вызовы',
      routerLink: '/calls',
      iconClass: 'fas fa-phone'
    },
    {
      label: 'График работы',
      routerLink: '/schedule',
      iconClass: 'far fa-calendar-alt'
    },
    {
      label: 'Справочники',
      routerLink: '/dictionaries',
      iconClass: 'fas fa-book-medical'
    },
    {
      label: 'Справочники',
      routerLink: '/dictionaries',
      iconClass: 'fas fa-book'
    },
    {
      label: 'Отчеты',
      routerLink: '/reports',
      iconClass: 'fas fa-file-alt'
    },
    {
      label: 'Карта',
      routerLink: '/map',
      iconClass: 'fas fa-map-marked-alt'
    },
    {
      label: 'Аптека',
      routerLink: '/drugstore',
      iconClass: 'fas fa-medkit'
    },
    {
      label: 'Администирование',
      routerLink: '/admin',
      iconClass: 'fas fa-cogs'
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
