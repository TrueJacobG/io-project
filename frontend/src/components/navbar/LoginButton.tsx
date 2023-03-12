const LoginButton = ({ handleLoginClick }: { handleLoginClick: any }) => {
  return (
    <div className="login-button navbar-buttons">
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
};

export default LoginButton;
