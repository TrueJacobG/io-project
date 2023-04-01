import { ExpenseType } from "../../../../types/Expense";
import AddExpense from "./AddExpense";
import ExpenseRow from "./ExpenseRow";

type Props = {
  expenses: ExpenseType[];
  members: string[];
  handleDeleteExpense: any;
  handleAddExpense: any;
  isShowAddExpenseForm: any;
};

const ExpensesTable = ({ expenses, members, handleDeleteExpense, handleAddExpense, isShowAddExpenseForm }: Props) => {
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
          {isShowAddExpenseForm && (
            <tr>
              <td colSpan={3}>
                <input type="text" name="name" id="name" className="input-expense input-name" />
              </td>
              <td>
                <select name="type" id="type" className="input-expense input-type">
                  <option value="food">🍕</option>
                  <option value="shop">🛒</option>
                  <option value="fun">🎡</option>
                </select>
              </td>
              <td>
                <input type="number" name="cost" id="cost" className="input-expense input-cost" />
              </td>
            </tr>
          )}
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
