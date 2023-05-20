import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

const AddExpense = ({ handleAddExpense }: { handleAddExpense: any }) => {
  return (
    <div className="global-button-style">
      <IconButton
        onClick={() => {
          handleAddExpense();
        }}
      >
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default AddExpense;
