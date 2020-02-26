import { TestBed } from '@angular/core/testing';

import { UkioService } from './ukio.service';

describe('UkioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UkioService = TestBed.get(UkioService);
    expect(service).toBeTruthy();
  });
});
