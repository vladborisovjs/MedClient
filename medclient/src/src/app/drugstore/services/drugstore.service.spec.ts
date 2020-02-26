import { TestBed } from '@angular/core/testing';

import { DrugstoreService } from './drugstore.service';

describe('DrugstoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrugstoreService = TestBed.get(DrugstoreService);
    expect(service).toBeTruthy();
  });
});
