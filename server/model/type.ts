export interface ITripModel {
  key: string;
  trip: string;
  type: {
    [key: string]: {
      amount: number;
      price: number;
    };
  };
}
export interface ITicketRequest {
  trip: string;
  type: string;
  amount: number;
}
