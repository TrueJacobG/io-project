import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  handleClickDeleteMember: () => void;
};

const DeleteMember = ({ handleClickDeleteMember }: Props) => {
  return (
    <div className="">
      <IconButton aria-label="delete" onClick={handleClickDeleteMember}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default DeleteMember;
