import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {AdminUsersService} from '../services/admin-users.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {PerformerBean} from '../../../../../swagger/med-api.service';
import {UserService} from '../../../services/user.service';
import {RoleAccessService} from "../../../services/role-access.service";

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.scss']
})
export class AdminUsersListComponent implements OnInit, OnDestroy {
  colDef: ColDef[] = [
    {
      headerName: 'Фамилия',
      field: 'surname',
    },
    {
      headerName: 'Имя',
      field: 'name',
    },
    {
      headerName: 'Отчество',
      field: 'patronymic',
    },
    {
      headerName: 'Телефон',
      field: 'phone',
    },
    {
      headerName: 'Должность',
      field: 'typeFK.name',
    },
    {
      headerName: 'Район',
      field: 'subdivisionFK.shortName',
    },
    {
      headerName: 'Специализация',
      field: 'specializationFK.name',
    },
    {
      headerName: 'Выполняемые роли',
      valueGetter: p => {
        if (p.data && p.data.roleList.length) {
          let role = '';
          p.data.roleList.forEach(
            el => {
              if (el.name) {
                role = role + el.name + ', '
              }
            }
          );
          role = role.slice(0, -2);
          return role;
        } else {
          return '';
        }
      },
    },
    {
      headerName: 'Логин',
      field: 'username',
    },
  ];
  source: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.users.getUsersList(offset, count, filter);
    }
  };
  filters: any = {
    deleted: false,
  };
  subdivisionList: any[] = [];
  descriptions: ISimpleDescription[] = [
    {
      key: 'surname',
      placeholder: 'Фамилия',
      type: 'text',
      styleClass: 'col-2'
    },
    {
      key: 'name',
      placeholder: 'Имя',
      type: 'text',
      styleClass: 'col-2'
    },
    {
      key: 'login',
      placeholder: 'Логин',
      type: 'text',
      styleClass: 'col-2'
    },
    {
      placeholder: 'Район',
      key: 'subdivisionFK',
      type: 'dict',
      dict: 'getDistrictListUsingGET',
      bindLabel: 'shortName',
      shortDict: true,
      dictFilters: {rootId: [this.user.mePerformer.performer.subdivisionFK.id]},
      dictFiltersOrder: ['rootId'],
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      key: 'deleted',
      label: 'Удаленные',
      type: 'checkbox',
      styleClass: 'col-2'
    },

  ];
  form: FormGroup;
  sbscs: Subscription[] = [];

  constructor(private users: AdminUsersService,
              private user: UserService,
              public access: RoleAccessService,
              private sds: SimpleDescriptionService,) {

  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.sbscs.push(
      this.form.valueChanges.pipe(debounceTime(300)).subscribe(
      f => {
        this.filters = f
      }
      ),
    );
  }

  ngOnDestroy() {
    this.users.selectUser(null);
    this.sbscs.forEach(
      s => s.unsubscribe()
    );
  }

  createUser(){
    this.users.selectUser(PerformerBean.fromJS({id: 0, isDeleted: false}));
  }

  selectUser(e) {
    this.users.selectUser(e.data);
  }

  onGridReady(params) {
    this.users.initGridApi(params.api);
  }
}
