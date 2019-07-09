import { TestBed } from '@angular/core/testing';

import { BrigadesControlItemResolverService } from './brigades-control-item-resolver.service';

describe('BrigadesControlItemResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrigadesControlItemResolverService = TestBed.get(BrigadesControlItemResolverService);
    expect(service).toBeTruthy();
  });
});
