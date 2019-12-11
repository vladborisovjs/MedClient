import { TestBed } from '@angular/core/testing';

import { AviaBrigadeEditListResolverService } from './avia-brigade-edit-list-resolver.service';

describe('AviaBrigadeEditListResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AviaBrigadeEditListResolverService = TestBed.get(AviaBrigadeEditListResolverService);
    expect(service).toBeTruthy();
  });
});
