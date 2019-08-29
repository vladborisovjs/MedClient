import {Component, Input, OnInit} from '@angular/core';
import {IMapParams, MapManager} from '../../../shared/best-map/models/map-manager';
import {NotificationsService} from 'angular2-notifications';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon';
import {Subject} from 'rxjs';
import Control from 'ol/control/Control';
import View from 'ol/View';


@Component({
  selector: 'app-call-item-map',
  templateUrl: './call-item-map.component.html',
  styleUrls: ['./call-item-map.component.scss']
})
export class CallItemMapComponent implements OnInit {
  @Input() changeSub: Subject<{type: string, value: any}>;

  //Конфигурация карты
  mapParams: IMapParams = {
    mapCenterCoordinates: [31, 60],
    zoom: 5,
    maxZoom: 19,
    mapProjection: 'EPSG:3857'
  };
  mapManager: MapManager;

  //Векторный слой для указателя
  pointVectorSource: VectorSource = new VectorSource({
    features: []
  });
  pointLayer: VectorLayer = new VectorLayer({
    source: this.pointVectorSource
  });
  pointFeature: Feature; // Указатель, добавляется как фича в векторный слой

  // Свойства указателя
  iconPointStyle: Style = new  Style({
    image: new Icon({
      // src:'../../../../../assets/map-marker-alt-solid.svg',
      src:'http://172.16.6.166/tcmk/assets/map-marker-alt-solid.svg',
      imgSize:[20, 20],
      color: '#aa0011',
      anchor: [0.36, 1],
    }),
  });

  iconRocketStyle: Style = new  Style({
    image: new Icon({
      // src:'../../../../../assets/rocket-solid.svg',
      src:'http://172.16.6.166/tcmk/assets/rocket-solid.svg',
      imgSize:[40, 40],
      color: '#aa0011',
      anchor: [0.36, 1],
    }),
  });

  constructor(private ns: NotificationsService) {
  }

  ngOnInit() {
  }

  catchMapM(e) {  // событие инициализации карты
    console.log(e);
    this.mapManager = e;
    this.mapManager.clickO.subscribe(
      (clck: MapBrowserEvent) => {
        this.ns.success('Координаты', clck.coordinate[0] + ' ' + clck.coordinate[1]);
        this.drawPoint(clck.coordinate);
      });

    this.mapManager.getMap().getView().setZoom(17);
    this.mapManager.getMap().getView().setCenter([3374753.320890312, 8397036.703640517]);
    this.drawPoint([3374753.320890312, 8397036.703640517]);
    let rocket = new Feature({geometry: new Point([3386508.201228434, 8412025.527155813])});
    rocket.setStyle(this.iconRocketStyle);
    this.pointVectorSource.addFeature(rocket);

    this.mapManager.addMapLayer(this.pointLayer);

    this.changeSub.asObservable().subscribe(
      ch => {
        if (ch.type === 'resize'){
          this.mapManager.getMap().updateSize(); // подгон карты под новый размер контейнера
        }
      }
    );
  }

  drawPoint(coordinate) { // удаление старойточки и добавление новой
    this.pointFeature ? this.pointVectorSource.removeFeature(this.pointFeature) : void 0;
    this.pointFeature = new Feature({geometry: new Point(coordinate)});
    this.pointFeature.setStyle(this.iconPointStyle);
    this.pointVectorSource.addFeature(this.pointFeature);
  }

}
