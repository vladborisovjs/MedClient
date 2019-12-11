import { TestBed } from '@angular/core/testing';

import { InfoExchangeResolverService } from './info-exchange-resolver.service';

describe('InfoExchangeResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoExchangeResolverService = TestBed.get(InfoExchangeResolverService);
    expect(service).toBeTruthy();
  });
});
