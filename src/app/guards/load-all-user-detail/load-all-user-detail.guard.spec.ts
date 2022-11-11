import { TestBed } from '@angular/core/testing';

import { LoadAllUserDetailGuard } from './load-all-user-detail.guard';

describe('LoadAllUserDetailGuard', () => {
  let guard: LoadAllUserDetailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoadAllUserDetailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
