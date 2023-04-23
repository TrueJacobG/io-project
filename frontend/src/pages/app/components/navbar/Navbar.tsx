import "./navbar.css";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import RegisterButton from "./RegisterButton";

const Navbar = ({
  handleLoginClick,
  handleRegisterClick,
  handleLogoutClick,
  isLogged,
  username,
}: {
  handleLoginClick: any;
  handleRegisterClick: any;
  handleLogoutClick: any;
  isLogged: boolean;
  username: string;
}) => {
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
            <h2>{username}</h2>
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
