import { TestBed } from '@angular/core/testing';

import { EmailRestService } from './email-rest.service';

describe('EmailRestService', () => {
  let service: EmailRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
