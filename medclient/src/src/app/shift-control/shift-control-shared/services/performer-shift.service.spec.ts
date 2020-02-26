import { TestBed } from '@angular/core/testing';

import { PerformerShiftService } from './performer-shift.service';

describe('PerformerShiftService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerformerShiftService = TestBed.get(PerformerShiftService);
    expect(service).toBeTruthy();
  });
});
