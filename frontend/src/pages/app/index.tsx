import { useEffect, useState } from "react";
import "./index.css";
import AuthForm from "./components/auth/AuthForm";
import Events from "./components/event/Events";
import AddEventButton from "./components/event/AddEventButton";
import Navbar from "./components/navbar/Navbar";

import { Event } from "../../types/Event";
import NotLogged from "./components/error/NotLogged";
import useFetch from "../../hooks/useFetch";
import setWrongPasswordMessage from "./utils/setWrongPasswordErrorMessage";

function App() {
  const [isShowAuthForm, setIsShowAuthForm] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isShowLoginForm, setIsShowLoginForm] = useState(true);

  const [loginError, setLoginError] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const [username, setUsername] = useState("Anonymous");

  const [isEventButtonDisabled, setIsEventButtonDisabled] = useState(false);

  const [events, setEvents] = useState<Event[]>([]);

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
    localStorage.removeItem("auth_data");
  };

  const loginEvent = (e: any, email: string, password: string) => {
    e.preventDefault();

    useFetch("/auth/login", "POST", { email: email, auth_data: password }).then((d) => {
      setIsLogged(true);
      setIsShowAuthForm(false);
      setStorageVariables(email, d.username, d.auth_data);
      loadEvents();
    });

    setLoginError(true);
  };

  const registerEvent = (e: any, username: string, email: string, password: string, rpassword: string) => {
    e.preventDefault();

    if (setWrongPasswordMessage(username, email, password, rpassword, setRegisterError)) {
      return;
    }

    setRegisterError("");

    useFetch("/auth/register", "POST", { username: username, email: email, auth_data: password })
      .then((data) => {
        setIsLogged(true);
        setIsShowAuthForm(false);

        setStorageVariables(email, username, "data.auth_data");
        loadEvents();
      })
      .catch((e) => {
        console.error(e);
        setRegisterError("Registration is not available right now!");
      });
  };

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
    useFetch("/event", "POST", {
      email: localStorage.getItem("email"),
      auth_data: localStorage.getItem("auth_data"),
      name: name,
      description: desc,
    })
      .then((data) => {
        setEvents((ev) => {
          let newEvents: Event[] = [];

          ev.forEach((e) => {
            if (e.type === "create") {
              newEvents.push({
                type: "info",
                id_event: data.id_event,
                name: name,
                description: desc,
              } as Event);
            } else {
              newEvents.push(e);
            }
          });

          return newEvents;
        });
      })
      .catch((e) => {
        console.error(e);
        console.log("something went wrong");
      });

    setIsEventButtonDisabled(false);
  };

  const setStorageVariables = (email: string, username: string, auth_data: string) => {
    setUsername(username);
    localStorage.setItem("email", email);
    localStorage.setItem("username", username);
    localStorage.setItem("auth_data", auth_data);
  };

  const loadEvents = () => {
    useFetch("/event", "GET", { email: localStorage.getItem("email"), auth_data: localStorage.getItem("auth_data") })
      .then((data) => {
        setEvents(() => data);
      })
      .catch((e) => {
        console.error(e);
        console.log("something went wrong");
      });
  };

  useEffect(() => {
    let username = localStorage.getItem("username");

    if (username !== null) {
      setUsername(username);
      setIsLogged(true);
    }

    loadEvents();
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
