import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteMember = ({ handleClickDeleteMember }: { handleClickDeleteMember: any }) => {
  return (
    <div className="">
      <IconButton
        aria-label="delete"
        onClick={() => {
          handleClickDeleteMember();
        }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default DeleteMember;
