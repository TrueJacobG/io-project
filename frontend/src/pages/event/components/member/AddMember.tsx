import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

type Props = {
  handleClickAddMember: () => void;
  isShowAddUserForm: boolean;
};

const AddMember = ({ handleClickAddMember, isShowAddUserForm }: Props) => {
  return (
    <div className="add-member global-button-style">
      <IconButton onClick={handleClickAddMember} hidden={isShowAddUserForm} size="small">
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default AddMember;
