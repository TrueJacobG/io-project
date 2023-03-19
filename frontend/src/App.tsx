import { useEffect, useState } from "react";
import "./App.css";
import AuthForm from "./components/auth/AuthForm";
import Events from "./components/events/Events";
import AddEventButton from "./components/events/AddEventButton";
import Navbar from "./components/navbar/Navbar";

import { Event } from "./types/Event";
import NotLogged from "./components/errors/NotLogged";

let link: string;

if (import.meta.env.VITE_FAKE_API !== undefined) {
  link = import.meta.env.VITE_FAKE_API;
}

if (import.meta.env.VITE_API !== undefined) {
  link = import.meta.env.VITE_API;
}

function App() {
  const [isShowAuthForm, setIsShowAuthForm] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isShowLoginForm, setIsShowLoginForm] = useState(true);

  const [username, setUsername] = useState("Anonymous");

  const [loginError, setLoginError] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const [isEventButtonDisabled, setIsEventButtonDisabled] = useState(false);

  const handleLoginClick = () => {
    setIsShowLoginForm(true);
    setIsShowAuthForm((isShowForm) => !isShowForm);
  };

  const handleRegisterClick = () => {
    setIsShowLoginForm(false);
    setIsShowAuthForm((isShowForm) => !isShowForm);
  };

  const handleLogoutClick = () => {
    setIsLogged((isLogged) => false);
    setUsername("Anonymous");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
  };

  const loginEvent = (e: any, email: string, password: string) => {
    e.preventDefault();

    fetch(link + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, auth_data: password }),
    }).then((res) => {
      if (res.ok) {
        setLoginError(false);
        res
          .json()
          .then((data) => {
            setIsLogged(true);
            setIsShowAuthForm(false);

            setUsername(data.username);
            localStorage.setItem("email", email);
            localStorage.setItem("username", data.username);
          })
          .catch((e) => {
            console.log("something went wrong with json");
          });
      } else {
        console.log("something wrong");
      }

      setLoginError(true);
    });
  };

  const registerEvent = (e: any, username: string, email: string, password: string, rpassword: string) => {
    e.preventDefault();

    if (password !== rpassword) {
      setRegisterError("Passwords are not equal!");
      return;
    }

    if (password.length < 8 || password.length > 50) {
      setRegisterError("Wrong password length!");
      return;
    }

    if (username.length < 3 || username.length > 50) {
      setRegisterError("Wrong username length!");
      return;
    }

    if (email.length < 6 || email.length > 100) {
      setRegisterError("Wrong email length!");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setRegisterError("Wrong email format!");
      return;
    }

    setRegisterError("");

    fetch(link + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, email: email, auth_data: password }),
    }).then((res) => {
      if (res.ok) {
        setRegisterError("");
        res
          .json()
          .then((data) => {
            setIsLogged(true);
            setIsShowAuthForm(false);

            setUsername(username);
            localStorage.setItem("email", email);
            localStorage.setItem("username", username);
          })
          .catch((e) => {
            console.log("something went wrong with json");
          });
      } else {
        console.log("something went wrong");
      }

      setRegisterError("Registration is not available right now!");
    });
  };

  /* EVENTS */

  const [events, setEvents] = useState<Event[]>([]);

  const handleAddEvent = () => {
    setEvents((ev) => [
      {
        type: "create",
        id_event: "",
        name: "",
        description: "",
      } as Event,
      ...ev,
    ]);

    setIsEventButtonDisabled(true);
  };

  const handleCreateEvent = (name: string, desc: string) => {
    // TODO add to database, get id_event

    setEvents((ev) => {
      let newEvents: Event[] = [];

      ev.forEach((e) => {
        if (e.type === "create") {
          newEvents.push({
            type: "info",
            id_event: "" + Math.random(),
            name: name,
            description: desc,
          } as Event);
        } else {
          newEvents.push(e);
        }
      });

      return newEvents;
    });

    setIsEventButtonDisabled(false);
  };

  useEffect(() => {
    let username = localStorage.getItem("username");

    if (username !== null) {
      setUsername(username);
      setIsLogged(true);
    }

    // TODO
    // fetch events -> custom hook
    // after login -> fetch events
  }, []);

  return (
    <div className="App">
      <Navbar
        handleLoginClick={handleLoginClick}
        handleRegisterClick={handleRegisterClick}
        handleLogoutClick={handleLogoutClick}
        isLogged={isLogged}
        username={username}
      />
      <AuthForm
        isShowAuthForm={isShowAuthForm}
        loginEvent={loginEvent}
        registerEvent={registerEvent}
        isShowLoginForm={isShowLoginForm}
        setIsShowLoginForm={setIsShowLoginForm}
        loginError={loginError}
        registerError={registerError}
      />
      {isLogged ? (
        <div>
          <AddEventButton handleAddEvent={handleAddEvent} isEventButtonDisabled={isEventButtonDisabled} />
          <Events events={events} handleCreateEvent={handleCreateEvent} />
        </div>
      ) : (
        <NotLogged />
      )}
    </div>
  );
}

export default App;
