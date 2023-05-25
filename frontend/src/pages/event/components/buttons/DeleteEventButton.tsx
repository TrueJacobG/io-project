import "./event.css";

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  handleDeleteEvent: () => void;
};

const DeleteEventButton = ({ handleDeleteEvent }: Props) => {
  return (
    <div className="delete-event-button global-button-style">
      <IconButton aria-label="delete" onClick={handleDeleteEvent}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default DeleteEventButton;
