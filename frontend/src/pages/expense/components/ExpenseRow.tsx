import { ExpenseType } from "../../../types/Expense";

const ExpenseRow = ({ expense }: { expense: ExpenseType }) => {
  return (
    <tr>
      <th>{expense.name}</th>
      <th>{expense.type}</th>
      <th>{expense.cash}</th>
      <th>{expense.author}</th>
    </tr>
  );
};

export default ExpenseRow;
