import { TestBed } from '@angular/core/testing';

import { CheckConditionService } from './check-condition.service';

describe('CheckConditionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckConditionService = TestBed.get(CheckConditionService);
    expect(service).toBeTruthy();
  });
});
