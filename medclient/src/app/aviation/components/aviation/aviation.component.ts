import {Component, OnInit} from '@angular/core';
import {ICardMenuItem} from '../../../navigation/components/card-menu/card-menu.component';

@Component({
  selector: 'app-aviation',
  templateUrl: './aviation.component.html',
  styleUrls: ['./aviation.component.scss']
})
export class AviationComponent implements OnInit {
  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'Заявки на авиацию',
      routerLink: 'requests',
      iconClass: 'far fa-list-alt'
    },
    {
      label: 'Графики сотрудников авиабригад',
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

  constructor() {
  }

  ngOnInit() {
  }

}
