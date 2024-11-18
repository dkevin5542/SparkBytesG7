// EventList.tsx - Displays a list of events
import React from 'react';
import EventCard from './eventcard';
import '@/app/styles/eventlist.css';


export const EventList = ({ events }) => {
  console.log("in event list", events)
  return (
    <div className="event-list">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default EventList;