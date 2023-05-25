import "./navbar.css";

type Props = {
  handleRegisterClick: () => void;
};

const RegisterButton = ({ handleRegisterClick }: Props) => {
  return (
    <div className="register-button global-button-style">
      <button onClick={handleRegisterClick}>Register</button>
    </div>
  );
};

export default RegisterButton;
