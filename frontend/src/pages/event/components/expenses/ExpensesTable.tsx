import { ExpenseType } from "../../../../types/Expense";
import AddExpense from "./AddExpense";
import ExpenseRow from "./ExpenseRow";

const ExpensesTable = ({
  expenses,
  handleDeleteExpense,
  handleAddExpense,
}: {
  expenses: ExpenseType[];
  handleDeleteExpense: any;
  handleAddExpense: any;
}) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Type</td>
            <td>Cost</td>
            <td>Paid by</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => {
            return <ExpenseRow expense={exp} key={exp.id_expense} handleDeleteExpense={handleDeleteExpense} />;
          })}
          <tr>
            <td colSpan={5} className="add-expense-button">
              <AddExpense handleAddExpense={handleAddExpense} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
