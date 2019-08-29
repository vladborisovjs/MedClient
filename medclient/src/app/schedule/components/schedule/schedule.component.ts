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
      label: 'Графики сотрудников',
      routerLink: 'employees',
      iconClass: 'fas fa-user-md'
    },
    {
      label: 'Смены бригад',
      routerLink: 'brigades',
      iconClass: 'fas fa-ambulance'
    },
    {
      label: 'Управление бригадами',
      routerLink: 'brigades-control',
      iconClass: 'fas fa-cog'
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
