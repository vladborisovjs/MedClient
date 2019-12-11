import { TestBed } from '@angular/core/testing';

import { DrugRequestService } from './drug-request.service';

describe('DrugRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrugRequestService = TestBed.get(DrugRequestService);
    expect(service).toBeTruthy();
  });
});
