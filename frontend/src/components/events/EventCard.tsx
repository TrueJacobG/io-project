import { Event } from "./../../types/Event";

const EventCard = ({ event }: { event: Event }) => {
  return (
    <div className="event-card">
      <h1>{event.name}</h1>
      <p>{event.description}</p>
    </div>
  );
};

export default EventCard;
