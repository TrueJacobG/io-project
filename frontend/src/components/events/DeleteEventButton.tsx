const DeleteEventButton = ({ handleDeleteEvent }: { handleDeleteEvent: any }) => {
  return (
    <div>
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
