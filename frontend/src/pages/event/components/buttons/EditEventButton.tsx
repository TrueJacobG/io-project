import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./event.css";

const EditEventButton = ({ handleEditEvent }: { handleEditEvent: any }) => {
  return (
    <div className="edit-event-button global-button-style">
      <IconButton onClick={handleEditEvent}>
        <EditIcon />
      </IconButton>
    </div>
  );
};

export default EditEventButton;
