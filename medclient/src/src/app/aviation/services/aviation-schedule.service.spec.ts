import { TestBed } from '@angular/core/testing';

import { AviationScheduleService } from './aviation-schedule.service';

describe('AviationScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AviationScheduleService = TestBed.get(AviationScheduleService);
    expect(service).toBeTruthy();
  });
});
