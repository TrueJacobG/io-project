import "./navbar.css";

const LoginButton = ({ handleLoginClick }: { handleLoginClick: any }) => {
  return (
    <div className="login-button global-button-style">
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
};

export default LoginButton;
