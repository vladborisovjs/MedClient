import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PerformerContainer} from '../../../../../swagger/med-api.service';
import {_AccessLevels} from "../../../models/user-roles";
import {RoleAccessService} from "../../../services/role-access.service";

export class IMenuItem {
  label: string;
  routerLink?;
  items?: IMenuItem[];
  iconClass?: string;
  accessLevel?: _AccessLevels
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  isCollapsed = true;
  @Input() items: IMenuItem[];
  @Input() performer: PerformerContainer;
  @Output() onExit = new EventEmitter();

  constructor(public access: RoleAccessService) { }

  ngOnInit() {
  }

}
