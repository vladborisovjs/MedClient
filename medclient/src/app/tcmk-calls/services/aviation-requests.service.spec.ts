import { TestBed } from '@angular/core/testing';

import { AviationRequestsService } from './aviation-requests.service';

describe('AviationRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AviationRequestsService = TestBed.get(AviationRequestsService);
    expect(service).toBeTruthy();
  });
});
