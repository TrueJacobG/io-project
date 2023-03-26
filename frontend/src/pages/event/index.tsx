import "./index.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useFetchWithBody from "../../hooks/useFetchWithBody";
import DeleteEventButton from "./components/DeleteEventButton";
import EditEventButton from "./components/EditEventButton";
import Members from "./components/member/Members";
import AddMember from "./components/member/AddMember";

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

  const [members, setMembers] = useState([
    "test1@test1.com",
    "test2@test2.com",
    "test3@test3.com",
    "test2@test2.com",
    "test3@test3.com",
    "test2@test2.com",
    "test3@test3.com",
    "test2@test2.com",
    "test3@test3.com",
  ]);

  const handleDeleteEvent = () => {
    useFetch("/event/" + id_event, "DELETE", localStorage.getItem("token") as string)
      .then(() => {})
      .catch((e) => {
        console.log("something went wrong");
        console.log(e);
      });

    window.location.href = "/";
  };

  useEffect(() => {
    useFetch("/event/" + id_event, "GET", localStorage.getItem("token") as string)
      .then((data) => {
        setName(data.name);
        setDesc(data.description);
        /*setMembers(data.users);*/
      })
      .catch((e) => {
        console.log("something went wrong");
        console.log(e);
      });
  }, []);

  return (
    <div>
      <Link to={"/"} className="link-main-page">
        🔙
      </Link>
      <h1>{name}</h1>
      <p>{desc}</p>
      <hr />
      <div className="buttons">
        <DeleteEventButton handleDeleteEvent={handleDeleteEvent} />
        <EditEventButton />
        <div className="finish-event-button global-button-style">
          <button>Finish</button>
        </div>
        <div style={{ clear: "both" }}></div>
      </div>
      <hr />
      <div className="expenses">{/* TODO */}</div>
      <hr />
      <div className="bottom">
        <h1>Members</h1>
        <AddMember />
        <Members members={members} />
      </div>
    </div>
  );
};

export default Event;
