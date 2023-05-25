import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./event.css";

type Props = {
  handleEditEvent: () => void;
};

const EditEventButton = ({ handleEditEvent }: Props) => {
  return (
    <div className="edit-event-button global-button-style">
      <IconButton onClick={handleEditEvent}>
        <EditIcon />
      </IconButton>
    </div>
  );
};

export default EditEventButton;
