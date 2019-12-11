import { Component, OnInit } from '@angular/core';
import {ICardMenuItem} from "../../../navigation/components/card-menu/card-menu.component";

@Component({
  selector: 'app-shift-control',
  templateUrl: './shift-control.component.html',
  styleUrls: ['./shift-control.component.scss']
})
export class ShiftControlComponent implements OnInit {
  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'Графики сотрудников',
      routerLink: 'performers',
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
