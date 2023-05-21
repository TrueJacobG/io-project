import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

const GoBackButton = ({ archived }: { archived: boolean }) => {
  const classDiv = archived ? "global-button-style go-back-button1-archived" : "global-button-style go-back-button1";

  return (
    <div className={classDiv}>
      <Link to={"/"}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
    </div>
  );
};

export default GoBackButton;
