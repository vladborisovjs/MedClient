import {Inject, Injectable} from '@angular/core';
import {API_BASE_URL} from "../../../../swagger/med-api.service";
import {IReport} from "../models/report-models";
import {UserService} from "../../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private user: UserService,
              @Inject(API_BASE_URL) private apiUrl?: string) {
  }

  printReport(report: IReport, options?) {
    let params: string = '';
    if (report.urlParams){
      params = '?';
      report.urlParams.forEach(
        param => {
          params += param.name + '=';
          if (param.subdivisionId) {
            params += this.user.mePerformer.performer.subdivisionFK.id.toString();
          } else {
            params += options[param.name];
          }
          params +=  '&'
        }
      );
      params = params.slice(0,-1);
    }
    window.open(this.apiUrl + report.url + params);
  }
}
