import { TestBed } from '@angular/core/testing';

import { LoadProfileGuard } from './load-profile.guard';

describe('LoadProfileGuard', () => {
  let guard: LoadProfileGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoadProfileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
