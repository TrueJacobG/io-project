import "./index.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useFetchWithBody from "../../hooks/useFetchWithBody";
import DeleteEventButton from "./components/DeleteEventButton";
import EditEventButton from "./components/EditEventButton";
import Members from "./components/member/Members";
import AddMember from "./components/member/AddMember";
import AddUserForm from "./components/member/AddUserForm";

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
  const [members, setMembers] = useState<string[]>([]);

  const [isShowAddUserForm, setIsShowAddUserForm] = useState(false);

  const handleDeleteEvent = () => {
    useFetch("/event/" + id_event, "DELETE", localStorage.getItem("token") as string)
      .then(() => {})
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });

    window.location.href = "/";
  };

  const handleEditEvent = (name: string, description: string) => {
    useFetchWithBody("/event/" + id_event, "PUT", localStorage.getItem("token") as string, { name: name, description: description })
      .then(() => {})
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });
  };

  const handleFinishEvent = () => {};

  const handleClickAddMember = () => {
    setIsShowAddUserForm(true);
  };

  const handleAddUser = (email: string) => {
    useFetchWithBody("/event/" + id_event + "/user", "POST", localStorage.getItem("token") as string, { user_email: email })
      .then(() => {
        setMembers(() => [...members, email]);
      })
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });
    setIsShowAddUserForm(false);
  };

  const handleDeleteMember = (email: string) => {
    useFetchWithBody("/event/" + id_event + "/user", "DELETE", localStorage.getItem("token") as string, { user_email: email })
      .then(() => {
        let newMembers: string[] = [];

        members.forEach((member) => {
          if (member !== email) {
            newMembers.push(member);
          }
        });

        setMembers(() => newMembers);
      })
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });
  };

  useEffect(() => {
    useFetch("/event/" + id_event, "GET", localStorage.getItem("token") as string)
      .then((data) => {
        setName(data.name);
        setDesc(data.description);
        setMembers(data.users);
      })
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
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
        <EditEventButton handleEditEvent={handleEditEvent} />
        <div className="finish-event-button global-button-style">
          <button>Finish</button>
        </div>
        <div style={{ clear: "both" }}></div>
      </div>
      <hr />
      <div className="expenses">
        <h1>Expenses</h1>
        {/* TODO */}
      </div>
      <hr />
      <div className="bottom">
        <h1>Members</h1>
        <AddMember handleClickAddMember={handleClickAddMember} isShowAddUserForm={isShowAddUserForm} />
        {isShowAddUserForm ? <AddUserForm handleAddUser={handleAddUser} /> : <></>}
        <Members members={members} handleDeleteMember={handleDeleteMember} />
      </div>
    </div>
  );
};

export default Event;
