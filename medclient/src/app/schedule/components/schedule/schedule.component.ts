import { Component, OnInit } from '@angular/core';
import {ICardMenuItem} from '../../../navigation/components/card-menu/card-menu.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'Сотрудники',
      routerLink: 'employees',
      iconClass: 'fas fa-user-md'
    },
    {
      label: 'Бригады',
      routerLink: 'brigades',
      iconClass: 'fas fa-user-friends'
    },
    {
      label: 'Управление бригадами',
      routerLink: 'brigades-control',
      iconClass: 'fas fa-users-cog'
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
