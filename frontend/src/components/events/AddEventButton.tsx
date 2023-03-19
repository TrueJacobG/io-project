const AddEventButton = ({ handleAddEvent, isEventButtonDisabled }: { handleAddEvent: any; isEventButtonDisabled: boolean }) => {
  return (
    <div className="add-event navbar-buttons">
      <button onClick={handleAddEvent} disabled={isEventButtonDisabled}>
        ➕ Add Event ➕
      </button>
    </div>
  );
};

export default AddEventButton;
