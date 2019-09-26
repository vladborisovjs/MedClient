import {Injectable} from '@angular/core';
import {MedApi} from '../../../../swagger/med-api.service';
import {CallItemService} from '../../calls/services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ArmBrigadeService extends CallItemService{
  mode: string = 'ARM_BRIGADE';

  constructor(api: MedApi,user: UserService,ns: NotificationsService, router: Router ) {
    super(api, user, ns, router);
    console.log(this.mode);
  }
}
