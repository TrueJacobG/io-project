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
            <td>Paid by</td>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => {
            return (
              <div key={Math.random()}>
                <ExpenseRow expense={exp} key={Math.random()} />
                <tr>
                  <td colSpan={4}>
                    <div className="description-name">DESCRIPTION</div>
                    <div className="description-box">{exp.description}</div>
                    <div>{exp.date}</div>
                  </td>
                </tr>
              </div>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
