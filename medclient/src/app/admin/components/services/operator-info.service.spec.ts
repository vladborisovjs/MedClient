import { TestBed } from '@angular/core/testing';

import { OperatorInfoService } from './operator-info.service';

describe('OperatorInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OperatorInfoService = TestBed.get(OperatorInfoService);
    expect(service).toBeTruthy();
  });
});
