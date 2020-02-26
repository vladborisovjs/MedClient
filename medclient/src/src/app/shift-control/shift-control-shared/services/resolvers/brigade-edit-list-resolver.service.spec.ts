import { TestBed } from '@angular/core/testing';

import { BrigadeEditListResolverService } from './brigade-edit-list-resolver.service';

describe('BrigadeEditListResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrigadeEditListResolverService = TestBed.get(BrigadeEditListResolverService);
    expect(service).toBeTruthy();
  });
});
