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
              <>
                <ExpenseRow expense={exp} key={Math.random()} />
                <tr key={Math.random()}>
                  <td colSpan={4}>
                    <div className="description-name">DESCRIPTION</div>
                    <div className="description-box">{exp.description}</div>
                    <div>{exp.date}</div>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
