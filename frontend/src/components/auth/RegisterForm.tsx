import { useState } from "react";
import getPasswordLevelName from "../../utils/getPasswordLevelName";
import getPasswordStrengthLevel from "../../utils/getPasswordStrengthLevel";

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

  const [isOnFocusPassword, setIsOnFocusPassword] = useState(false);

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
            onFocus={(_) => setIsOnFocusPassword(true)}
            onBlur={(_) => setIsOnFocusPassword(false)}
            onChange={(e) => {
              setPassword((_) => e.target.value);
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

          {registerError !== "" && (
            <div className="register-error-message">
              <h3>{registerError}</h3>
            </div>
          )}

          {isOnFocusPassword && (
            <div className="password-strength-level">
              <label>Password Strength</label>
              <div className="default-box">
                <div className={getPasswordLevelName(password)}>
                  <h3>{getPasswordLevelName(password)}</h3>
                </div>
              </div>
            </div>
          )}

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

      <button
        className="change-form-button"
        onClick={() => {
          changeForms((i: any) => !i);
        }}
      >
        Do you have an account? Login now
      </button>
    </div>
  );
};

export default RegisterForm;
