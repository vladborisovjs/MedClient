import {Inject, Injectable} from '@angular/core';
import TileLayer from 'ol/layer/Tile';
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
      }),
      // new TileLayer({
      //   source:new TileWMS({
      //     url: '/geoserver/wms',
      //     params: {'LAYERS': 'telda:landuse, telda:park, telda:highways, telda:railway, telda:roads, telda:bridges, telda:buildings', 'TILED': true},
      //     serverType: 'geoserver',
      //     transition: 0
      //   })
      // }),
    ];
    return layers;
  }
}
