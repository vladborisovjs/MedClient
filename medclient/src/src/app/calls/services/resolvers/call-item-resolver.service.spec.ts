import { TestBed } from '@angular/core/testing';

import { CallItemResolverService } from './call-item-resolver.service';

describe('CallItemResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CallItemResolverService = TestBed.get(CallItemResolverService);
    expect(service).toBeTruthy();
  });
});
