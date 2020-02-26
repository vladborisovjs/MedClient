import { TestBed } from '@angular/core/testing';

import { CardItemResolverService } from '../../../card-f110/services/resolvers/card-item-resolver.service';

describe('CardItemResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CardItemResolverService = TestBed.get(CardItemResolverService);
    expect(service).toBeTruthy();
  });
});
