import { ExpenseType } from "../../../../types/Expense";
import DeleteExpense from "./DeleteExense";

const ExpenseRow = ({ expense, handleDeleteExpense }: { expense: ExpenseType; handleDeleteExpense: any }) => {
  return (
    <tr>
      <th>{expense.name}</th>
      <th>{expense.type}</th>
      <th>{expense.cash}</th>
      <th>{expense.author}</th>
      <th>
        <DeleteExpense handleDeleteExpense={handleDeleteExpense} id_expense={expense.id_expense} />
      </th>
    </tr>
  );
};

export default ExpenseRow;
