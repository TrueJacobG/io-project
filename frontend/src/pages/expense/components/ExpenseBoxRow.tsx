import { ExpenseType } from "../../../types/Expense";
import ExpenseRow1 from "./ExpenseRow1";
import ExpenseRow2 from "./ExpenseRow2";

const ExpenseBoxRow = ({ exp }: { exp: ExpenseType }) => {
  return (
    <div>
      <ExpenseRow1 exp={exp} />
      <ExpenseRow2 exp={exp} />
    </div>
  );
};

export default ExpenseBoxRow;
