import "./auth.css";
import { useState } from "react";

type Props = {
  loginEvent: (e: React.MouseEvent<HTMLButtonElement>, email: string, password: string) => void;
  changeForms: React.Dispatch<React.SetStateAction<number>>;
  loginError: string;
};

const LoginForm = ({ loginEvent, changeForms, loginError }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      {loginError !== "" && <h1 className="login-error-message">{loginError}</h1>}

      <button
        className="change-form-button"
        onClick={() => {
          changeForms((i) => (i === 1 ? 2 : 1));
        }}
      >
        Don't have an account? Register now
      </button>
    </div>
  );
};

export default LoginForm;
