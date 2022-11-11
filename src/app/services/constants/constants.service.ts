import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  readonly subscriptionPlans = {
    MEDICARE_MAGICIAN_FREE_TRAIL: 1,
    MEDICARE_MAGICIAN_YEARLY_SUBSCRIPTION: 2,
    MEDICARE_MAGICIAN_MONTHLY_SUBSCRIPTION: 3,
  };

  constructor() {}
}
