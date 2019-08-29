import { Component, OnInit } from '@angular/core';
import {IMapParams, MapManager} from '../../../shared/best-map/models/map-manager';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import Point from 'ol/geom/Point';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

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

  constructor() { }

  ngOnInit() {
  }

  catchMapM(e) {  // событие инициализации карты
    console.log(e);
    this.mapManager = e;
    this.mapManager.clickO.subscribe(
      (clck: MapBrowserEvent) => {
        this.drawPoint(clck.coordinate);
      });

    this.mapManager.getMap().getView().setZoom(17);
    this.mapManager.getMap().getView().setCenter([3374753.320890312, 8397036.703640517]);
    this.mapManager.addMapLayer(this.pointLayer);

    let telda = new Feature({geometry: new Point([3374753.320890312, 8397036.703640517])});
    telda.setStyle(new  Style({
      image: new Icon({
        // src:'../../../../../assets/map-marker-alt-solid.svg',
        src:'http://172.16.6.166/tcmk/assets/map-marker-alt-solid.svg',
        imgSize:[30, 30],
        color: '#009eaa',
        anchor: [0.36, 1],
      }),
    }));
    this.pointVectorSource.addFeature(telda);

  }

  drawPoint(coordinate) { // удаление старойточки и добавление новой
    this.pointFeature ? this.pointVectorSource.removeFeature(this.pointFeature) : void 0;
    this.pointFeature = new Feature({geometry: new Point(coordinate)});
    this.pointFeature.setStyle(this.iconPointStyle);
    this.pointVectorSource.addFeature(this.pointFeature);
  }

}
