const RegisterButton = ({ handleRegisterClick }: { handleRegisterClick: any }) => {
  return (
    <div className="register-button navbar-buttons">
      <button onClick={handleRegisterClick}>Register</button>
    </div>
  );
};

export default RegisterButton;
