import { useState } from "react";
import AddEventButton from "./AddEventButton";
import EditEventButton from "./EditEventButton";
import Info from "./Info";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Title from "./Title";

const Navbar = ({
  handleLoginClick,
  handleLogoutClick,
  isLogged,
  username,
}: {
  handleLoginClick: any;
  handleLogoutClick: any;
  isLogged: boolean;
  username: string;
}) => {
  return (
    <div className="navbar">
      <AddEventButton />
      <EditEventButton />
      <Title />
      <Info username={username} />
      {!isLogged ? <LoginButton handleLoginClick={handleLoginClick} /> : <LogoutButton handleLogoutClick={handleLogoutClick} />}
    </div>
  );
};

export default Navbar;
