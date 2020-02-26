import { Injectable } from '@angular/core';
// import {Tile, TileLayer} from 'ol/layer/Tile';
import {fromLonLat, transform} from 'ol/proj';
import Tile from 'ol/Tile';
import TileLayer from 'ol/layer/Tile';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

}
