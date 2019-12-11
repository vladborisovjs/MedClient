import {Injectable} from '@angular/core';
import {CallContainer, CallStatusList, MedApi} from '../../../../swagger/med-api.service';
import {CallItemService} from '../../calls/services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArmBrigadeService extends CallItemService{
  mode: string = 'ARM_BRIGADE';
  brigadeId: number;
  constructor(api: MedApi,user: UserService,ns: NotificationsService, router: Router ) {
    super(api, user, ns, router);
  }

  saveCall() {
    this.currentCall = CallContainer.fromJS(this.currentCall);
    this.currentCall.call.status = null;
    return this.api.updateCallContainerWithoutBrigadesUsingPOST(this.currentCall).pipe(
      tap(val => {
          this.callItemSub.next(val);
        }
      )
    );
  }
}
