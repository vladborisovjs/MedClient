import { TestBed } from '@angular/core/testing';

import { UkioResolverService } from './ukio-resolver.service';

describe('UkioResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UkioResolverService = TestBed.get(UkioResolverService);
    expect(service).toBeTruthy();
  });
});
