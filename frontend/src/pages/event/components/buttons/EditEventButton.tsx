import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./event.css";

type Props = {
  handleEditEvent: (name: string, description: string) => void;
};

const EditEventButton = ({ handleEditEvent }: Props) => {
  return (
    <div className="edit-event-button global-button-style">
      <IconButton onClick={() => handleEditEvent("todo", "todo")}>
        <EditIcon />
      </IconButton>
    </div>
  );
};

export default EditEventButton;
