import {Component, OnDestroy, OnInit} from '@angular/core';
import {MedMapService} from '../../../shared/best-map/services/med-map.service';
import {BigMapInfoService} from '../../services/big-map-info.service';
import {Subscription} from 'rxjs';
import {TransportMonitoringData} from '../../../../../swagger/med-api.service';
import {SocketTopicsService} from '../../../shared/socket-topic/services/socket-topics.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [MedMapService]
})
export class MapComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  transportMonitoringList: TransportMonitoringData[] = [];

  constructor(private ms: MedMapService,
              private mapInfo: BigMapInfoService,
              private sTopics: SocketTopicsService) {
  }


  ngOnInit() {
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
                this.transportMonitoringList = trans;
                if (trans) {
                  this.ms.drawTransport(trans.filter((t => !!t.transportMonitoringBean)));
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
