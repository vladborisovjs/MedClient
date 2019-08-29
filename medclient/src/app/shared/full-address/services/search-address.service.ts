import { Injectable } from '@angular/core';
import {MedApi} from '../../../../../swagger/med-api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchAddressService {

  constructor(private api: MedApi) {}

  searchStreet(q){
    return this.api.getStreetListUsingGET(q)
  }

  searchBuilding(cityAddress, streetName){
    return this.api.getBuildingListUsingGET(cityAddress, streetName);
  }
}
