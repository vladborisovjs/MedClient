import { Component, OnInit } from '@angular/core';
import {ICardMenuItem} from '../../../navigation/components/card-menu/card-menu.component';

@Component({
  selector: 'app-aviation-schedule',
  templateUrl: './aviation-schedule.component.html',
  styleUrls: ['./aviation-schedule.component.scss']
})
export class AviationScheduleComponent implements OnInit {
  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'Графики сотрудников авиабригада',
      routerLink: 'employees',
      iconClass: 'fas fa-user-md'
    },
    {
      label: 'Смены авиабригад',
      routerLink: 'brigades',
      iconClass: 'fas fa-helicopter'
    },
    {
      label: 'Управление авиабригадами',
      routerLink: 'brigades-control',
      iconClass: 'fas fa-cog'
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
