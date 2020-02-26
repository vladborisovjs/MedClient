import { TestBed } from '@angular/core/testing';

import { DrugstoreBagService } from './drugstore-bag.service';

describe('DrugstoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrugstoreBagService = TestBed.get(DrugstoreBagService);
    expect(service).toBeTruthy();
  });
});
