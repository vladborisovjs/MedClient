import { TestBed, async, inject } from '@angular/core/testing';

import { ArmCallItemGuard } from './arm-call-item.guard';

describe('ArmCallItemGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArmCallItemGuard]
    });
  });

  it('should ...', inject([ArmCallItemGuard], (guard: ArmCallItemGuard) => {
    expect(guard).toBeTruthy();
  }));
});
