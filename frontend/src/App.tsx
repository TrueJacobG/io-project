import { useEffect, useState } from "react";
import "./App.css";
import AuthForm from "./components/auth/AuthForm";
import Navbar from "./components/navbar/Navbar";

function App() {
  const [isShowAuthForm, setIsShowAuthForm] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("Anonymous");
  const [loginError, setLoginError] = useState(false);

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

    fetch("http://localhost:3000/api/v1/auth/login", {
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

  const registerEvent = (e: any) => {
    e.preventDefault();
    console.log("register ->");
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
      <AuthForm isShowAuthForm={isShowAuthForm} loginEvent={loginEvent} registerEvent={registerEvent} loginError={loginError} />
    </div>
  );
}

export default App;
