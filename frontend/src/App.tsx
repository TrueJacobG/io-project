import { useState } from "react";
import "./App.css";
import LoginForm from "./components/login/LoginForm";
import Navbar from "./components/navbar/Navbar";

function App() {
  const [isShowLoginForm, setIsShowLoginForm] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const handleLoginClick = () => {
    setIsShowLoginForm((isShowLoginForm) => !isShowLoginForm);
  };

  const handleLogoutClick = () => {
    setIsLogged((isLogged) => false);
  };

  const loginEvent = (e: any) => {
    e.preventDefault();
    console.log("login ->");
  };

  return (
    <div className="App">
      <Navbar handleLoginClick={handleLoginClick} isLogged={isLogged} handleLogoutClick={handleLogoutClick} />
      <LoginForm isShowLoginForm={isShowLoginForm} loginEvent={loginEvent} />
    </div>
  );
}

export default App;
