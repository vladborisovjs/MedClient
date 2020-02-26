import { TestBed } from '@angular/core/testing';

import { DrugOperationService } from './drug-operation.service';

describe('DrugRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrugOperationService = TestBed.get(DrugOperationService);
    expect(service).toBeTruthy();
  });
});
