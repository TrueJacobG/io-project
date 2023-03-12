import { useState } from "react";

type Props = {
  registerEvent: any;
  changeForms: any;
  registerError: string;
};

const RegisterForm = ({ registerEvent, changeForms, registerError }: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rpassword, setRpassword] = useState("");

  return (
    <div className="register-form">
      <div className="form-box">
        <form>
          <h1>Register</h1>
          <label>Username</label>
          <br />
          <input
            type="text"
            name="username"
            className="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <br />
          <label>Email</label>
          <br />
          <input
            type="text"
            name="email"
            className="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <br />
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password1"
            className="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <br />
          <label>Repeat Password</label>
          <br />
          <input
            type="password"
            name="password2"
            className="password"
            value={rpassword}
            onChange={(e) => {
              setRpassword(e.target.value);
            }}
          />
          <br />
          <button
            className="auth-button"
            onClick={(e) => {
              registerEvent(e, username, email, password, rpassword);
            }}
          >
            Register
          </button>
        </form>
      </div>

      {registerError !== "" && <h3 className="register-error-message">{registerError}</h3>}

      <button
        className="change-form-button"
        onClick={() => {
          changeForms();
        }}
      >
        Do you have an account? Login now
      </button>
    </div>
  );
};

export default RegisterForm;
