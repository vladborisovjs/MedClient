import {ComponentFactoryResolver, ElementRef, Inject, Injectable, ViewContainerRef} from '@angular/core';
import {IMapParams, MapManager} from '../models/map-manager';
import {fromLonLat, toLonLat} from 'ol/proj';
import {API_BASE_URL} from '../../../../../swagger/med-api.service';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import {PopupComponent} from '../components/popup/popup.component';
import {CallLayer, PointerLayer, SubdivisonLayer, TransportLayer} from '../models/map-features';
import {BehaviorSubject} from 'rxjs';


@Injectable()
export class MedMapService {

  mapManager: MapManager;
  mapParams: IMapParams;
  map: Map;

  mapReadySub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  overlayPopup: Overlay; // оверлэй для всплывающих окон
  popupEl: ViewContainerRef; // div в который добавляется компонент всплывающего окна
  componentFactory = this._resolver.resolveComponentFactory(PopupComponent);
  popupComp: any; // instance компонента

  callsMedLayer: CallLayer; //Векторный слой для звонков
  subdivisionsMedLayer: SubdivisonLayer; //Векторный слой для больниц
  transportMedLayer: TransportLayer; //Векторный слой для ранспорта
  pointMedLayer: PointerLayer; //Векторный слой для указателя

  constructor(private _resolver: ComponentFactoryResolver, @Inject(API_BASE_URL) private apiUrl?: string) {
  }

  setPopup(evt) { //todo: refactor
    if (this.popupComp) {
      this.popupComp.destroy();
    }
    let feature = this.map.getFeaturesAtPixel(evt.pixel, {hitTolerance: 8, layerFilter: () => true});
    if (feature) {
      let featureType = feature[0].get('featureType');
      this.overlayPopup.setPosition(feature[0].getGeometry()['flatCoordinates']);
      this.popupComp = this.popupEl.createComponent(this.componentFactory);
      this.popupComp.instance.featureType = featureType;
      if (featureType === 'subdivision'){
        this.popupComp.instance.subdivision = feature[0].get('subdivision');
      } else if (featureType === 'call'){
        this.popupComp.instance.call = feature[0].get('call');
      } else if (featureType === 'transport'){
        this.popupComp.instance.transport = feature[0].get('transport');
      }
    }
  }

  setCursor() {
    this.map.on('pointermove',
      (evt) => {
        let hasFeature = this.map.hasFeatureAtPixel(evt.pixel, {hitTolerance: 8, layerFilter: () => true});
        this.map.getTarget()['style'].cursor = hasFeature ? 'pointer' : '';
      }
    );
  }

  catchMapManager(mapManager) {
    this.mapManager = mapManager;
    this.map = this.mapManager.getMap();

    this.subdivisionsMedLayer = new SubdivisonLayer(this.mapParams.mapProjection);
    this.transportMedLayer = new TransportLayer(this.mapParams.mapProjection);
    this.callsMedLayer = new CallLayer(this.mapParams.mapProjection);
    this.pointMedLayer = new PointerLayer();

    this.mapManager.addMapLayer(this.pointMedLayer.layer);
    this.mapManager.addMapLayer(this.callsMedLayer.layer);
    this.mapManager.addMapLayer(this.subdivisionsMedLayer.layer);
    this.mapManager.addMapLayer(this.transportMedLayer.layer);
    this.setCursor();
    this.map.on('click',
      (evt) => {
        this.setPopup(evt);
      }
    );
    this.mapReadySub.next(true);
  }

  resizeMap() {
    this.mapManager.getMap().updateSize();
  }

  setPoint(geometry, zoom = 16) {
    console.log('Map----', geometry);
    this.mapManager.getMap().getView().setCenter(geometry.coordinates);
    this.mapManager.getMap().getView().setZoom(zoom);
    this.drawPoint(geometry.coordinates);
    return {
      coordinates: toLonLat(geometry.coordinates, this.mapParams.mapProjection),
      type: 'Point'
    };
  }

  setPointLonLat(geometry) {
    this.drawPoint(fromLonLat(geometry.coordinates));
    return geometry;
  }

  setDefaultView() { // установка стандартного вида на спб
    this.mapManager.getMap().getView().setCenter([3385148.41299588, 8383761.8229939]);
    this.mapManager.getMap().getView().setZoom(11);
  }

  setMapViewOnPoint(geometry, zoom = 16) { // центрирование вида и установка зума
    this.mapManager.getMap().getView().setCenter(fromLonLat(geometry.coordinates));
    this.mapManager.getMap().getView().setZoom(zoom);
  }

  drawPoint(coordinate) { // удаление старой точки и добавление новой
    this.pointMedLayer.setPointFeature(coordinate)
  }

  drawCalls(calls) {
    this.callsMedLayer.resetFeatures(calls);
  }

  drawSubdivisions(subdivisions) {
    this.subdivisionsMedLayer.resetFeatures(subdivisions);
  }

  drawTransport(transports){
    this.transportMedLayer.resetFeatures(transports)
  }
}
