import { Link } from "react-router-dom";
import { Event } from "../../types/Event";

const EventCard = ({ event }: { event: Event }) => {
  return (
    <div className="event-card">
      <Link to={"/event/" + event.id_event}>{event.name}</Link>
      <p>{event.description}</p>
    </div>
  );
};

export default EventCard;
