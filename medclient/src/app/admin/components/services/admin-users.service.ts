import {Injectable} from '@angular/core';
import {MedApi, PerformerBean, RoleBean} from '../../../../../swagger/med-api.service';
import {BehaviorSubject, zip} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {mergeMap, tap} from 'rxjs/operators';
import {GridApi} from 'ag-grid-community';
import {UserService} from "../../../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  userSub: BehaviorSubject<PerformerBean> = new BehaviorSubject(null);
  rolesSub: BehaviorSubject<any> = new BehaviorSubject(null);
  gridApi: GridApi;// апи таблицы сотрудников

  constructor(private api: MedApi, private httpClient: HttpClient, private user: UserService) {

  }

  initRoles(){
    this.api.getRoleListUsingGET().subscribe(
      roles => {
        console.log(roles);
        this.rolesSub.next(roles.filter( r => {
          console.log(r.id, this.user.mePerformer.performer.subdivisionFK.id === 1);
          return (r.id !== 405377 || this.user.mePerformer.performer.subdivisionFK.id === 1);
        }));
      }
    );
  }

  getUsersList(offset, count, filters) {
    console.log(filters);
    return this.api.getPerformerListUsingGET(
      offset,
      count,
      !filters.deleted ? false : filters.deleted,
      filters.type ? filters.type : undefined,
      filters.name ? filters.name : undefined,
      filters.surname ? filters.surname : undefined,
      filters.subdivisionFK ? filters.subdivisionFK.id : this.user.mePerformer.performer.subdivisionFK.id
    );
  }

  getSubdivisions(subId) {
    return this.api.getFullSubdivisionNodeUsingGET(subId, false);
  }

  selectUser(user: PerformerBean) {
    this.userSub.next(user);
  }

  saveUser(user: PerformerBean) {
    user = PerformerBean.fromJS(user);
    return this.api.updatePerformerUsingPOST(user).pipe(
      mergeMap(
        savedUser => {
          return this.api.addRolesToPerformerUsingPOST(user.roleList, savedUser.id).pipe(
            tap((userR) => {
              this.userSub.next(userR);
              //this.gridApi && this.gridApi.updateRowData({update: [user]});
              this.gridApi.refreshInfiniteCache();
            })
          );
        }
      )
    );
  }

  deleteUser(user) {
    return this.api.deletePerformerUsingDELETE(user.id).pipe(tap(
      () => {
        this.userSub.next(null);
        this.gridApi.refreshInfiniteCache();

      }
      )
    );
  }

  initGridApi(api: GridApi) {
    this.gridApi = api;
  }


}
