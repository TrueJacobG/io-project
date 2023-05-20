import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

const AddMember = ({ handleClickAddMember, isShowAddUserForm }: { handleClickAddMember: any; isShowAddUserForm: boolean }) => {
  return (
    <div className="add-member global-button-style">
      <IconButton onClick={handleClickAddMember} hidden={isShowAddUserForm} size="small">
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default AddMember;
