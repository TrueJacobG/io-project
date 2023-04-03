import { useState } from "react";
import { ExpenseType } from "../../../../types/Expense";
import AddExpense from "./AddExpense";
import ExpenseRow from "./ExpenseRow";
import sumCosts from "../../utils/sumCosts";

type Props = {
  expenses: ExpenseType[];
  members: string[];
  handleDeleteExpense: any;
  handleAddExpense: any;
  isShowAddExpenseForm: any;
};

const ExpensesTable = ({ expenses, members, handleDeleteExpense, handleAddExpense, isShowAddExpenseForm }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("food");
  const [cost, setCost] = useState(0);

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
            return <ExpenseRow exp={exp} key={exp.id_expense} handleDeleteExpense={handleDeleteExpense} />;
          })}
          {isShowAddExpenseForm && (
            <tr>
              <td colSpan={3}>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="input-expense input-name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </td>
              <td>
                <select name="type" id="type" className="input-expense input-type" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="food">🍕</option>
                  <option value="shop">🛒</option>
                  <option value="fun">🎡</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  name="cost"
                  id="cost"
                  className="input-expense input-cost"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                />
              </td>
            </tr>
          )}
          <tr>
            <td colSpan={5}>
              <h3>SUM: {sumCosts(expenses)}</h3>
            </td>
          </tr>
          {isShowAddExpenseForm && (
            <tr>
              <td colSpan={5}>
                <input
                  type="text"
                  name="description"
                  id="description"
                  className="input-expense input-description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </td>
            </tr>
          )}
          <tr>
            <td colSpan={5} className="add-expense-button">
              <AddExpense
                handleAddExpense={() => {
                  handleAddExpense(name, description, type, cost);
                  setName("");
                  setDescription("");
                  setType("food");
                  setCost(0);
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
