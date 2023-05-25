import { IconButton } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import "./event.css";

type Props = {
  handleFinishEvent: () => void;
};

const FinishEventButton = ({ handleFinishEvent }: Props) => {
  return (
    <div className="finish-event-button global-button-style">
      <IconButton onClick={handleFinishEvent}>
        <DoneAllIcon />
      </IconButton>
    </div>
  );
};

export default FinishEventButton;
