import { useEffect, useState } from "react";
import { ExpenseType } from "../../../../types/Expense";
import AddExpense from "./AddExpense";
import ExpenseRow from "./ExpenseRow";
import sumCosts from "../../utils/sumCosts";
import React from "react";

type Props = {
  expenses: ExpenseType[];
  members: any[];
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
  const [splitCash, setSplitCash] = useState<number[]>([]);

  const [splitType, setSplitType] = useState("");

  const [sumError, setSumError] = useState("");

  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  const handleChangeSplitType = (type: string) => {
    if (splitType !== type) {
      setSplitType(type);
      reCalculateSplitCost();
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

  const handleChangeUserCash = (newCash: number, i: number) => {
    let newSplitCash: number[] = [];

    splitCash.forEach((c, index) => {
      if (index === i) {
        newSplitCash.push(newCash);
      } else {
        newSplitCash.push(c);
      }
    });

    setSplitCash(newSplitCash);
  };

  const handleClickAddExpense = () => {
    setSumError("");

    if (!isShowAddExpenseForm) {
      handleAddExpense(name, description, type, cost, splitCash, users);
      return;
    }

    let sum = 0;

    splitCash.forEach((c) => {
      sum += c;
    });

    if (cost !== sum) {
      setSumError("Sum of member expenses have to be equal to cost!");
      return;
    }

    handleAddExpense(name, description, type, cost, splitCash, users);
    setName("");
    setDescription("");
    setType("food");
    setCost(0);
    setSplitCash([]);
    setUsers([]);
    setSplitType("");
  };

  const reCalculateSplitCost = () => {
    let splitCost = cost / users.length;
    let newSplitCash: number[] = [];
    members.forEach((u) => {
      if (users.includes(u.email)) {
        newSplitCash.push(splitCost);
      } else {
        newSplitCash.push(0);
      }
    });

    setSplitCash(newSplitCash);
  };

  useEffect(() => {
    if (splitType === "equal") {
      reCalculateSplitCost();
    }
  }, [cost, users]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Type</td>
            <td>Cost</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => {
            return <ExpenseRow exp={exp} key={Math.random()} handleDeleteExpense={handleDeleteExpense} />;
          })}
          <tr>
            <td colSpan={4}>
              <h3>SUM: {formatter.format(sumCosts(expenses))}</h3>
            </td>
          </tr>

          {isShowAddExpenseForm && (
            <tr>
              <td colSpan={4} className="separator-add-expense-form"></td>
            </tr>
          )}

          {isShowAddExpenseForm && (
            <React.Fragment>
              <tr>
                <td colSpan={4}>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="input-expense"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <select name="type" id="type" className="input-expense input-type" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="food">🍕</option>
                    <option value="shop">🛒</option>
                    <option value="fun">🎡</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colSpan={5}>
                  <input
                    type="number"
                    required
                    value={cost <= 0 ? "" : cost}
                    name="cost"
                    id="cost"
                    placeholder="Cost"
                    className="input-expense"
                    onChange={(e) => setCost(Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    className="input-expense"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </td>
              </tr>
              {members.length !== 0 && (
                <tr>
                  <td colSpan={4} className="add-user-expense">
                    <div className="info-split">
                      <label>Equal</label>
                      <input type="checkbox" name="equal" onChange={(e) => handleChangeSplitType("equal")} />
                    </div>
                    <br />
                    {members.map((u, i) => {
                      return (
                        <div className="input-expense-user" key={u.email}>
                          <div className="input-expense-user-name">
                            <label>{u.username}</label>
                          </div>
                          <div className="input-expense-user-checkbox">
                            <input type="checkbox" name={"checkbox " + u.email} onChange={(e) => handleChangeUserInExpense(e, u.email)} />
                          </div>
                          <div className="input-expense-user-cash">
                            <input
                              type="number"
                              name={"number " + u.email}
                              value={splitCash[i] === 0 ? "" : splitCash[i]}
                              onChange={(e) => handleChangeUserCash(Number(e.target.value), i)}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ clear: "both" }}></div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          )}
          {isShowAddExpenseForm && errorAddExpenseForm.length !== 0 && (
            <tr>
              <td colSpan={5} className="add-expense-form-error">
                {errorAddExpenseForm}
              </td>
            </tr>
          )}
          <tr>
            <td colSpan={4} className="add-expense-button">
              <AddExpense handleAddExpense={() => handleClickAddExpense()} />
            </td>
          </tr>
          {sumError.length !== 0 && (
            <tr>
              <td colSpan={4} className="error">
                <h3 style={{ color: "red" }}>{sumError}</h3>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
