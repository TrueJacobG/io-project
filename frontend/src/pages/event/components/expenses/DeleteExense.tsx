import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  handleDeleteExpense: (idExpense: string) => void;
  idExpense: string;
};

const DeleteExpense = ({ handleDeleteExpense, idExpense }: Props) => {
  return (
    <div className="delete-expense-button global-button-style">
      <IconButton
        onClick={() => {
          handleDeleteExpense(idExpense);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default DeleteExpense;
