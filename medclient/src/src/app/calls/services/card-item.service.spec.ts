import { TestBed } from '@angular/core/testing';

import { CardItemService } from '../../card-f110/services/card-item.service';

describe('CardItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CardItemService = TestBed.get(CardItemService);
    expect(service).toBeTruthy();
  });
});
