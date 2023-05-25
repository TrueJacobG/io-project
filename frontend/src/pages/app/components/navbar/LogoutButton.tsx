import "./navbar.css";

type Props = { handleLogoutClick: () => void };

const LogoutButton = ({ handleLogoutClick }: Props) => {
  return (
    <div className="logout-button global-button-style">
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default LogoutButton;
