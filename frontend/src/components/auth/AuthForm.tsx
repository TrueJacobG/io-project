import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Props = {
  isShowAuthForm: boolean;
  loginEvent: any;
  registerEvent: React.MouseEventHandler<HTMLButtonElement>;
};

const AuthForm = ({ isShowAuthForm, loginEvent, registerEvent }: Props) => {
  const [isShowLoginForm, setIsShowLoginForm] = useState(true);

  const changeForms = () => {
    setIsShowLoginForm((i) => !i);
  };

  return (
    <div className={`${!isShowAuthForm ? "active" : "unactive"} show`}>
      {isShowLoginForm ? (
        <LoginForm loginEvent={loginEvent} changeForms={changeForms} />
      ) : (
        <RegisterForm registerEvent={registerEvent} changeForms={changeForms} />
      )}
    </div>
  );
};

export default AuthForm;
