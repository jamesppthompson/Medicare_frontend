export interface ISubscriptionPlan {
  id: number;
  name: string;
  description: string;
  durationValue: number;
  durationType: string;
  cost: number;
  code: string;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;
}
