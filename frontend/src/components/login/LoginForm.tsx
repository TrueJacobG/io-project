type Props = {
  isShowLoginForm: boolean;
  loginEvent: React.MouseEventHandler<HTMLButtonElement>;
};

const LoginForm = ({ isShowLoginForm, loginEvent }: Props) => {
  return (
    <div className={`${!isShowLoginForm ? "active" : "unactive"} show`}>
      <div className="login-form">
        <div className="form-box">
          <form>
            <h1>Login</h1>
            <label>Email</label>
            <br />
            <input type="text" name="email" className="email" />
            <br />
            <label>Password</label>
            <br />
            <input type="password" name="password" className="password" />
            <br />
            <button
              className="button"
              onClick={(e) => {
                loginEvent(e);
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
