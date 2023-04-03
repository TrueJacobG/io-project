import { ExpenseType } from "../../../types/Expense";
import convertTypeToEmoji from "../../event/utils/convertTypeToEmoji";

const ExpenseRow = ({ expense }: { expense: ExpenseType }) => {
  return (
    <tr>
      <th>{expense.name}</th>
      <th>{convertTypeToEmoji(expense.type)}</th>
      <th>{expense.cash}</th>
      <th>{expense.author}</th>
    </tr>
  );
};

export default ExpenseRow;
