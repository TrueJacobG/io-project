const LogoutButton = ({ handleLogoutClick }: { handleLogoutClick: any }) => {
  return (
    <div className="logout-button">
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default LogoutButton;
