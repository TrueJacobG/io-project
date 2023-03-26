import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import DeleteEventButton from "./components/DeleteEventButton";
import EditEventButton from "./components/EditEventButton";

let link: string;

if (import.meta.env.VITE_FAKE_API !== undefined) {
  link = import.meta.env.VITE_FAKE_API;
}

if (import.meta.env.VITE_API !== undefined) {
  link = import.meta.env.VITE_API;
}

const Event = () => {
  const { id_event } = useParams();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // TODO fetch event by id

  const handleDeleteEvent = () => {
    useFetch("/event/" + id_event, "DELETE", { email: localStorage.getItem("email"), auth_data: localStorage.getItem("auth_data") })
      .then((data) => {})
      .catch((e) => {
        console.log("something went wrong with json");
        console.log(e);
      });

    window.location.href = "/";
  };

  useEffect(() => {
    useFetch("/event/" + id_event, "GET", { email: localStorage.getItem("email"), auth_data: localStorage.getItem("auth_data") })
      .then((data) => {
        setName(data.name);
        setDesc(data.description);
      })
      .catch((e) => {
        console.log("something went wrong with json");
        console.log(e);
      });
  }, []);

  return (
    <div>
      <Link to={"/"} className="link-main-page">
        🔙
      </Link>
      <DeleteEventButton handleDeleteEvent={handleDeleteEvent} />
      <EditEventButton />
      <hr />
      <h1>{name}</h1>
      <p>{desc}</p>
    </div>
  );
};

export default Event;
