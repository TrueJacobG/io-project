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

  const handlePasswordStrengthVisual = () => {
    // 1 special char
    // 1 number
    // 1 big letter
    // 1 small letter
    // 2 -> > 8
    // 1 -> > 12
    // 1 -> > 16
    // 10 -> > 30
    // < 5 - week - red
    // < 7 - medium - yellow
    // >= 7 - strong - green
    // > 14 - legendary - rainbow
  };

  const getPasswordStrengthLevel = (password: string) => {
    let points: number = 0;

    ".?!-_=+".split("").forEach((l) => {
      if (password.includes(l)) {
        points++;
        return;
      }
    });

    "0123456789".split("").forEach((l) => {
      if (password.includes(l)) {
        points++;
        return;
      }
    });

    password.split("").forEach((l) => {
      if (l === l.toUpperCase()) {
        points++;
        return;
      }
    });

    password.split("").forEach((l) => {
      if (l === l.toLowerCase()) {
        points++;
        return;
      }
    });

    if (password.length > 8) {
      points += 2;
    }

    if (password.length > 12) {
      points++;
    }

    if (password.length > 16) {
      points++;
    }

    if (password.length > 30) {
      points += 10;
    }

    return points;
  };

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

      <div className={getPasswordStrengthLevel()}></div>

      {registerError !== "" && <h3 className="register-error-message">{registerError}</h3>}

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
