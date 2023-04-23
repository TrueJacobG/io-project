import { ExpenseType } from "../../../../types/Expense";
import DeleteExpense from "./DeleteExense";

const ExpenseRow = ({ exp, handleDeleteExpense }: { exp: ExpenseType; handleDeleteExpense: any }) => {
  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  return (
    <tr>
      <th>{exp.name}</th>
      <th>{exp.type}</th>
      <th>{formatter.format(exp.cash)}</th>
      <th>
        <DeleteExpense handleDeleteExpense={handleDeleteExpense} id_expense={exp.id_expense} />
      </th>
    </tr>
  );
};

export default ExpenseRow;
