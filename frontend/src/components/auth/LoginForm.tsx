type Props = {
  loginEvent: React.MouseEventHandler<HTMLButtonElement>;
  changeForms: any;
};

const LoginForm = ({ loginEvent, changeForms }: Props) => {
  return (
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
      <button
        className="change-form-button"
        onClick={() => {
          changeForms();
        }}
      >
        Don't have an account? Register now
      </button>
    </div>
  );
};

export default LoginForm;
