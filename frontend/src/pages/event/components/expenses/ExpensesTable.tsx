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
  errorAddExpenseForm: string;
};

const ExpensesTable = ({ expenses, members, handleDeleteExpense, handleAddExpense, isShowAddExpenseForm, errorAddExpenseForm }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("food");
  const [cost, setCost] = useState(0);
  const [users, setUsers] = useState<string[]>([]);

  const [splitType, setSplitType] = useState("");

  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  const handleChangeSplitType = (type: string) => {
    if (splitType !== type) {
      setSplitType(type);
    } else {
      setSplitType("");
    }
  };

  const handleChangeUserInExpense = (e: any, u: string) => {
    if (e.target.checked) {
      setUsers([...users, u]);
    } else {
      let result: string[] = [];

      users.forEach((user) => {
        if (user !== u) {
          result.push(user);
        }
      });

      setUsers(result);
    }
  };

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
          <tr>
            <td colSpan={5}>
              <h3>SUM: {formatter.format(sumCosts(expenses))}</h3>
            </td>
          </tr>
          {isShowAddExpenseForm && (
            <tr>
              <td colSpan={5} className="separator-add-expense-form"></td>
            </tr>
          )}

          {/* TODO! 2 checkboxes: equal all, equal */}
          {/* TODO! equal all disable all just add everyone and split equal*/}
          {/* TODO! equal: true/false, after add person set to equal split or don't */}
          {/* TODO! button add person */}
          {/* TODO! person email and field with number */}

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
          {isShowAddExpenseForm && members.length !== 0 && (
            <tr>
              <td colSpan={5} className="add-user-expense">
                <div className="split-title">
                  <h3>Split</h3>
                </div>
                <div className="info-split">
                  <label>Equal</label>
                  <input type="checkbox" name="equal" onChange={() => handleChangeSplitType("equal")} />
                  {/* TODO! */}
                  <label>Select</label>
                  <input type="checkbox" name="select" />
                </div>
                <br />
                {members.map((u) => {
                  return (
                    <div key={u}>
                      <label>{u}</label>
                      <input type="checkbox" name={u} onChange={(e) => handleChangeUserInExpense(e, u)} />
                    </div>
                  );
                })}
              </td>
            </tr>
          )}
          {isShowAddExpenseForm && errorAddExpenseForm.length !== 0 && (
            <tr>
              <td colSpan={5} className="add-expense-form-error">
                {errorAddExpenseForm}
              </td>
            </tr>
          )}
          <tr>
            <td colSpan={5} className="add-expense-button">
              <AddExpense
                handleAddExpense={() => {
                  handleAddExpense(name, description, type, cost, users, splitType);
                  setName("");
                  setDescription("");
                  setType("food");
                  setCost(0);
                  setUsers([]);
                  setSplitType("");
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
