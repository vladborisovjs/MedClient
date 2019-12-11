import { TestBed } from '@angular/core/testing';

import { AviaBrigadeEditItemResolverService } from './avia-brigade-edit-item-resolver.service';

describe('AviaBrigadeEditItemResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AviaBrigadeEditItemResolverService = TestBed.get(AviaBrigadeEditItemResolverService);
    expect(service).toBeTruthy();
  });
});
