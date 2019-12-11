import {Injectable} from '@angular/core';
import {CallStatusList, MedApi, TransportMonitoringData} from '../../../../swagger/med-api.service';
import {BehaviorSubject} from 'rxjs';
import {UserService} from "../../services/user.service";

@Injectable()
export class BigMapInfoService {

  callsListSub: BehaviorSubject<any> = new BehaviorSubject(null);
  subdivisionsListSub: BehaviorSubject<any> = new BehaviorSubject(null);
  transportListSub: BehaviorSubject<TransportMonitoringData[]> = new BehaviorSubject(null);
  runTransportMonitoring = false;

  constructor(private api: MedApi, private user: UserService) {
  }

  getCallsList() {
    this.api.getCallListUsingGET(
      0,
      777,
      'date',
      undefined,
      [
        CallStatusList.UNDONE,
        CallStatusList.CONFIRM,
        CallStatusList.ACTIVE,
        CallStatusList.UNCONFIRM,
        CallStatusList.TRANSPORTING,
        CallStatusList.EVACUATION_REQUIRED
      ],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.user.mePerformer.performer.subdivisionFK.id,
    ).subscribe(
      calls => {
        this.callsListSub.next(calls);
      }
    );
  }

  gutSubDivisionsList() {
    this.api.getSubdivisionListUsingGET(0, 777, false).subscribe(
      subs => this.subdivisionsListSub.next(subs)
    )
  }

  startTransportMonitoring() {
    this.runTransportMonitoring = true;
    this.transportMonitoring(this.user.mePerformer.performer.subdivisionFK.id);
  }

  stopTransportMonitoring() {
    this.runTransportMonitoring = false;
  }

  transportMonitoring(subId) {
    this.api.getTransportMonitoringListUsingGET(true, subId).subscribe(
      (tl: TransportMonitoringData[]) => {
        this.transportListSub.next(tl);
        if (this.runTransportMonitoring) {
          setTimeout(() => this.transportMonitoring(subId), 5000)
        }
      }
    );



  }
}
