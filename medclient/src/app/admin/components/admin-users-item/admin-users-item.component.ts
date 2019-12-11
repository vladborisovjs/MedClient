import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminUsersService} from '../services/admin-users.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormControl, FormGroup} from '@angular/forms';
import {PerformerBean, RecordType} from '../../../../../swagger/med-api.service';
import {NotificationsService} from 'angular2-notifications';
import {Subscription} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {RoleAccessService} from "../../../services/role-access.service";
import {LogService} from "../../../shared/logs/log.service";

@Component({
  selector: 'app-admin-users-item',
  templateUrl: './admin-users-item.component.html',
  styleUrls: ['./admin-users-item.component.scss']
})
export class AdminUsersItemComponent implements OnInit, OnDestroy {
  userItem: PerformerBean;
  samePassword: boolean;
  descriptions: ISimpleDescription[] = [
    {
      label: 'Фамилия:',
      key: 'surname',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      required: true,
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Имя:',
      key: 'name',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      required: true,
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Отчество:',
      key: 'patronymic',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      required: true,
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Должность:',
      key: 'typeFK',
      dict: 'getPerformerTypeListUsingGET',
      type: 'dict',
      required: true,
      styleClass: 'col-6',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Группа:',
      key: 'typeFK',
      dict: 'getPerformerTypeListUsingGET',
      bindLabel: 'groupName',
      type: 'dict',
      alwaysDisabled: true,
      styleClass: 'col-6',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Телефон:',
      key: 'phone',
      type: 'mask',
      styleClass: 'col-6',
      additional: {
        block: 'general'
      }
    },

    {
      label: 'Специализация:',
      key: 'specializationFK',
      dict: 'getSkillListUsingGET',
      type: 'dict',
      styleClass: 'col-6',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Район:',
      key: 'subdivisionFK',
      type: 'dict',
      dict: 'getDistrictListUsingGET',
      bindLabel: 'shortName',
      shortDict: true,
      dictFilters: {rootId: [this.user.mePerformer.performer.subdivisionFK.id]},
      dictFiltersOrder: ['rootId'],
      required: true,
      errorText: 'Обязательное поле',
      styleClass: 'col-12',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Логин:',
      key: 'username',
      type: 'text',
      styleClass: 'col-12',
      additional: {
        block: 'login'
      }
    },
    {
      label: 'Новый пароль:',
      key: 'clearPassword',
      type: 'password',
      styleClass: 'col-12',
      additional: {
        block: 'login'
      }
    },
    {
      label: 'Повторите пароль:',
      key: 'repeatPassword',
      type: 'password',
      styleClass: 'col-12',
      additional: {
        block: 'login'
      }
    },
  ];
  form: FormGroup;
  loginForm: FormGroup;
  rolesForm: FormGroup;
  allRolesDict: any = {};
  rolesDescriptions: ISimpleDescription[] = [];
  userRolesInterface: any = {};
  sbscs: Subscription[] = [];

  constructor(private users: AdminUsersService,
              private user: UserService,
              private sds: SimpleDescriptionService,
              private logS: LogService,
              public access: RoleAccessService,
              private ns: NotificationsService) {
  }

  ngOnInit() {
    this.users.initRoles();
    this.sbscs.push(
      this.users.userSub.subscribe(
        user => {
          this.userItem = user;
          if (user){
            this.form ? this.form.reset(this.userItem) : false;
            this.loginForm ? this.loginForm.reset(this.userItem) : false;
            this.updateRolesInterface();
          }
        }
      ),
      this.users.rolesSub.subscribe(
        roles => {
          if (roles) {
            this.updateCurrentRoles(roles);
          }
        }
      ),

    );
    this.form = this.sds.makeForm(this.getBlockDescriptions('general'));
    this.loginForm = this.sds.makeForm(this.getBlockDescriptions('login'));
    this.sbscs.push(
      this.loginForm.valueChanges.subscribe(
        el => {
          console.log(el);
          if (el.clearPassword !== el.repeatPassword) {
            this.samePassword = false;
          }
          else {
            this.samePassword = true;
          }
        }
      ),
      this.form.valueChanges.subscribe(
        ch => this.form.reset(ch, {emitEvent: false}) //todo: для обновления групкода, проверить на ошибки
      )
    );
  }

  ngOnDestroy(){
    this.sbscs.forEach(
      s => s.unsubscribe()
    );
  }

  updateCurrentRoles(roles) {
    this.rolesDescriptions = [];
    roles.forEach(
      role => {
        this.allRolesDict[role.code] = role;
        this.userRolesInterface[role.code] = false;
        this.rolesDescriptions.push({
          label: role.name,
          key: role.code,
          type: 'checkbox'
        });
      }
    );
    this.rolesForm = this.sds.makeForm(this.rolesDescriptions);
    if (this.userItem && this.userItem.roleList) {
      this.userItem.roleList.forEach(
        role => {
          this.userRolesInterface[role.code] = true;
        }
      );
    }
    this.sbscs.push(this.rolesForm.valueChanges.subscribe(
      ch => {
          this.userItem.roleList = [];
          Object.keys(ch).forEach(
            key => {
              ch[key] ? this.userItem.roleList.push(this.allRolesDict[key]) : false;
            }
          );
      }
      )
    );

  }

  updateRolesInterface(){
    for (let r in this.userRolesInterface){
      this.userRolesInterface[r] = false;
    }
    console.log(this.userRolesInterface, this.userItem);
    if (this.userItem && this.userItem.roleList) {
      this.userItem.roleList.forEach(
        role => {
          this.userRolesInterface[role.code] = true;
        }
      );
    }
    console.log(this.userRolesInterface);
    this.rolesForm ? this.rolesForm.reset(this.userRolesInterface) : false;
  }

  saveUserItem() {
    this.users.saveUser(Object.assign(this.userItem, this.form.getRawValue(), this.loginForm.getRawValue())).subscribe(
      s => {
        this.ns.success('Пользователь обновлен');
      },
      error1 => {
        console.log(error1);
        this.ns.error('Ошибка сохранения');
      }
    );
  }

  deleteUserItem() {
    this.users.deleteUser(this.userItem).subscribe(
      s => {
        this.ns.success('Пользователь удален');
      },
      error1 => {
        console.log(error1);
        this.ns.error('Ошибка удаления');
      }
    );
  }


  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptions.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

  showLog() {
    this.logS.openLog(this.userItem.id, RecordType.PERFORMER);
  }

}
