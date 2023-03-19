import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { Event } from "./../../types/Event";
import CreateEventCard from "./CreateEventCard";

const Events = ({ events, handleCreateEvent }: { events: Event[]; handleCreateEvent: any }) => {
  // TODO fetch /events
  useEffect(() => {}, []);

  return (
    <>
      {events.map((ev) => {
        return ev.type === "create" ? (
          <CreateEventCard key={ev.id_event} event={ev} handleCreateEvent={handleCreateEvent} />
        ) : (
          <EventCard key={ev.id_event} event={ev} />
        );
      })}
    </>
  );
};

export default Events;
