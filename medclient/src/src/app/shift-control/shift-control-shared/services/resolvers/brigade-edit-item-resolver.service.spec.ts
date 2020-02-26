import { TestBed } from '@angular/core/testing';

import { BrigadeEditItemResolverService } from './brigade-edit-item-resolver.service';

describe('BrigadeEditItemResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrigadeEditItemResolverService = TestBed.get(BrigadeEditItemResolverService);
    expect(service).toBeTruthy();
  });
});
