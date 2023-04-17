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
import useFetchWithBody from "../../hooks/useFetchWithBody";

function App() {
  const [isShowAuthForm, setIsShowAuthForm] = useState(0);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("Anonymous");

  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [isEventButtonDisabled, setIsEventButtonDisabled] = useState(false);

  const [events, setEvents] = useState<Event[]>([]);

  const handleLoginClick = () => {
    if (isShowAuthForm === 1) {
      setIsShowAuthForm(0);
    } else {
      setIsShowAuthForm(1);
    }
  };

  const handleRegisterClick = () => {
    if (isShowAuthForm === 2) {
      setIsShowAuthForm(0);
    } else {
      setIsShowAuthForm(2);
    }
  };

  const handleLogoutClick = () => {
    setIsLogged(false);
    setUsername("Anonymous");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const loginEvent = (e: any, email: string, password: string) => {
    e.preventDefault();

    setLoginError("");

    useFetchWithBody("/auth/login", "POST", "", { email: email, auth_data: password })
      .then((data) => {
        if (data.token !== undefined && data.username !== undefined) {
          setEvents([]);
          setStorageVariables(data.token, data.username);
          setIsLogged(true);
          setIsShowAuthForm(0);
          loadEvents();
        }
      })
      .catch((err) => {
        console.error(err);
        setLoginError("Wrong email/username or password!");
      });
  };

  const registerEvent = (e: any, username: string, email: string, password: string, rpassword: string) => {
    e.preventDefault();

    if (setWrongPasswordMessage(username, email, password, rpassword, setRegisterError)) {
      return;
    }

    setRegisterError("");

    useFetchWithBody("/auth/register", "POST", "", {
      username: username,
      email: email,
      auth_data: password,
    })
      .then((data) => {
        setEvents([]);
        setStorageVariables(data.token, username);
        setIsLogged(true);
        setIsShowAuthForm(0);
        loadEvents();
      })
      .catch((err) => {
        console.error(err);
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
    useFetchWithBody("/event", "POST", localStorage.getItem("token") as string, {
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
        console.error("something went wrong");
      });

    setIsEventButtonDisabled(false);
  };

  const setStorageVariables = (token: string, username: string) => {
    setUsername(username);
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
  };

  const loadEvents = () => {
    useFetch("/event", "GET", localStorage.getItem("token") as string)
      .then((data) => {
        // TODO!
        // setActiveEvents(data.active_events);
        // setUserEvents(data.user_events);
        // setInvitedEvents(data.invited_events);
        setEvents(data);
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  useEffect(() => {
    let username = localStorage.getItem("username");

    if (username !== null) {
      setUsername(username);
      setIsLogged(true);
      loadEvents();
    }
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
        setIsShowAuthForm={setIsShowAuthForm}
        loginEvent={loginEvent}
        registerEvent={registerEvent}
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
