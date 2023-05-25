import "./auth.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Props = {
  isShowAuthForm: number;
  setIsShowAuthForm: React.Dispatch<React.SetStateAction<number>>;
  loginEvent: (e: React.MouseEvent<HTMLButtonElement>, email: string, password: string) => void;
  registerEvent: (e: React.MouseEvent<HTMLButtonElement>, username: string, email: string, password: string, rpassword: string) => void;
  loginError: string;
  registerError: string;
};

const AuthForm = ({ isShowAuthForm, setIsShowAuthForm, loginEvent, registerEvent, loginError, registerError }: Props) => {
  return (
    <div className={`${isShowAuthForm === 0 ? "unactive" : "active"} show`}>
      {isShowAuthForm === 1 ? (
        <LoginForm loginEvent={loginEvent} changeForms={setIsShowAuthForm} loginError={loginError} />
      ) : (
        <RegisterForm registerEvent={registerEvent} changeForms={setIsShowAuthForm} registerError={registerError} />
      )}
    </div>
  );
};

export default AuthForm;
