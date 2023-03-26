import { useState } from "react";
import "./event.css";

const EditEventButton = ({ handleEditEvent }: { handleEditEvent: any }) => {
  return (
    <div className="edit-event-button global-button-style">
      <button onClick={handleEditEvent}>Edit</button>
    </div>
  );
};

export default EditEventButton;
