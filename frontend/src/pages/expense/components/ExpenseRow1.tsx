import { ExpenseType } from "../../../types/Expense";
import convertTypeToEmoji from "../../event/utils/convertTypeToEmoji";

const ExpenseRow1 = ({ exp }: { exp: ExpenseType }) => {
  return (
    <tr>
      <th>{exp.name}</th>
      <th>{convertTypeToEmoji(exp.type)}</th>
      <th>{exp.cash}</th>
      <th>{exp.author}</th>
    </tr>
  );
};

export default ExpenseRow1;
