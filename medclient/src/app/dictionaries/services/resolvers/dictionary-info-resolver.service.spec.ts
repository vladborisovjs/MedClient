import { TestBed } from '@angular/core/testing';

import { DictionaryInfoResolverService } from './dictionary-info-resolver.service';

describe('DictionaryInfoResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DictionaryInfoResolverService = TestBed.get(DictionaryInfoResolverService);
    expect(service).toBeTruthy();
  });
});
