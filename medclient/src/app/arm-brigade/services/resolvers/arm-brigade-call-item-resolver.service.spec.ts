import { TestBed } from '@angular/core/testing';

import { ArmBrigadeCallItemResolverService } from './arm-brigade-call-item-resolver.service';

describe('ArmBrigadeCallItemResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArmBrigadeCallItemResolverService = TestBed.get(ArmBrigadeCallItemResolverService);
    expect(service).toBeTruthy();
  });
});
