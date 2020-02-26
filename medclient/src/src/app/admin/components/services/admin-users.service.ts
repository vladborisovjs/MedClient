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
  currentUser: PerformerBean;

  constructor(private api: MedApi, private httpClient: HttpClient, private user: UserService) {
    this.userSub.subscribe(u => this.currentUser = u);
      }

  initRoles(){
    this.api.getRoleListUsingGET().subscribe(
      roles => {
        this.rolesSub.next(roles.filter( r => {
          return ((r.id !== 405377 && r.id !== 405385 && r.id !== 405384) || this.user.mePerformer.performer.subdivisionFK.id === 1); // эту роль можно назначать только админу тцмк
        }));
        this.userSub.next(this.user.mePerformer.performer); // выбор текущего пользователя
      }
    );
  }

  getUsersList(offset, count, filters) {
    console.log(filters);
    console.log((filters.subdivisionFK && filters.subdivisionFK.id));
    console.log(this.user.mePerformer.performer.subdivisionFK.id === 1 ? undefined : this.user.mePerformer.performer.subdivisionFK.id);
    return this.api.getPerformerListUsingGET(
      offset,
      count,
      !filters.deleted ? false : filters.deleted,
      filters.type ? filters.type : undefined,
      filters.name ? filters.name : undefined,
      filters.surname ? filters.surname : undefined,
      filters.login || undefined,
      (filters.subdivisionFK && filters.subdivisionFK.id) ||
      ( this.user.mePerformer.performer.subdivisionFK.id === 1 ? undefined : this.user.mePerformer.performer.subdivisionFK.id)
     , // undefined может послать только тцмк
      false
    );
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

  restoreUser(id: number) {
    return this.api.restorePerformerUsingPOST(id).pipe(tap(
      ()=>{
        this.currentUser.isDeleted = false;
        this.userSub.next(this.currentUser);
      }
    ))
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
