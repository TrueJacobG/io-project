import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { Event } from "../../../../types/Event";
import CreateEventCard from "./CreateEventCard";
import EventArchivedCard from "./EventArchivedCard";

type Props = { myEvents: Event[]; invitedEvents: Event[]; archivedEvents: Event[]; handleCreateEvent: any };

const Events = ({ myEvents, invitedEvents, archivedEvents, handleCreateEvent }: Props) => {
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
        return ev.type !== "create" && <EventCard key={ev.id_event} event={ev} />;
      })}
      <h1>Archived</h1>
      {archivedEvents.map((ev) => {
        return ev.type !== "create" && <EventArchivedCard key={ev.id_event} event={ev} />;
      })}
    </>
  );
};

export default Events;
