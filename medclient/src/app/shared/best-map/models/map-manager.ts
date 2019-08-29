import {ElementRef} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';
import {fromLonLat, transform} from 'ol/proj';
// import {fromEvent} from 'rxjs/observable/fromEvent';
import {fromEvent, Observable} from 'rxjs';


export interface IMapParams {
  mapCenterCoordinates: [number, number];
  zoom?: number;
  maxZoom?: number;
  mapProjection?: string;
}

export class MapManager {
  private mapViewRef: ElementRef;
  private mapView: View;
  private map: Map | any;
  private mapParams: IMapParams;
  public clickO: Observable<any>;
  public singleClickO: Observable<any>;
  public dblClickO: Observable<any>;
  public pointerMoveO: Observable<any>;

  /**
   * @param mapViewRef - ref to map render element
   * @param mapParams - default params
   * @param defaultLayers - first loading layers (default from LayersService)
   * @param defaultControls - openlayers controls (built-in plugins)
   */
  static makeMap(mapViewRef: ElementRef, mapParams: IMapParams,
                 defaultLayers: BaseLayer[] = [],
                 defaultControls = []): MapManager {
    let mapManager = new MapManager(mapViewRef, mapParams);
    mapManager.createMap(defaultLayers, defaultControls);
    return mapManager;
  }

  constructor(mapViewRef: ElementRef, mapParams: IMapParams) {
    this.mapViewRef = mapViewRef;
    this.mapParams = mapParams;
  }

  private createMap(defaultLayers: BaseLayer[], defaultControls) {
    this.mapView = new View({
      projection: this.mapParams.mapProjection,
      center: fromLonLat(this.mapParams.mapCenterCoordinates),
      maxZoom: this.mapParams.maxZoom,
      zoom: this.mapParams.zoom
    });

    this.map = new Map({
      controls: defaultControls,
      layers: defaultLayers,
      target: this.mapViewRef.nativeElement,
      view: this.mapView,
    });

    this.eventProcess();
  }

  private eventProcess() {
    this.clickO = fromEvent(this.map, 'click');
    this.singleClickO = fromEvent(this.map, 'singleclick');
    this.dblClickO = fromEvent(this.map, 'singleclick');
    this.pointerMoveO = fromEvent(this.map, 'pointermove');
  }

  public getMap(): Map {
    return this.map;
  }

  public addMapLayer(layer: BaseLayer | LayerGroup) {
    this.map.addLayer(layer);
  }

  public removeMapLayer(layer: BaseLayer | LayerGroup) {
    this.map.removeLayer(layer);
  }

  public getUsedLayers(): BaseLayer[] {
    return this.map.getLayers().getArray();
  }
}
