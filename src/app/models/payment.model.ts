export interface IPayment {
  id: number;
  initiatedAt: string | Date;
  paymentGatewayServerResponse: null | any;
  paymentGatewayClientResponse: null | any;
  paymentStatusId: number;
  completedAt: null | string | Date;
  userId: string;
  subscribedPlanId: number;
}
