import {Injectable} from '@angular/core';
import {CallOperatorInfoBean, MedApi} from "../../../../../swagger/med-api.service";

@Injectable({
  providedIn: 'root'
})
export class OperatorInfoService {

  constructor(private api: MedApi) {
  }

  getConfig() {
    return this.api.getConfigListUsingGET();
  }

  updateConfig(config: CallOperatorInfoBean) {
    return this.api.updateConfigUsingPOST(config);
  }
}

