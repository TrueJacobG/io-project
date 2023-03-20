import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DeleteEventButton from "../components/event/DeleteEventButton";
import EditEventButton from "../components/event/EditEventButton";

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
    fetch(link + "/event/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_event: id_event,
        email: localStorage.getItem("email"),
        auth_data: localStorage.getItem("auth_data"),
      }),
    }).then((res) => {
      if (res.ok) {
        res
          .json()
          .then((data) => {})
          .catch((e) => {
            console.log("something went wrong with json");
            console.log(e);
          });
      } else {
        console.log("something went wrong");
      }
    });

    window.location.href = "/";
  };

  useEffect(() => {
    fetch(link + "/event/" + id_event, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: localStorage.getItem("email"),
        auth_data: localStorage.getItem("auth_data"),
      }),
    }).then((res) => {
      if (res.ok) {
        res
          .json()
          .then((data) => {
            setName(data.name);
            setDesc(data.description);
          })
          .catch((e) => {
            console.log("something went wrong with json");
            console.log(e);
          });
      } else {
        console.log("something went wrong");
      }
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
