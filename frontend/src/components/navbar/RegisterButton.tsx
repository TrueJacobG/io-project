import "./navbar.css";

const RegisterButton = ({ handleRegisterClick }: { handleRegisterClick: any }) => {
  return (
    <div className="register-button global-button-style">
      <button onClick={handleRegisterClick}>Register</button>
    </div>
  );
};

export default RegisterButton;
