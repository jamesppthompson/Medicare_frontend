import { TestBed } from '@angular/core/testing';

import { LoadSubscriptionPlansGuard } from './load-subscription-plans.guard';

describe('LoadSubscriptionPlansGuard', () => {
  let guard: LoadSubscriptionPlansGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoadSubscriptionPlansGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
