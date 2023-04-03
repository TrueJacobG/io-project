import { ExpenseType } from "../../../types/Expense";
import convertTypeToEmoji from "../../event/utils/convertTypeToEmoji";

const ExpenseRow2 = ({ exp }: { exp: ExpenseType }) => {
  return (
    <tr>
      <th colSpan={4}>
        <div className="description-name">DESCRIPTION</div>
        <div className="description-box">{exp.description}</div>
        <div>{exp.date}</div>
      </th>
    </tr>
  );
};

export default ExpenseRow2;
