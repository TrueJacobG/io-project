import "./event.css";

const AddEventButton = ({ handleAddEvent, isEventButtonDisabled }: { handleAddEvent: any; isEventButtonDisabled: boolean }) => {
  return (
    <div className="add-event global-button-style">
      <button onClick={handleAddEvent} disabled={isEventButtonDisabled}>
        ➕ Add Event ➕
      </button>
    </div>
  );
};

export default AddEventButton;
