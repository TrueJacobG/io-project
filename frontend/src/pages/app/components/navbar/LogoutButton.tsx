import "./navbar.css";

const LogoutButton = ({ handleLogoutClick }: { handleLogoutClick: any }) => {
  return (
    <div className="logout-button global-button-style">
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default LogoutButton;
