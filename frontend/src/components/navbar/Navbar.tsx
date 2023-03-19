import { useState } from "react";
import AddEventButton from "../events/AddEventButton";
import EditEventButton from "../events/EditEventButton";
import Info from "./Info";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import RegisterButton from "./RegisterButton";
import Title from "./Title";

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
      <Title />
      {!isLogged ? (
        <div>
          <LoginButton handleLoginClick={handleLoginClick} />
          <RegisterButton handleRegisterClick={handleRegisterClick} />
        </div>
      ) : (
        <div>
          <Info username={username} />
          <LogoutButton handleLogoutClick={handleLogoutClick} />
        </div>
      )}
      <div style={{ clear: "both" }}></div>
      <hr />
    </div>
  );
};

export default Navbar;
