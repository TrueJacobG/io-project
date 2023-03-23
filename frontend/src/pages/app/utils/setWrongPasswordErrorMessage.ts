const setWrongPasswordMessage = (username: string, email: string, password: string, rpassword: string, setRegisterError: any): boolean => {
  if (password !== rpassword) {
    setRegisterError("Passwords are not equal!");
    return true;
  }

  if (password.length < 8 || password.length > 50) {
    setRegisterError("Wrong password length!");
    return true;
  }

  if (username.length < 3 || username.length > 50) {
    setRegisterError("Wrong username length!");
    return true;
  }

  if (email.length < 6 || email.length > 100) {
    setRegisterError("Wrong email length!");
    return true;
  }

  if (!email.includes("@") || !email.includes(".")) {
    setRegisterError("Wrong email format!");
    return true;
  }

  return false;
};

export default setWrongPasswordMessage;
