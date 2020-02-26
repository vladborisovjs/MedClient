import { TestBed } from '@angular/core/testing';

import { PatientInfoResolverService } from './patient-info-resolver.service';

describe('PatientInfoResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PatientInfoResolverService = TestBed.get(PatientInfoResolverService);
    expect(service).toBeTruthy();
  });
});
