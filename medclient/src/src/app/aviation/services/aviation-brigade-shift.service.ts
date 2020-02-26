import { Injectable } from '@angular/core';
import {MedApi} from "../../../../swagger/med-api.service";
import {BrigadeShiftService} from "../../shift-control/shift-control-shared/services/brigade-shift.service";

@Injectable()
export class AviationBrigadeShiftService extends  BrigadeShiftService{
  mode = 'aviation';
  constructor(api: MedApi) {
    super(api);
  }
}
