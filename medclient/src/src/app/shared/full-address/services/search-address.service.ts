import {Injectable} from '@angular/core';
import {MedApi} from '../../../../../swagger/med-api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchAddressService {

  constructor(private api: MedApi) {
  }

  searchStreet(q) {
    return this.api.getStreetListUsingGET(q)
  }

  searchBuilding(cityAddress, streetName) {
    return this.api.getBuildingListUsingGET(cityAddress, streetName);
  }

  searchStreetFIAS(q) {
    return this.api.getStreetFullSearchListUsingGET(undefined, undefined, q)
  }

  searchHouseFIAS(aoGuiq, q?) {
    return this.api.getHouseByStreetListUsingGET(aoGuiq, q)
  }

  getCoordinatesHouse(id) {
    // return this.api.getMockCoordinatesUsingGET(id);
    return this.api.getHouseCoordinatesUsingGET(id);
  }

  getCoordinatesStreet(id) {
    // return this.api.getMockCoordinatesUsingGET(id);
    return this.api.getStreetCoordinatesUsingGET(id);
  }

}
