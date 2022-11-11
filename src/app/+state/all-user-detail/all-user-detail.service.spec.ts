import { TestBed } from '@angular/core/testing';

import { AllUserDetailService } from './all-user-detail.service';

describe('AllUserDetailService', () => {
  let service: AllUserDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllUserDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
