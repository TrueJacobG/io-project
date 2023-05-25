import "./navbar.css";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import RegisterButton from "./RegisterButton";

type Props = {
  handleLoginClick: () => void;
  handleRegisterClick: () => void;
  handleLogoutClick: () => void;
  isLogged: boolean;
};

const Navbar = ({ handleLoginClick, handleRegisterClick, handleLogoutClick, isLogged }: Props) => {
  return (
    <div className="navbar">
      <div className="title">
        <img src="logo_full_v2.svg" width={"60%"} />
      </div>
      {!isLogged ? (
        <div>
          <LoginButton handleLoginClick={handleLoginClick} />
          <RegisterButton handleRegisterClick={handleRegisterClick} />
        </div>
      ) : (
        <div>
          <div className="info">
            <h2>{localStorage.getItem("username") !== undefined ? localStorage.getItem("username") : "Anonymous"}</h2>
          </div>
          <LogoutButton handleLogoutClick={handleLogoutClick} />
        </div>
      )}
      <div style={{ clear: "both" }}></div>
      <hr />
    </div>
  );
};

export default Navbar;
