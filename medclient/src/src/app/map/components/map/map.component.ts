import {Component, OnDestroy, OnInit} from '@angular/core';
import {MedMapService} from '../../../shared/best-map/services/med-map.service';
import {BigMapInfoService} from '../../services/big-map-info.service';
import {Subscription} from 'rxjs';
import {TransportMonitoringData} from '../../../../../swagger/med-api.service';
import {SocketTopicsService} from '../../../shared/socket-topic/services/socket-topics.service';
import {UserService} from "../../../services/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ISimpleDescription} from "../../../shared/simple-control/services/simple-description.service";
import {el} from "@angular/platform-browser/testing/src/browser_util";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [MedMapService]
})
export class MapComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  transportMonitoringList: TransportMonitoringData[] = [];
  transportMonitoringListFull: TransportMonitoringData[] = [];
  callsMonitoringList: any[] = [];
  filterForm = new FormGroup({
    subdivisionFK: new FormControl()
  });
  filterDescription: ISimpleDescription[] = [
    {
      placeholder: 'Район',
      key: 'subdivisionFK',
      type: 'dict',
      dict: 'getDistrictListUsingGET',
      bindLabel: 'shortName',
      shortDict: true,
      dictFilters: {rootId: [this.user.mePerformer.performer.subdivisionFK.id]},
      dictFiltersOrder: ['rootId'],
      styleClass: 'col-12'
    }
  ];

  subIdForFilter: number;

  constructor(private ms: MedMapService,
              public user: UserService,
              private mapInfo: BigMapInfoService,
              private sTopics: SocketTopicsService) {
  }


  ngOnInit() {

    if (this.user.mePerformer.performer.subdivisionFK.id === 1){
      this.filterForm.valueChanges.subscribe(ch=> {
        this.subIdForFilter = ch.subdivisionFK && ch.subdivisionFK.id;
        if (this.subIdForFilter !== undefined && this.subIdForFilter !== null){
          this.transportMonitoringList = this.transportMonitoringListFull.filter(t => t.brigadeContainer.brigade.subdivisionFK.id === this.subIdForFilter);
          this.ms.drawTransport(this.transportMonitoringList.filter((t => !!t.transportMonitoringBean)));
        } else {
          this.transportMonitoringList = this.transportMonitoringListFull;
          this.ms.drawTransport(this.transportMonitoringList.filter((t => !!t.transportMonitoringBean)));
        }
      })
    }

    this.sTopics.turnOffModals();
    this.mapInfo.getCallsList();
    this.mapInfo.gutSubDivisionsList();
    this.mapInfo.startTransportMonitoring();
    const mr = this.ms.mapReadySub.subscribe(
      res => {
        if (res) {
          this.sbscs.push(
            this.mapInfo.callsListSub.subscribe(
              calls => {
                if (calls) {
                  this.ms.drawCalls(calls.list.filter(call => !!call.location));
                  this.callsMonitoringList = calls.list.filter(call => !!call.location);
                }
              }
            ),
            this.mapInfo.subdivisionsListSub.subscribe(
              subs => {
                if (subs) {
                  this.ms.drawSubdivisions(subs.list.filter(sub => !!sub.location));
                }
              }
            ),
            this.mapInfo.transportListSub.subscribe(
              trans => {
                if (trans) {
                  console.log(this.subIdForFilter);
                  this.transportMonitoringListFull = trans.sort((a, b) => {
                    if (a.brigadeContainer.brigade.name > b.brigadeContainer.brigade.name) {
                      return 1;
                    } else if (a.brigadeContainer.brigade.name < b.brigadeContainer.brigade.name) {
                      return -1;
                    }
                    return 0;
                  });
                  if (this.subIdForFilter !== undefined && this.subIdForFilter !== null){
                    this.transportMonitoringList = this.transportMonitoringListFull.filter(t => t.brigadeContainer.brigade.subdivisionFK.id === this.subIdForFilter);
                  } else {
                    this.transportMonitoringList = this.transportMonitoringListFull;
                  }
                  this.ms.drawTransport(this.transportMonitoringList.filter((t => !!t.transportMonitoringBean)));

                }
              }
            )
          );
          mr.unsubscribe();
        }
      }
    );
  }

  ngOnDestroy() {
    this.sTopics.turnOnModals();
    this.mapInfo.stopTransportMonitoring();
    this.sbscs.forEach(
      s => s.unsubscribe()
    );
  }

  initMapPoint() {
    this.ms.setDefaultView();
  }

  mapClick(e) {
  }

  resizeMap() {
    this.ms.resizeMap();
  }

  showOnMap(location) {
    location = JSON.parse(location);
    this.ms.setMapViewOnPoint(location);
  }
}
