import { useState } from "react";

type Props = {
  loginEvent: any;
  changeForms: any;
  loginError: boolean;
};

const LoginForm = ({ loginEvent, changeForms, loginError }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="login-form">
      <div className="form-box">
        <form>
          <h1>Login</h1>
          <label>Email</label>
          <br />
          <input type="text" name="email" className="email" value={email} onChange={handleChangeEmail} />
          <br />
          <label>Password</label>
          <br />
          <input type="password" name="password" className="password" value={password} onChange={handleChangePassword} />
          <br />
          <button
            className="auth-button"
            onClick={(e) => {
              loginEvent(e, email, password);
            }}
          >
            Login
          </button>
        </form>
      </div>

      {loginError && <h1 className="login-error-message">Wrong email or password!</h1>}

      <button
        className="change-form-button"
        onClick={() => {
          changeForms();
        }}
      >
        Don't have an account? Register now
      </button>
    </div>
  );
};

export default LoginForm;
