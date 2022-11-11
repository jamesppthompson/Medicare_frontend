export interface ISubscribedPlan {
  id: number;
  userId: string;
  subscriptionPlanId: number;
  subscriptionStartDate: null | Date;
  subscriptionEndDate: null | Date;
  createdAt: null | Date;
  updatedAt: null | Date;
}
