import { useEffect, useState } from "react";
import "./App.css";
import AuthForm from "./components/auth/AuthForm";
import Navbar from "./components/navbar/Navbar";

function App() {
  const [isShowAuthForm, setIsShowAuthForm] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const [username, setUsername] = useState("Anonymous");

  const [loginError, setLoginError] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const handleLoginClick = () => {
    setIsShowAuthForm((isShowLoginForm) => !isShowLoginForm);
  };

  const handleLogoutClick = () => {
    setIsLogged((isLogged) => false);
    setUsername("Anonymous");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
  };

  const loginEvent = (e: any, email: string, password: string) => {
    e.preventDefault();

    // http://localhost:3000/api/v1/auth/login

    fetch("https://localhost:7012/BackEnd/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, auth_data: password }),
    }).then((res) => {
      if (res.ok) {
        setLoginError(false);
        res.json().then((data) => {
          setIsLogged(true);
          setIsShowAuthForm(false);

          setUsername(data.username);
          localStorage.setItem("email", email);
          localStorage.setItem("username", data.username);
        });
        return res.json();
      }

      setLoginError(true);
    });
  };

  const registerEvent = (e: any, username: string, email: string, password: string, rpassword: string) => {
    e.preventDefault();
    console.log(username, email, password, rpassword);

    if (password !== rpassword) {
      setRegisterError("Passwords are not equal!");
      return;
    }

    if (password.length < 8 || password.length > 50) {
      setRegisterError("Wrong password length!");
      return;
    }

    if (username.length < 3 || username.length > 50) {
      setRegisterError("Wrong username length!");
      return;
    }

    if (email.length < 6 || email.length > 100) {
      setRegisterError("Wrong email length!");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setRegisterError("Wrong email format!");
      return;
    }

    setRegisterError("");

    // http://localhost:3000/api/v1/auth/register

    fetch("https://localhost:7012/BackEnd/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, email: email, auth_data: password }),
    }).then((res) => {
      if (res.ok) {
        setRegisterError("");
        res.json().then((data) => {
          setIsLogged(true);
          setIsShowAuthForm(false);

          setUsername(username);
          localStorage.setItem("email", email);
          localStorage.setItem("username", username);
        });
        return res.json();
      }

      setRegisterError("Registration is not available right now!");
    });
  };

  useEffect(() => {
    let username = localStorage.getItem("username");

    if (username !== null) {
      setUsername(username);
      setIsLogged(true);
    }
  }, []);

  return (
    <div className="App">
      <Navbar handleLoginClick={handleLoginClick} handleLogoutClick={handleLogoutClick} isLogged={isLogged} username={username} />
      <AuthForm
        isShowAuthForm={isShowAuthForm}
        loginEvent={loginEvent}
        registerEvent={registerEvent}
        loginError={loginError}
        registerError={registerError}
      />
    </div>
  );
}

export default App;
