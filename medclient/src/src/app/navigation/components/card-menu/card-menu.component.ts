import {Component, Input, OnInit} from '@angular/core';
import {_AccessLevels} from "../../../models/user-roles";
import {RoleAccessService} from "../../../services/role-access.service";

export class ICardMenuItem {
  label: string;
  routerLink?;
  iconClass: string;
  accessLevel?: _AccessLevels
}

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss']
})
export class CardMenuComponent implements OnInit {
  @Input() items: ICardMenuItem[];
  @Input() headerLabel: string;
  constructor(public access: RoleAccessService) { }

  ngOnInit() {
  }

}
