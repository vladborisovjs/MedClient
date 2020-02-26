import { TestBed } from '@angular/core/testing';

import { BigMapInfoService } from './big-map-info.service';

describe('BigMapInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BigMapInfoService = TestBed.get(BigMapInfoService);
    expect(service).toBeTruthy();
  });
});
