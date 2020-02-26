import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {UserService} from "./user.service";
import {MedApi} from "../../../swagger/med-api.service";

@Injectable({
  providedIn: 'root'
})
export class MedUtilitesService {

  constructor(private user: UserService, private api: MedApi) { }

  getSubdivisionFilters(){
    return this.api.getFullSubdivisionNodeUsingGET(this.user.mePerformer.performer.subdivisionFK.id, false).pipe(map(
      subdivisions => {
        console.log(subdivisions);
        let districts: any[] = subdivisions.children.filter(node =>  node.data.subdivisionTypeId === 448641);
        console.log(districts);
        districts = districts.map(
          d => { return{id: d.data.id, name: d.data.shortName}}
        );
        districts.push({
          id: this.user.mePerformer.performer.subdivisionFK.id,
          name: this.user.mePerformer.performer.subdivisionFK.shortName
        });
        return districts;
      }
    ));
  }
}
