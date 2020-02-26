import { TestBed } from '@angular/core/testing';

import { InfoExchangeService } from './info-exchange.service';

describe('InfoExchangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoExchangeService = TestBed.get(InfoExchangeService);
    expect(service).toBeTruthy();
  });
});
