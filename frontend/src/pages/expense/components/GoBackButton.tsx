import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

const GoBackButton = ({ archived, id_event }: { archived: boolean; id_event: string }) => {
  const link = archived ? "/event/archived/" + id_event : "/event/" + id_event;

  return (
    <div className="global-button-style go-back-button">
      <Link to={link}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
    </div>
  );
};

export default GoBackButton;
