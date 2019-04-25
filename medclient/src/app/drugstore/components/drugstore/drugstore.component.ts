import { Component, OnInit } from '@angular/core';
import {ICardMenuItem} from '../../../navigation/components/card-menu/card-menu.component';

@Component({
  selector: 'app-drugstore',
  templateUrl: './drugstore.component.html',
  styleUrls: ['./drugstore.component.scss']
})
export class DrugstoreComponent implements OnInit {
  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'Отслеживание',
      routerLink: 'monitoring-drugstore',
      iconClass: 'fas fa-eye'
    },
    {
      label: 'Управление',
      routerLink: 'managing-drugstore',
      iconClass: 'fas fa-cog'
    },
    {
      label: 'Редактирование',
      routerLink: 'edition-drugstore',
      iconClass: 'fas fa-file-signature'
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
