import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

type Props = {
  archived: boolean;
  idEvent: string;
};

const GoBackButton = ({ archived, idEvent }: Props) => {
  const link = archived ? "/event/archived/" + idEvent : "/event/" + idEvent;

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
