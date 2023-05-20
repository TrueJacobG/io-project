import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

const GoBackButton = ({ id_event }: { id_event: any }) => {
  return (
    <div className="global-button-style go-back-button">
      <Link to={"/event/" + id_event}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
    </div>
  );
};

export default GoBackButton;
