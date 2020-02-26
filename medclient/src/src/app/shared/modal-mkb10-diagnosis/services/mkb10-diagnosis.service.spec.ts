import { TestBed } from '@angular/core/testing';

import { Mkb10DiagnosisService } from './mkb10-diagnosis.service';

describe('Mkb10DiagnosisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Mkb10DiagnosisService = TestBed.get(Mkb10DiagnosisService);
    expect(service).toBeTruthy();
  });
});
