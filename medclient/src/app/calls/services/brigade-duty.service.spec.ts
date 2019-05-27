import { TestBed } from '@angular/core/testing';

import { BrigadeDutyService } from './brigade-duty.service';

describe('BrigadeDutyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrigadeDutyService = TestBed.get(BrigadeDutyService);
    expect(service).toBeTruthy();
  });
});
