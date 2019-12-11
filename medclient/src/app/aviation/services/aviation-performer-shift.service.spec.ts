import { TestBed } from '@angular/core/testing';

import { AviationPerformerShiftService } from './aviation-performer-shift.service';

describe('AviationPerformerShiftService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AviationPerformerShiftService = TestBed.get(AviationPerformerShiftService);
    expect(service).toBeTruthy();
  });
});
