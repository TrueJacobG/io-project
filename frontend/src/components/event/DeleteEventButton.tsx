import "./event.css";

const DeleteEventButton = ({ handleDeleteEvent }: { handleDeleteEvent: any }) => {
  return (
    <div className="delete-event-button global-button-style">
      <button
        onClick={() => {
          handleDeleteEvent();
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteEventButton;
