import "./event.css";
import { useState } from "react";
import { Event } from "../../../../types/Event";

type Props = {
  event: Event;
  handleCreateEvent: (name: string, desc: string) => void;
};

const CreateEventCard = ({ event, handleCreateEvent }: Props) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="event-card">
      <label>Name: </label>
      <br />
      <input type="text" name="name" id="name" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <label>Description: </label>
      <br />
      <textarea name="description" id="description" value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
      <br />
      <button
        onClick={() => {
          handleCreateEvent(name, desc);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default CreateEventCard;
