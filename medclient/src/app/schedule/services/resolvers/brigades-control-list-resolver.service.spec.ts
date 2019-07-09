import { TestBed } from '@angular/core/testing';

import { BrigadesControlListResolverService } from './brigades-control-list-resolver.service';

describe('BrigadesControlListResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrigadesControlListResolverService = TestBed.get(BrigadesControlListResolverService);
    expect(service).toBeTruthy();
  });
});
