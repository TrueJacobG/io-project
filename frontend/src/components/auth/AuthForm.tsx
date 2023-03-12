import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Props = {
  isShowAuthForm: boolean;
  loginEvent: any;
  registerEvent: any;
  loginError: boolean;
  registerError: string;
};

const AuthForm = ({ isShowAuthForm, loginEvent, registerEvent, loginError, registerError }: Props) => {
  const [isShowLoginForm, setIsShowLoginForm] = useState(true);

  const changeForms = () => {
    setIsShowLoginForm((i) => !i);
  };

  return (
    <div className={`${!isShowAuthForm ? "active" : "unactive"} show`}>
      {isShowLoginForm ? (
        <LoginForm loginEvent={loginEvent} changeForms={changeForms} loginError={loginError} />
      ) : (
        <RegisterForm registerEvent={registerEvent} changeForms={changeForms} registerError={registerError} />
      )}
    </div>
  );
};

export default AuthForm;
