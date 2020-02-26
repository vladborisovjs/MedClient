import { TestBed } from '@angular/core/testing';

import { SearchAddressService } from './search-address.service';

describe('SearchAddressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchAddressService = TestBed.get(SearchAddressService);
    expect(service).toBeTruthy();
  });
});
