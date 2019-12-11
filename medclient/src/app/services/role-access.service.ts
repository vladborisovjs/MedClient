import {Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {AccessLevels, IAccessOptions} from "../models/user-roles";
import {PerformerContainer, RoleBean} from "../../../swagger/med-api.service";

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService {
  userRoles: RoleBean[];
  user: PerformerContainer;

  constructor(private userService: UserService) {
    this.userRoles = this.userService.mePerformer.performer.roleList;
    this.user = this.userService.mePerformer;
    this.userService.authSub.subscribe(
      t =>{
        this.userRoles = this.userService.mePerformer.performer.roleList;
        this.user = this.userService.mePerformer;
      }
    );
  }

  checkAccessRead(opt: IAccessOptions): boolean {
    let access = false; // допуск по роли
    // Ищем совпадение ролей у пользователя и уровня доступа
    [...AccessLevels.find(l => l.name === opt.level).rolesR,
      ...AccessLevels.find(l => l.name === opt.level).rolesRW]
      .forEach(
        role => access = access || !!this.userRoles.find(userRole => role === userRole.code)
      );

    // Проверка на свое подразделение
    if (opt.subdivisionId !== undefined) {
      access = access && this.user.performer.subdivisionFK.id === opt.subdivisionId;
    }
    return access;
  }

  checkAccessWrite(opt: IAccessOptions): boolean {
    let access = false; // допуск по роли
    // Ищем совпадение ролей у пользователя и уровня доступа
    AccessLevels.find(l => l.name === opt.level).rolesRW.forEach(
      role => access = access || !!this.userRoles.find(userRole => role === userRole.code)
    );
    // Проверка на свое подразделение
    if (opt.subdivisionId !== undefined) {
      access = access && this.user.performer.subdivisionFK.id === opt.subdivisionId;
    }
    return access;
  }


  checkAccessForRoles(roles: string[]) {
    let access = false;
    roles.forEach(
      r => {
        if (this.userRoles.some(ur => ur.code === r)) {
          access = true;
        }
      }
    );
    return access;
  }
}
