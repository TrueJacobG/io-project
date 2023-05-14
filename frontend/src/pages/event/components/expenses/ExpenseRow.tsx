import { ExpenseType } from "../../../../types/Expense";
import DeleteExpense from "./DeleteExense";

type Props = { archived: boolean; exp: ExpenseType; handleDeleteExpense: any };

const ExpenseRow = ({ archived, exp, handleDeleteExpense }: Props) => {
  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  return (
    <tr>
      <th>{exp.name}</th>
      <th>{exp.type}</th>
      <th>{formatter.format(exp.cash)}</th>
      {!archived && (
        <th>
          <DeleteExpense handleDeleteExpense={handleDeleteExpense} id_expense={exp.id_expense} />
        </th>
      )}
    </tr>
  );
};

export default ExpenseRow;
