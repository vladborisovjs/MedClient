import { Injectable } from '@angular/core';
import {PerformerShiftService} from "../../shift-control/shift-control-shared/services/performer-shift.service";
import {MedApi} from "../../../../swagger/med-api.service";

@Injectable()

export class AviationPerformerShiftService extends PerformerShiftService{
  mode = 'aviation';
  constructor(api: MedApi) {
    super(api);
  }
}
