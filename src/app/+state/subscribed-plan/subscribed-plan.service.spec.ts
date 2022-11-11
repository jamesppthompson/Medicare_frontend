import { TestBed } from '@angular/core/testing';

import { SubscribedPlanService } from './subscribed-plan.service';

describe('SubscribedPlanService', () => {
  let service: SubscribedPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscribedPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
