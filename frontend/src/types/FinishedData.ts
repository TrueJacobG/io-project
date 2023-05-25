export type FinishedData = {
  payer: string;
  debtors: {
    cash: string;
    email: string;
  }[];
};
