import {Component, OnDestroy, OnInit} from '@angular/core';
import {MedMapService} from '../../../shared/best-map/services/med-map.service';
import {BigMapInfoService} from '../../services/big-map-info.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [MedMapService]
})
export class MapComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];

  constructor(private ms: MedMapService, private mapInfo: BigMapInfoService) {
  }


  ngOnInit() {
    this.mapInfo.getCallsList();
    this.mapInfo.gutSubDivisionsList();
    let mr = this.ms.mapReadySub.subscribe(
      res => {
        if (res) {
          this.sbscs.push(
            this.mapInfo.callsListSub.subscribe(
              calls => {
                if (calls) {
                  this.ms.drawCalls(calls.list.filter(
                    call => !!call.location
                  ));
                }
              }
            ),
            this.mapInfo.subdivisionsListSub.subscribe(
              subs => {
                if (subs) {
                  this.ms.drawSubdivisions(subs.list.filter(
                    sub => !!sub.location
                  ));
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

}
