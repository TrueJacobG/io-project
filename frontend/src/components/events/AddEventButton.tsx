const AddEventButton = ({ handleAddEvent }: { handleAddEvent: any }) => {
  return (
    <div className="add-event navbar-buttons">
      <button onClick={handleAddEvent}>➕ Add Event ➕</button>
    </div>
  );
};

export default AddEventButton;
