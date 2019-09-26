import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {AdminUsersService} from '../services/admin-users.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {PerformerBean} from '../../../../../swagger/med-api.service';

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
      headerName: 'Должность',
      field: 'typeFK.name',
    },
    {
      headerName: 'Место работы',
      field: 'workplaceSubdivisionFK.name',
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
  descriptions: ISimpleDescription[] = [
    {
      key: 'name',
      label: 'Имя',
      type: 'text',
      styleClass: 'col-4'
    },
    {
      key: 'surname',
      label: 'Фамилия',
      type: 'text',
      styleClass: 'col-4'
    },
    {
      key: 'type',
      label: 'Тип',
      type: 'dict',
      bindValue: 'id',
      dict: 'getPerformerTypeListUsingGET',
      styleClass: 'col-4'
    },
  ];
  form: FormGroup;
  sbscs: Subscription[] = [];


  constructor(private users: AdminUsersService, private sds: SimpleDescriptionService) {

  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.sbscs.push(this.form.valueChanges.pipe(debounceTime(300)).subscribe(
      f => this.filters = f
      )
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

}
