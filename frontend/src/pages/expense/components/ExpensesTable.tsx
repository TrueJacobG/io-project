import { ExpenseType } from "../../../types/Expense";
import ExpenseRow from "./ExpenseRow";

const ExpensesTable = ({ expenses }: { expenses: ExpenseType[] }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Type</td>
            <td>Cost</td>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => {
            return <ExpenseRow exp={exp} key={Math.random()} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
