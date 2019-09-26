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
      label: 'Управление авиабригадой',
      routerLink: 'requests',
      iconClass: 'fas fa-user-nurse'
    },
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
