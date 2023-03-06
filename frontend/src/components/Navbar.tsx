import AddEventButton from "./AddEventButton";
import EditEventButton from "./EditEventButton";
import Info from "./Info";
import LoginButton from "./LoginButton";
import Title from "./Title";

const Navbar = () => {
  return (
    <div className="navbar">
      <AddEventButton />
      <EditEventButton />
      <Title />
      <Info />
      <LoginButton />
    </div>
  );
};

export default Navbar;
