import { ExpenseType } from "../../../types/Expense";
import ExpenseBoxRow from "./ExpenseBoxRow";
import ExpenseRow from "./ExpenseRow1";

const ExpensesTable = ({ expenses }: { expenses: ExpenseType[] }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Type</td>
            <td>Cost</td>
            <td>Paid by</td>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => {
            return <ExpenseBoxRow exp={exp} key={Math.random()} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
