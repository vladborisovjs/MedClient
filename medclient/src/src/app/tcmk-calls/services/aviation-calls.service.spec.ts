import { TestBed } from '@angular/core/testing';

import { AviationCallsService } from './aviation-calls.service';

describe('AviationCallsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AviationCallsService = TestBed.get(AviationCallsService);
    expect(service).toBeTruthy();
  });
});
