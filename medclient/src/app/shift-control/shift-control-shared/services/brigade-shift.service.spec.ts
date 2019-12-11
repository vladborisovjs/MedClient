import { TestBed } from '@angular/core/testing';

import { BrigadeShiftService } from './brigade-shift.service';

describe('BrigadeShiftService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrigadeShiftService = TestBed.get(BrigadeShiftService);
    expect(service).toBeTruthy();
  });
});
