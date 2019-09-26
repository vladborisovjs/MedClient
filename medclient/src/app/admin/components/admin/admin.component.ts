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
  ];
  constructor() { }

  ngOnInit() {
  }

}
