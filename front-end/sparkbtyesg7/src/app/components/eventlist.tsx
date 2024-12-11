// EventList.tsx - Displays a list of events
import React from 'react';
import EventCard from './eventcard';
import '@/app/styles/eventlist.css';

/**
 * EventList Component
 *
 * Displays a list of events using individual EventCard components for each event.
 * 
 * Purpose:
 * - Provides a structured view of multiple events.
 * - Renders each event's details as a separate card to enhance readability and navigation.
 * 
 * Usage:
 * - Used in pages or components where a list of events needs to be displayed.
 * - The 'events' prop is an array of event objects, each passed to an EventCard for rendering.
 *
 * Props:
 * - 'events': An array of event objects containing details such as title, date, location, and more.
 * 
 * Features:
 * - Dynamically generates EventCard components for each event in the list.
 * - Ensures each event is uniquely identified using the 'index' as the 'key' prop.
 * - Includes logging for debugging to inspect the events array passed to the component.
 * 
 * Styling:
 * - Custom styles are applied via the 'eventlist.css' file.
 * - Provides consistent layout and spacing for the list of events.
 */


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