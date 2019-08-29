import {Inject, Injectable} from '@angular/core';
import {BingMaps, OSM} from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {API_BASE_URL} from '../../../../../swagger/med-api.service';
import TileWMS from 'ol/source/TileWMS';

export interface ILayersService {
  getDefaultLayers(): any[];
}

@Injectable({
  providedIn: 'root'
})
export class LayersService implements ILayersService {
  baseURL: string;
  constructor(@Inject(API_BASE_URL) baseURL: string) {
    this.baseURL = baseURL.slice(7);
  }

  public getDefaultLayers() {
    const layers = [
      new TileLayer({
        source:new TileWMS({
          url: '/geoserver/wms',
          params: {'LAYERS': 'telda:tcmk-base', 'TILED': true},
          serverType: 'geoserver',
          transition: 0
        })
      })
    ];
    return layers;
  }
}
