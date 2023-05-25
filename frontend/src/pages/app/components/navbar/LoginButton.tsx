import "./navbar.css";

type Props = { handleLoginClick: () => void };

const LoginButton = ({ handleLoginClick }: Props) => {
  return (
    <div className="login-button global-button-style">
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
};

export default LoginButton;
