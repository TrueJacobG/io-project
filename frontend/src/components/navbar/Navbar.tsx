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
}: {
  handleLoginClick: any;
  handleLogoutClick: any;
  isLogged: boolean;
}) => {
  return (
    <div className="navbar">
      <AddEventButton />
      <EditEventButton />
      <Title />
      <Info />
      {!isLogged ? <LoginButton handleLoginClick={handleLoginClick} /> : <LogoutButton handleLogoutClick={handleLogoutClick} />}
    </div>
  );
};

export default Navbar;
