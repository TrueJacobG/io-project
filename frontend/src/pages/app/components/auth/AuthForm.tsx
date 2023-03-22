import "./auth.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Props = {
  isShowAuthForm: boolean;
  loginEvent: any;
  registerEvent: any;
  isShowLoginForm: boolean;
  setIsShowLoginForm: any;
  loginError: boolean;
  registerError: string;
};

const AuthForm = ({ isShowAuthForm, loginEvent, registerEvent, isShowLoginForm, setIsShowLoginForm, loginError, registerError }: Props) => {
  return (
    <div className={`${!isShowAuthForm ? "unactive" : "active"} show`}>
      {isShowLoginForm ? (
        <LoginForm loginEvent={loginEvent} changeForms={setIsShowLoginForm} loginError={loginError} />
      ) : (
        <RegisterForm registerEvent={registerEvent} changeForms={setIsShowLoginForm} registerError={registerError} />
      )}
    </div>
  );
};

export default AuthForm;
