import { TestBed } from '@angular/core/testing';

import { ProfileRestService } from './profile-rest.service';

describe('ProfileRestService', () => {
  let service: ProfileRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
