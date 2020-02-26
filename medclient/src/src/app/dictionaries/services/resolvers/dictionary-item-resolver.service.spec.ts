import { TestBed } from '@angular/core/testing';

import { DictionaryItemResolverService } from './dictionary-item-resolver.service';

describe('DictionaryItemResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DictionaryItemResolverService = TestBed.get(DictionaryItemResolverService);
    expect(service).toBeTruthy();
  });
});
