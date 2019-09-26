import {Injectable} from '@angular/core';
import {MedApi, PerformerBean, RoleBean} from '../../../../../swagger/med-api.service';
import {BehaviorSubject, zip} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {mergeMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  userSub: BehaviorSubject<PerformerBean> = new BehaviorSubject(null);
  rolesSub: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private api: MedApi, private httpClient: HttpClient) {
    this.api.getRoleListUsingGET().subscribe(
      roles => {
        console.log(roles);
        this.rolesSub.next(roles);
      }
    );
  }

  getUsersList(offset, count, filters) {
    return this.api.getPerformerListUsingGET(
      offset,
      count,
      !filters.deleted ? false : filters.deleted,
      filters.type ? filters.type : undefined,
      filters.name ? filters.name : undefined,
      filters.surname ? filters.surname : undefined,
      );
  }

  selectUser(user: PerformerBean) {
    this.userSub.next(user);
  }

  saveUser(user: PerformerBean){
    user = PerformerBean.fromJS(user);
    return  this.api.updatePerformerUsingPOST(user).pipe(
      mergeMap(
        savedUser => {
           return this.api.addRolesToPerformerUsingPOST( user.roleList, savedUser.id).pipe(
             tap((userR)=> {
               this.userSub.next(userR);
             })
           );
        }
      )
    ) ;
  }

  deleteUser(userId){
    return this.api.deletePerformerUsingDELETE(userId).pipe(tap(() => this.userSub.next(null)));
  }
}
