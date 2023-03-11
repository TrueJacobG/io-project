type Props = {
  registerEvent: React.MouseEventHandler<HTMLButtonElement>;
  changeForms: any;
};

const RegisterForm = ({ registerEvent, changeForms }: Props) => {
  return (
    <div className="login-form">
      <div className="form-box">
        <form>
          <h1>Register</h1>
          <label>Username</label>
          <br />
          <input type="text" name="username" className="username" />
          <br />
          <label>Email</label>
          <br />
          <input type="text" name="email" className="email" />
          <br />
          <label>Password</label>
          <br />
          <input type="password" name="password1" className="password" />
          <br />
          <label>Repeat Password</label>
          <br />
          <input type="password" name="password2" className="password" />
          <br />
          <button
            className="button"
            onClick={(e) => {
              registerEvent(e);
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

export default RegisterForm;
