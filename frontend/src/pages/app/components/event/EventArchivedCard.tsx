import { Link } from "react-router-dom";
import { Event } from "../../../../types/Event";

const EventArchivedCard = ({ event }: { event: Event }) => {
  return (
    <div className="event-card">
      <Link to={"/event/archived/" + event.id_event} className="event-link">
        <div className="event-box">
          <h1 className="event-name event-text">{event.name}</h1>
          <p className="event-desc event-text">{event.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default EventArchivedCard;
