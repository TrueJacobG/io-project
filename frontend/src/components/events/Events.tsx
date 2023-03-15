import { useState } from "react";
import EventCard from "./EventCard";
import { Event } from "./../../types/Event";

const Events = ({ events }: { events: Event[] }) => {
  return (
    <>
      {events.map((ev) => (
        <EventCard key={ev.id_event} event={ev} />
      ))}
    </>
  );
};

export default Events;
