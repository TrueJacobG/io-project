import { useState } from "react";
import "./App.css";
import AuthForm from "./components/auth/AuthForm";
import Navbar from "./components/navbar/Navbar";

function App() {
  const [isShowAuthForm, setIsShowAuthForm] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const handleLoginClick = () => {
    setIsShowAuthForm((isShowLoginForm) => !isShowLoginForm);
  };

  const handleLogoutClick = () => {
    setIsLogged((isLogged) => false);
  };

  const loginEvent = (e: any) => {
    e.preventDefault();
    console.log("login ->");
  };

  const registerEvent = (e: any) => {
    e.preventDefault();
    console.log("register ->");
  };

  return (
    <div className="App">
      <Navbar handleLoginClick={handleLoginClick} isLogged={isLogged} handleLogoutClick={handleLogoutClick} />
      <AuthForm isShowAuthForm={isShowAuthForm} loginEvent={loginEvent} registerEvent={registerEvent} />
    </div>
  );
}

export default App;
