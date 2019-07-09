import {Injectable} from '@angular/core';
import {MedApi, Mode3} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';

export interface ICallFilter {
  subdivisionId?: number,
  dateFrom?: Date,
  dateTo?: Date,
  number?: string,
  declarantName?: string,
  declarantPhone?: string,
  patientName?: string,
  patientSex?: number,
  patientAgeYears?: number,
  patientAgeMonths?: number,
  patientAgeDays?: number,
  aoName?: string,
  districtId?: number,
  performer?: string,
  callTypeId?: number,
  declarantTypeId?: number,
  phone?: string,
  callPlaceTypeId?: number,
  reasonTypeId?: number
}

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  constructor(private api: MedApi, private user: UserService) {
  }

  searchCall(filters: ICallFilter) {
    console.log('filk', filters);
    return this.api.readAllUsingPOST(
      this.user.subdivisionId,
      filters.subdivisionId,
      filters.dateFrom,
      filters.dateTo,
      filters.number,
      filters.declarantName,
      filters.declarantPhone,
      filters.patientName,
      filters.patientSex,
      filters.patientAgeYears,
      filters.patientAgeMonths,
      filters.patientAgeDays,
      filters.aoName,
      filters.districtId,
      filters.performer,
      filters.callTypeId,
      filters.declarantTypeId,
      filters.phone,
      filters.callPlaceTypeId,
      filters.reasonTypeId,
    );
    // return this.api.readAllUsingGET_6(this.user.subdivisionId, Mode3.ALL);
  }

  searchCard(filters: ICallFilter) {
    return this.api.readAllUsingPOST_1(
      filters.subdivisionId,
      filters.number,
      filters.declarantName,
      filters.declarantPhone,
      filters.patientName,
      filters.patientSex,
      filters.patientAgeYears,
      filters.patientAgeMonths,
      filters.patientAgeDays,
      filters.aoName,
      filters.districtId,
      filters.performer,
      filters.callTypeId,
      filters.declarantTypeId,
      filters.callPlaceTypeId,
      filters.reasonTypeId,
    );
  }
}
