import { IconButton } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import "./event.css";

const FinishEventButton = ({ handleFinishEvent }: { handleFinishEvent: any }) => {
  return (
    <div className="finish-event-button global-button-style">
      <IconButton onClick={handleFinishEvent}>
        <DoneAllIcon />
      </IconButton>
    </div>
  );
};

export default FinishEventButton;
