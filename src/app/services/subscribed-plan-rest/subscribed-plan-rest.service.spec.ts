import { TestBed } from '@angular/core/testing';

import { SubscribedPlanRestService } from './subscribed-plan-rest.service';

describe('SubscribedPlanRestService', () => {
  let service: SubscribedPlanRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscribedPlanRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
