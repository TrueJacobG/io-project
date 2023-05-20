import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

const GoBackButton = () => {
  return (
    <div className="global-button-style go-back-button1">
      <Link to={"/"}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
    </div>
  );
};

export default GoBackButton;
