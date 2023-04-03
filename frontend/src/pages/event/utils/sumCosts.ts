import { ExpenseType } from "../../../types/Expense";

const sumCosts = (expenses: ExpenseType[]): number => {
  let sum = 0;

  expenses.forEach((exp) => {
    sum += exp.cash;
  });

  return sum;
};

export default sumCosts;
