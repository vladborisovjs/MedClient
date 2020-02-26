import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IMapParams, MapManager} from '../../models/map-manager';
import {NotificationsService} from 'angular2-notifications';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import {toLonLat} from 'ol/proj';
import Point from 'ol/geom/Point';
import {MedMapService} from '../../services/med-map.service';
import {PopupComponent} from '../popup/popup.component';
import Overlay from 'ol/Overlay';
import Map from 'ol/Map';


@Component({
  selector: 'app-med-map',
  templateUrl: './med-map.component.html',
  styleUrls: ['./med-map.component.scss']
})
export class MedMapComponent implements OnInit, AfterViewInit {
  @ViewChild('popup', { read: ViewContainerRef }) popup: ViewContainerRef;
  @Output() onMapReady = new EventEmitter();
  @Output() onClick = new EventEmitter(); // Отправка геометрии  долготы и широты клика

  //Конфигурация карты
  mapParams: IMapParams = {
    mapCenterCoordinates: [31, 60],
    zoom: 5,
    maxZoom: 19,
    mapProjection: 'EPSG:3857'
  };
  mapManager: MapManager;
  map: Map;


  constructor(private ns: NotificationsService,
              private ms: MedMapService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      let pOverlay = new Overlay(
        {
          element: this.popup.element.nativeElement,
          id: 'popup'
        }
      );
      this.ms.overlayPopup = pOverlay;
      this.ms.popupEl = this.popup;
      this.map.addOverlay(pOverlay);
    }, 0);
  }

  catchMapM(map: MapManager) {  // событие инициализации карты
    this.map = map.getMap();
    this.mapManager = map;
    this.mapManager.clickO.subscribe( // событие клика
      (clck: MapBrowserEvent) => {
        this.onClick.emit(
          {
            coordinates: toLonLat(clck.coordinate, this.mapParams.mapProjection),
            type: 'Point'
          }
        );
      });
    this.ms.mapParams = this.mapParams;
    this.ms.catchMapManager(this.mapManager);
    this.onMapReady.emit();
  }


}
