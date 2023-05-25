import "./event.css";

type Props = {
  handleAddEvent: () => void;
  isEventButtonDisabled: boolean;
};

const AddEventButton = ({ handleAddEvent, isEventButtonDisabled }: Props) => {
  return (
    <div className="add-event global-button-style">
      <button onClick={handleAddEvent} disabled={isEventButtonDisabled}>
        ➕ Add Event ➕
      </button>
    </div>
  );
};

export default AddEventButton;
