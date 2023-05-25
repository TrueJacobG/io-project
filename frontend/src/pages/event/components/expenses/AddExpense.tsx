import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

type Props = {
  handleAddExpense: () => void;
};

const AddExpense = ({ handleAddExpense }: Props) => {
  return (
    <div className="global-button-style">
      <IconButton onClick={handleAddExpense}>
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default AddExpense;
