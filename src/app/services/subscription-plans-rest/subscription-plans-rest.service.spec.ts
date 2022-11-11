import { TestBed } from '@angular/core/testing';

import { SubscriptionPlansRestService } from './subscription-plans-rest.service';

describe('SubscriptionPlansRestService', () => {
  let service: SubscriptionPlansRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionPlansRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
