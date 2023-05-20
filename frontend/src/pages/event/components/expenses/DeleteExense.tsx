import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteExpense = ({ handleDeleteExpense, id_expense }: { handleDeleteExpense: any; id_expense: string }) => {
  return (
    <div className="delete-expense-button global-button-style">
      <IconButton
        onClick={() => {
          handleDeleteExpense(id_expense);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default DeleteExpense;
