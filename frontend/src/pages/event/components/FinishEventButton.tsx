import "./event.css";

const FinishEventButton = ({ handleFinishEvent }: { handleFinishEvent: any }) => {
  return (
    <div className="finish-event-button global-button-style">
      <button onClick={handleFinishEvent}>Finish</button>
    </div>
  );
};

export default FinishEventButton;
