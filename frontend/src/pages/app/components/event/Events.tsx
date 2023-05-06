import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { Event } from "../../../../types/Event";
import CreateEventCard from "./CreateEventCard";

const Events = ({ myEvents, invitedEvents, handleCreateEvent }: { myEvents: Event[]; invitedEvents: Event[]; handleCreateEvent: any }) => {
  return (
    <>
      <h1>My events</h1>
      {myEvents.map((ev) => {
        return ev.type === "create" ? (
          <CreateEventCard key={ev.id_event} event={ev} handleCreateEvent={handleCreateEvent} />
        ) : (
          <EventCard key={ev.id_event} event={ev} />
        );
      })}
      <h1>Involved</h1>
      {invitedEvents.map((ev) => {
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
