import { useParams } from "react-router-dom";
import EditEventButton from "../components/events/EditEventButton";

const Event = () => {
  const { id_event } = useParams();

  // TODO fetch event by id

  return (
    <div>
      <EditEventButton />
    </div>
  );
};

export default Event;
