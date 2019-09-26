import { TestBed } from '@angular/core/testing';

import { MedMapService } from './med-map.service';

describe('MedMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedMapService = TestBed.get(MedMapService);
    expect(service).toBeTruthy();
  });
});
